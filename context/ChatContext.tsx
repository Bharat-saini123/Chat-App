"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Conversation, Message, User } from "@/types/chat";
import { initialConversations, currentUser } from "@/lib/mockData";
import { v4 as uuidv4 } from "uuid";

interface ChatContextType {
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversation: (id: string) => void;
  sendMessage: (content: string, conversationId: string) => void;
  currentUser: User;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");

  const setActiveConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  const sendMessage = useCallback((content: string, conversationId: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      content,
      senderId: "me",
      timestamp: new Date().toISOString(),
      type: "text",
      status: "sent",
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            messages: [...c.messages, newMessage],
            lastMessage: newMessage,
          };
        }
        return c;
      })
    );

    // Simulate reply after 1-2s
    const delay = 1000 + Math.random() * 1500;
    setTimeout(() => {
      const replies = [
        "That's interesting! 🤔",
        "Got it, thanks!",
        "Sure thing 👍",
        "Let me check on that...",
        "Sounds good!",
        "I'll get back to you on this.",
        "Great idea! 💡",
        "Agreed 100%!",
        "Haha, nice one 😄",
        "On it!",
      ];
      const replyContent = replies[Math.floor(Math.random() * replies.length)];

      setConversations((prev) => {
        const convo = prev.find((c) => c.id === conversationId);
        if (!convo) return prev;
        const otherParticipants = convo.participants.filter(
          (p) => p.id !== "me"
        );
        const sender =
          otherParticipants[
            Math.floor(Math.random() * otherParticipants.length)
          ];
        const replyMsg: Message = {
          id: uuidv4(),
          content: replyContent,
          senderId: sender.id,
          timestamp: new Date().toISOString(),
          type: "text",
          status: "delivered",
        };
        return prev.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: [...c.messages, replyMsg],
              lastMessage: replyMsg,
              unreadCount:
                conversationId === activeConversationId
                  ? 0
                  : c.unreadCount + 1,
            };
          }
          return c;
        });
      });
    }, delay);
  }, [activeConversationId]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        setActiveConversation,
        sendMessage,
        currentUser,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be inside ChatProvider");
  return ctx;
}
