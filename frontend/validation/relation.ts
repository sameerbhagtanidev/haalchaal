import { z } from "zod/v4";

export const addFriendSchema = z.strictObject({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .regex(
            /^[a-z0-9._]+$/,
            "Only lowercase letters, numbers, dots, and underscores are allowed",
        )
        .regex(/^\S+$/, "Username cannot contain spaces"),
});
