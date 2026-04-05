"use client";

import { useChat } from "@/context/ChatContext";
import { Conversation, User } from "@/types/chat";
import MessageBubble from "./MessageBubble";
import { useEffect, useRef, useState } from "react";
import {
  Phone,
  Video,
  MoreVertical,
  Send,
  Smile,
  Paperclip,
  Mic,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";

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

function getStatusText(convo: Conversation, currentUserId: string): string {
  if (convo.isGroup) {
    return `${convo.participants.length} members`;
  }
  const other = convo.participants.find(
    (p) => p.id !== currentUserId
  ) as User;
  if (other?.status === "online") return "Online";
  if (other?.status === "away") return `Away · ${other.lastSeen}`;
  return `Last seen ${other?.lastSeen || "a while ago"}`;
}

const EMOJIS = ["😊", "😂", "❤️", "👍", "🎉", "🔥", "😎", "🤔", "👏", "💡", "✅", "🚀", "😅", "🙏", "💪"];

export default function ChatWindow({
  onBack,
}: {
  onBack?: () => void;
}) {
  const { conversations, activeConversationId, sendMessage, currentUser } =
    useChat();
  const [inputValue, setInputValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const activeConvo = conversations.find(
    (c) => c.id === activeConversationId
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvo?.messages]);

  const handleSend = () => {
    if (!inputValue.trim() || !activeConversationId) return;
    sendMessage(inputValue.trim(), activeConversationId);
    setInputValue("");
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setIsTyping(false), 2000);
  };

  if (!activeConvo) {
    return (
      <div className="chat-empty flex flex-col items-center justify-center h-full">
        <div className="empty-icon mb-5">
          <MessageSquare size={48} className="text-slate-600" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Your Messages
        </h2>
        <p className="text-slate-400 text-sm text-center max-w-xs">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    );
  }

  const name = getConversationName(activeConvo, currentUser.id);
  const avatar = getConversationAvatar(activeConvo, currentUser.id);
  const statusText = getStatusText(activeConvo, currentUser.id);
  const isOnline =
    !activeConvo.isGroup &&
    activeConvo.participants.find((p) => p.id !== currentUser.id)?.status ===
      "online";

  // Group messages by date
  const messages = activeConvo.messages;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="chat-header px-4 py-3 flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="icon-btn mr-1 md:hidden">
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="avatar-wrapper">
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full bg-slate-700"
          />
          {isOnline && <span className="status-dot online" />}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white text-sm">{name}</p>
          <p className={`text-xs ${isOnline ? "text-green-400" : "text-slate-400"}`}>
            {statusText}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className="icon-btn">
            <Phone size={18} />
          </button>
          <button className="icon-btn">
            <Video size={18} />
          </button>
          <button className="icon-btn">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scroll px-4 py-4 messages-area">
        {messages.map((msg, idx) => {
          const sender = activeConvo.participants.find(
            (p) => p.id === msg.senderId
          );
          const prevMsg = messages[idx - 1];
          const showAvatar =
            !prevMsg || prevMsg.senderId !== msg.senderId;
          const showSenderName = activeConvo.isGroup && showAvatar;

          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === "me"}
              sender={sender}
              showAvatar={showAvatar}
              showSenderName={showSenderName}
            />
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2 mt-2">
            <img
              src={avatar}
              alt={name}
              className="w-7 h-7 rounded-full"
            />
            <div className="typing-indicator">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Emoji picker */}
      {showEmoji && (
        <div className="emoji-picker px-4 py-2 flex flex-wrap gap-2">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                setInputValue((v) => v + emoji);
                inputRef.current?.focus();
              }}
              className="text-xl hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="chat-input-area px-4 py-3 flex items-center gap-2">
        <button
          className={`icon-btn ${showEmoji ? "text-yellow-400" : ""}`}
          onClick={() => setShowEmoji(!showEmoji)}
        >
          <Smile size={20} />
        </button>
        <button className="icon-btn">
          <Paperclip size={18} />
        </button>
        <div className="flex-1 input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="chat-input"
          />
        </div>
        {inputValue.trim() ? (
          <button className="send-btn" onClick={handleSend}>
            <Send size={18} />
          </button>
        ) : (
          <button className="icon-btn">
            <Mic size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
