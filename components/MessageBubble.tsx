"use client";

import { Message, User } from "@/types/chat";
import { format } from "date-fns";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  sender?: User;
  showAvatar: boolean;
  showSenderName: boolean;
}

function StatusIcon({ status }: { status: Message["status"] }) {
  if (status === "sent") return <Check size={12} className="text-slate-400" />;
  if (status === "delivered")
    return <CheckCheck size={12} className="text-slate-400" />;
  if (status === "read") return <CheckCheck size={12} className="text-blue-400" />;
  return null;
}

export default function MessageBubble({
  message,
  isOwn,
  sender,
  showAvatar,
  showSenderName,
}: MessageBubbleProps) {
  if (message.type === "system") {
    return (
      <div className="flex justify-center my-3">
        <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-end gap-2 mb-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div className="w-7 shrink-0">
        {!isOwn && showAvatar && sender && (
          <img
            src={sender.avatar}
            alt={sender.name}
            className="w-7 h-7 rounded-full"
          />
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col`} style={{marginTop:"0.4rem",marginBottom:"0.4rem"}}>
        {showSenderName && !isOwn && sender && (
          <span className="text-xs text-slate-400 mb-1 ml-1">
            {sender.name}
          </span>
        )}
        <div
          className={`message-bubble ${isOwn ? "own" : "other"}`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
          <div
            className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}
          >
            <span className="text-[10px] opacity-60">
              {format(new Date(message.timestamp), "h:mm a")}
            </span>
            {isOwn && <StatusIcon status={message.status} />}
          </div>
        </div>
      </div>
    </div>
  );
}
