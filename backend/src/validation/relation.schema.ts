import { z } from "zod/v4";

export const sendRequestSchema = z.strictObject({
    username: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Username is required"
                    : "Username must be a string",
        })
        .trim()
        .min(3, "Username must be at least 3 characters")
        .regex(
            /^[a-z0-9._]+$/,
            "Only lowercase letters, numbers, dots, and underscores are allowed"
        )
        .regex(/^\S+$/, "Username cannot contain spaces"),
});

export const resolveRequestSchema = z.strictObject({
    action: z.enum(["accept", "reject"], {
        error: (issue) =>
            issue.input === undefined ? "action is required" : "Invalid action",
    }),
});
