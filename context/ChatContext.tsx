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
        "Got it!",
        "Understood!",
        "Noted, thanks!",
        "Absolutely!",
        "I agree!",
        "Exactly!",
        "Haha, nice one! 😄",
        "LOL 😂",
        "Good one!",
        "Let me check on that...",
        "I’ll get back to you.",
        "On it!",
        "Working on it!",
        "Sounds good!",
        "Great idea! 💡",
        "Interesting point!",
        "Thanks for sharing!",
        "I see what you mean.",
        "Makes sense!",
        "Will do!",
        "Perfect!",
        "Totally agree!",
        "That’s clever! 😏",
        "I like that! 👍",
        "Fair enough.",
        "Gotcha!",
        "Understood completely.",
        "I’ll handle it.",
        "Absolutely correct!",
        "Haha, very funny 😆",
        "Noted! ✅",
        "I understand.",
        "I’ll take care of it.",
        "Good point!",
        "Agreed!",
        "Exactly right.",
        "That works!",
        "Sure thing!",
        "I’ll look into it.",
        "Interesting! 🤔",
        "That makes sense.",
        "I like your idea.",
        "Will check on it.",
        "Sounds perfect!",
        "Yes, agreed!",
        "I see your point.",
        "I’ll get it done.",
        "That’s smart! 💡",
        "Haha, nice one!",
        "I totally agree.",
        "Alright, thanks!",
        "Will do that.",
        "Noted with thanks.",
        "I like it.",
        "Great thinking!",
        "Exactly my thought!",
        "Good catch!",
        "I’ll follow up.",
        "On my way!",
        "Understood, thanks!",
        "Makes total sense.",
        "I’ll check it.",
        "Sounds like a plan!",
        "Yes, absolutely!",
        "Thanks for pointing that out!",
        "I get it now.",
        "Will take care.",
        "All good!",
        "Very nice! 😎",
        "I see!",
        "Got it, thanks for that.",
        "That’s interesting indeed.",
        "I’m on it.",
        "Understood perfectly!",
        "I’ll handle that.",
        "Right, makes sense.",
        "Cool! 😄",
        "Perfectly clear.",
        "Thanks for letting me know.",
        "I like that idea!",
        "Sounds reasonable.",
        "Noted, I’ll act on it.",
        "Exactly what I thought!",
        "Great, thanks!",
        "Haha, that’s good 😂",
        "I’ll take it from here.",
        "Understood completely.",
        "That’s fair.",
        "Good thinking! 💡",
        "Yes, I agree.",
        "I’ll do that soon.",
        "Makes sense to me.",
        "I got it.",
        "Alright!",
        "Interesting suggestion!",
        "Thanks, will do.",
        "I like your thinking.",
        "Exactly what we needed.",
        "I’ll follow up soon.",
        "Sounds perfect! 👍",
        "That works for me.",
        "Haha, good one! 😆",
        "I’m on it now.",
        "Understood, will do.",
        "I’ll take care of that.",
        "Good idea indeed! 💡",
        "Yes, exactly!",
        "I like this approach.",
        "Will check it out.",
        "Got it, understood!",
        "Makes sense 👍",
        "Alright, I got it.",
        "Interesting thought!",
        "Thanks for that!",
        "I totally understand.",
        "Will get it done.",
        "Perfect, thanks!",
        "I’ll see to it.",
        "Yes, makes sense.",
        "Haha, that’s clever 😄",
        "Good one! 👍",
        "I agree fully.",
        "I’ll follow through.",
        "Noted, will do.",
        "Exactly, thank you!",
        "Sounds good 👍",
        "I like it very much.",
        "I’ll handle that soon.",
        "Right, I get it.",
        "Good thinking indeed! 💡",
        "Understood, thanks!",
        "I’ll check on that soon.",
        "Sounds great! 😄",
        "Noted, I’ll take care.",
        "I see, got it.",
        "Absolutely! 👍",
        "I like your idea a lot.",
        "Makes sense, thanks!",
        "I’ll handle it right away.",
        "Perfect, I got it.",
        "Haha, love it! 😂",
        "Good point there.",
        "I totally understand now.",
        "Will get it done ASAP.",
        "Yes, that works!"];
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
