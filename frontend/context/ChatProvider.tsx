"use client";

import ChatContext from "./ChatContext";
import { useState, type ReactNode } from "react";

type ChatProviderProps = Readonly<{
    children: ReactNode;
}>;

export default function ChatProvider({ children }: ChatProviderProps) {
    const [friends, setFriends] = useState<Relation[]>([]);
    const [requests, setRequests] = useState<Relation[]>([]);

    return (
        <ChatContext.Provider
            value={{
                friends,
                setFriends,
                requests,
                setRequests,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}
