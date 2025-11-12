import { createContext, type Dispatch, type SetStateAction } from "react";

export interface ChatContextType {
    friends: Relation[];
    setFriends: Dispatch<SetStateAction<Relation[]>>;
    requests: Relation[];
    setRequests: Dispatch<SetStateAction<Relation[]>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export default ChatContext;
