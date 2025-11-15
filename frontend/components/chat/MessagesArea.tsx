"use client";
import { useEffect, useRef, useState, useCallback } from "react";

import ChatBubble from "./ChatBubble";
import useChat from "@/hooks/useChat";
import useAuth from "@/hooks/useAuth";

import axios from "../../utils/axios";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export default function MessagesArea() {
    const listRef = useRef<HTMLDivElement>(null);
    const {
        activeChat,
        activeChatConvo,
        setActiveChatConvo,
        socketRef,
        connected,
    } = useChat();
    const { user } = useAuth();

    const [fetchingMsgs, setFetchingMsgs] = useState<boolean>(false);

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;

        el.scrollTop = el.scrollHeight;
    }, [activeChatConvo]);

    const fetchConvo = useCallback(async () => {
        const otherId =
            activeChat!.from!.username === user!.username
                ? activeChat!.to!._id
                : activeChat!.from!._id;

        setFetchingMsgs(true);
        try {
            const res = await axios.get(`/api/messages/${otherId}`);

            const messages: Message[] = res.data.data.messages;

            setActiveChatConvo(messages);

            const lastMsg = [...messages]
                .reverse()
                .find(
                    (msg) => String(msg.to) === user!._id && msg.seen === false,
                );
            if (lastMsg && activeChat && socketRef.current && connected) {
                socketRef.current.emit("send_mark_read", lastMsg._id);
            }
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message =
                error.response?.data?.message || "Error fetching messages.";

            toast.error(message);
        } finally {
            setFetchingMsgs(false);
        }
    }, [activeChat, setActiveChatConvo, user, connected, socketRef]);

    useEffect(() => {
        fetchConvo();
    }, [fetchConvo]);

    return (
        <div
            className="no-scrollbar flex w-full flex-1 flex-col gap-5 overflow-auto p-5"
            ref={listRef}
        >
            {fetchingMsgs
                ? [...new Array(5)].map((_, i) => (
                      <ChatBubble
                          time="random"
                          key={i}
                          skeleton={true}
                          sent={Boolean(i % 2)}
                      >
                          Random
                      </ChatBubble>
                  ))
                : activeChatConvo.map((msg) => (
                      <ChatBubble
                          key={msg._id}
                          sent={msg.from === user?._id}
                          time={new Date(msg.createdAt).toLocaleTimeString(
                              "en-US",
                              {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                              },
                          )}
                          seen={msg.seen}
                      >
                          {msg.text}
                      </ChatBubble>
                  ))}
        </div>
    );
}
