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
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const justLoadedMore = useRef<boolean>(null);

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;

        if (justLoadedMore.current) {
            justLoadedMore.current = false;
            return;
        }

        el.scrollTop = el.scrollHeight;
    }, [activeChatConvo]);

    const fetchConvo = useCallback(async () => {
        if (!activeChat || !user) return;

        const otherId =
            activeChat!.from!.username === user!.username
                ? activeChat!.to!._id
                : activeChat!.from!._id;

        setFetchingMsgs(true);
        try {
            const res = await axios.get(`/api/messages/${otherId}`);

            const messages: Message[] = res.data.data.messages;
            const hasMoreFromServer: boolean = res.data.data.hasMore;

            setActiveChatConvo(messages);
            setHasMore(hasMoreFromServer);

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

    async function loadMore() {
        if (
            !hasMore ||
            loadingMore ||
            activeChatConvo.length === 0 ||
            !activeChat ||
            !user
        ) {
            return;
        }

        const otherId =
            activeChat!.from!.username === user!.username
                ? activeChat!.to!._id
                : activeChat!.from!._id;

        const oldestId = activeChatConvo[0]._id;

        setLoadingMore(true);

        try {
            const el = listRef.current;
            const prevScrollHeight = el ? el.scrollHeight : 0;

            const res = await axios.get(`/api/messages/${otherId}`, {
                params: {
                    cursor: oldestId,
                },
            });

            const older: Message[] = res.data.data.messages;
            const hasMoreFromServer: boolean = res.data.data.hasMore;

            justLoadedMore.current = true;
            setActiveChatConvo((prev) => [...older, ...prev]);
            setHasMore(hasMoreFromServer);

            requestAnimationFrame(() => {
                if (!el) return;

                const newScrollHeight = el.scrollHeight;
                el.scrollTop = newScrollHeight - prevScrollHeight;
            });
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message =
                error.response?.data?.message ||
                "Error fetching more messages.";
            toast.error(message);
        } finally {
            setLoadingMore(false);
        }
    }

    return (
        <div
            className="no-scrollbar flex w-full flex-1 flex-col gap-5 overflow-auto p-5"
            ref={listRef}
            onScroll={(e) => {
                const target = e.currentTarget;
                if (target.scrollTop < 80) {
                    loadMore();
                }
            }}
        >
            {loadingMore && !fetchingMsgs && (
                <div className="text-muted-foreground mx-auto text-center text-xs">
                    Loading older messages...
                </div>
            )}

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
                          pending={msg.pending}
                      >
                          {msg.text}
                      </ChatBubble>
                  ))}
        </div>
    );
}
