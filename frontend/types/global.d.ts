type User = {
    _id: string;
    username?: string;
    email: string;
    isAdmin: boolean;
} | null;

type Relation = {
    _id: string;
    from: User;
    to: User;
    status: "pending" | "accepted";
};

type Message = {
    _id: string;
    chatId: string;

    from: string;
    to: string;
    text: string;
    seen: boolean;
    createdAt: Date;
};
