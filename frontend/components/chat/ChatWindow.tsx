"use client";

import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { FaUser } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

import MessagesArea from "./MessagesArea";
import useChat from "@/hooks/useChat";
import useAuth from "@/hooks/useAuth";
import { useState, useRef, type FormEvent, useEffect } from "react";

export default function ChatWindow() {
    const { activeChat, socketRef, connected, isTyping } = useChat();
    const { user } = useAuth();

    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        setMessage("");
    }, [activeChat]);

    function handleInput(e: FormEvent<HTMLTextAreaElement>) {
        autoResize(e.currentTarget);

        if (activeChat && socketRef.current && connected) {
            const toId =
                activeChat.from!._id === user!._id
                    ? activeChat?.to!._id
                    : activeChat.from!._id;

            socketRef.current.emit("send_typing", toId);
        }
    }

    function sendMessage() {
        if (activeChat && socketRef.current && connected) {
            socketRef.current.emit("send_message", {
                message,
                toId:
                    activeChat.from!._id === user!._id
                        ? activeChat?.to!._id
                        : activeChat.from!._id,
            });
        }

        setMessage("");
        resetHeight();
    }

    function autoResize(el: HTMLTextAreaElement | null) {
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }

    function resetHeight() {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
    }

    return (
        <div className="border-primary fixed top-[7.5dvh] left-[7.5dvw] flex h-[85dvh] min-h-100 w-[85dvw] flex-col items-center justify-center rounded-lg border-2 bg-white dark:bg-black">
            {!activeChat ? (
                <p className="text-center">Your chats will appear here...</p>
            ) : (
                <>
                    <div className="flex w-full items-center gap-5 rounded-t-lg border-b-2 px-5 py-2 text-xl">
                        <FaUser />
                        <p className="flex-1 overflow-hidden text-nowrap text-ellipsis">
                            {activeChat.from!.username === user!.username
                                ? activeChat.to!.username
                                : activeChat.from!.username}
                        </p>
                        {isTyping && <p className="text-base">typing...</p>}
                    </div>

                    <MessagesArea />

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendMessage();
                        }}
                        className="flex w-full items-center justify-center gap-2 px-5 py-3"
                    >
                        <Textarea
                            ref={textareaRef}
                            placeholder="Message..."
                            className="no-scrollbar max-h-30 flex-1 resize-none overflow-y-auto text-lg!"
                            rows={1}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onInput={handleInput}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                        />
                        <Button
                            className="hover:text-primary"
                            type="submit"
                            variant="ghost"
                        >
                            <IoSend className="size-6" />
                        </Button>
                    </form>
                </>
            )}
        </div>
    );
}
