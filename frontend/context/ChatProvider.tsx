"use client";

import ChatContext from "./ChatContext";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";

type ChatProviderProps = Readonly<{
    children: ReactNode;
}>;

export default function ChatProvider({ children }: ChatProviderProps) {
    const { user } = useAuth();
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState(false);

    const [friends, setFriends] = useState<Relation[]>([]);
    const [requests, setRequests] = useState<Relation[]>([]);

    const [newMessages, setNewMessages] = useState<Record<string, number>>();

    const [activeChat, setActiveChat] = useState<Relation | null>(null);
    const [activeChatConvo, setActiveChatConvo] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const typingTimer = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        if (!user) return;

        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
            transports: ["websocket", "polling"],
            transportOptions: {
                polling: {
                    withCredentials: true,
                },
            },
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            setConnected(true);
        });

        socket.on("connect_error", (err: Error) => {
            console.error(`Socket Error: ${err}`);
        });

        socket.on("receive_message", (msg) => {
            if (activeChat) {
                if (
                    msg.from === activeChat.from!._id ||
                    msg.from === activeChat.to!._id
                ) {
                    setActiveChatConvo((prevActiveChatConvo) => [
                        ...prevActiveChatConvo,
                        msg,
                    ]);

                    setIsTyping(false);

                    if (msg.to === user!._id) {
                        socket.emit("send_mark_read", msg._id);
                    }
                }
            }

            if (
                (activeChat &&
                    msg.from !== activeChat.from!._id &&
                    msg.from !== activeChat.to!._id) ||
                !activeChat
            ) {
                let friendUsername;

                for (let i = 0; i < friends.length; i++) {
                    const f = friends[i];

                    if (f.from!._id === msg.from && f.from!._id !== user._id) {
                        setNewMessages((prev) => {
                            if (prev && f.from!._id in prev) {
                                return {
                                    ...prev,
                                    [f.from!._id]: prev[f.from!._id] + 1,
                                };
                            } else {
                                return {
                                    ...prev,
                                    [f.from!._id]: 1,
                                };
                            }
                        });
                        friendUsername = f.from!.username;

                        break;
                    } else if (
                        f.to!._id === msg.from &&
                        f.to!._id !== user._id
                    ) {
                        setNewMessages((prev) => {
                            if (prev && f.to!._id in prev) {
                                return {
                                    ...prev,
                                    [f.to!._id]: prev[f.to!._id] + 1,
                                };
                            } else {
                                return {
                                    ...prev,
                                    [f.to!._id]: 1,
                                };
                            }
                        });

                        friendUsername = f.to!.username;
                        break;
                    }
                }

                toast.info(`New message from ${friendUsername}!`);
            }
        });

        socket.on("receive_typing", (fromId) => {
            if (activeChat) {
                if (
                    fromId === activeChat.from!._id ||
                    fromId === activeChat.to!._id
                ) {
                    setIsTyping(true);

                    if (typingTimer.current) clearTimeout(typingTimer.current);

                    typingTimer.current = setTimeout(() => {
                        setIsTyping(false);
                    }, 2000);
                }
            }
        });

        socket.on("receive_mark_read", (msgId) => {
            setActiveChatConvo((prev) => {
                const target = prev.find((m) => m._id === msgId);
                if (!target) return prev;

                const cutoff = new Date(target.createdAt).getTime();

                return prev.map((m) => {
                    if (m.from !== user!._id) return m;

                    if (new Date(m.createdAt).getTime() <= cutoff && !m.seen) {
                        return { ...m, seen: true };
                    }

                    return m;
                });
            });
        });

        return () => {
            socket.off("connect");
            socket.off("connect_error");
            socket.off("receive_message");
            socket.off("receive_typing");
            socket.off("receive_mark_read");

            socket.disconnect();
            socketRef.current = null;
        };
    }, [user, activeChat, friends]);

    return (
        <ChatContext.Provider
            value={{
                friends,
                setFriends,
                requests,
                setRequests,
                newMessages,
                setNewMessages,

                activeChat,
                setActiveChat,
                activeChatConvo,
                setActiveChatConvo,
                isTyping,

                socketRef,
                connected,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}
