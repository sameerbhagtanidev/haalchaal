import type { IUser } from "../models/user.model.js";
import type { IRelation } from "../models/relation.model.js";

export function sanitizeUser(user: IUser) {
    return {
        _id: user._id,
        username: user.username,
        email: user.email,
    };
}

export function sanitizeRelation(relation: IRelation) {
    return {
        _id: relation._id,
        fromUser: relation.fromUser,
        toUser: relation.toUser,

        status: relation.status,
    };
}
