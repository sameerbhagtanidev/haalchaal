import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Socket } from "socket.io-client";
import type { RefObject } from "react";

export interface ChatContextType {
    friends: Relation[];
    setFriends: Dispatch<SetStateAction<Relation[]>>;
    requests: Relation[];
    setRequests: Dispatch<SetStateAction<Relation[]>>;

    newMessages: Record<string, number> | undefined;
    setNewMessages: Dispatch<
        SetStateAction<Record<string, number> | undefined>
    >;

    activeChat: Relation | null;
    setActiveChat: Dispatch<SetStateAction<Relation | null>>;
    activeChatConvo: Message[];
    setActiveChatConvo: Dispatch<SetStateAction<Message[]>>;

    isTyping: boolean;

    socketRef: RefObject<Socket | null>;
    connected: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export default ChatContext;
