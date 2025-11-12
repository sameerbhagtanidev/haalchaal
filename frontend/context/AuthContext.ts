import { createContext, type Dispatch, type SetStateAction } from "react";

export interface AuthContextType {
    user: User;
    setUser: Dispatch<SetStateAction<User>>;
    isLoading: boolean;
    status: () => Promise<void>;
    sendToken: (email: string) => Promise<void>;
    verifyToken: (email: string, loginToken: string) => Promise<User>;
    onboard: (username: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
