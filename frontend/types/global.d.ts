type User = {
    _id: string;
    username?: string;
    email: string;
} | null;

type Relation = {
    _id: string;
    fromUser: User;
    toUser: User;
    status: "pending" | "accepted";
};
