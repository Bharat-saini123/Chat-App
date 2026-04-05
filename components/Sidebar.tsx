"use client";

import { useChat } from "@/context/ChatContext";
import { Conversation, User } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { Search, Plus, Settings, MessageSquare } from "lucide-react";

function getConversationName(convo: Conversation, currentUserId: string) {
  if (convo.isGroup) return convo.groupName || "Group Chat";
  const other = convo.participants.find((p) => p.id !== currentUserId);
  return other?.name || "Unknown";
}

function getConversationAvatar(convo: Conversation, currentUserId: string) {
  if (convo.isGroup) return convo.groupAvatar || "";
  const other = convo.participants.find((p) => p.id !== currentUserId);
  return other?.avatar || "";
}

function getOnlineStatus(convo: Conversation, currentUserId: string): string {
  if (convo.isGroup) return "";
  const other = convo.participants.find((p) => p.id !== currentUserId) as User;
  return other?.status || "offline";
}

export default function Sidebar({ onSelectConvo }: { onSelectConvo?: () => void }) {
  const { conversations, activeConversationId, setActiveConversation, currentUser, searchQuery, setSearchQuery } = useChat();

  const filtered = conversations.filter((c) =>
    getConversationName(c, currentUser.id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((s, c) => s + c.unreadCount, 0);

  const handleSelect = (id: string) => {
    setActiveConversation(id);
    onSelectConvo?.();
  };

  return (
    <div className="sidebar flex flex-col h-full">
      <div className="sidebar-header px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar-wrapper">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full" />
            <span className="status-dot online" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-none">{currentUser.name}</p>
            <p className="text-xs" style={{color:'var(--text-secondary)'}}>Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {totalUnread > 0 && <span className="badge">{totalUnread}</span>}
          <button className="icon-btn"><Plus size={18} /></button>
          <button className="icon-btn"><Settings size={18} /></button>
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="search-box">
          <Search size={15} style={{color:'var(--text-secondary)'}} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll mt-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16" style={{color:'var(--text-secondary)'}}>
            <MessageSquare size={32} className="mb-2 opacity-40" />
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          filtered.map((convo) => {
            const name = getConversationName(convo, currentUser.id);
            const avatar = getConversationAvatar(convo, currentUser.id);
            const status = getOnlineStatus(convo, currentUser.id);
            const isActive = convo.id === activeConversationId;
            const lastMsg = convo.lastMessage;
            const isOwn = lastMsg?.senderId === "me";

            return (
              <button
                key={convo.id}
                onClick={() => handleSelect(convo.id)}
                className={`convo-item w-full text-left ${isActive ? "active" : ""}`}
              >
                <div className="relative shrink-0">
                  <img src={avatar} alt={name} className="w-11 h-11 rounded-full" style={{background:'var(--bg-card)'}} />
                  {!convo.isGroup && <span className={`status-dot ${status}`} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white truncate">{name}</span>
                    {lastMsg && (
                      <span className="text-xs shrink-0 ml-1" style={{color:'var(--text-secondary)'}}>
                        {formatDistanceToNow(new Date(lastMsg.timestamp), { addSuffix: false })
                          .replace("about ", "").replace(" minutes", "m").replace(" minute", "m")
                          .replace(" hours", "h").replace(" hour", "h").replace(" days", "d").replace(" day", "d")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs truncate max-w-[160px]" style={{color:'var(--text-secondary)'}}>
                      {isOwn && <span style={{opacity:0.6}}>You: </span>}
                      {lastMsg?.content || "No messages yet"}
                    </p>
                    {convo.unreadCount > 0 && <span className="badge shrink-0 ml-1">{convo.unreadCount}</span>}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
