"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import { useChat } from "@/context/ChatContext";

export default function ChatLayout() {
  const { activeConversationId } = useChat();
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="chat-layout">
      <div className={`sidebar-panel ${showSidebar || !activeConversationId ? "mobile-show" : "mobile-hide"}`}>
        <Sidebar onSelectConvo={() => setShowSidebar(false)} />
      </div>
      <div className={`chat-panel ${!showSidebar && activeConversationId ? "mobile-show" : "mobile-hide"}`}>
        <ChatWindow onBack={() => setShowSidebar(true)} />
      </div>
    </div>
  );
}
