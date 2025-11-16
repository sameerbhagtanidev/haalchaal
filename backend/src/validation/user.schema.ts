import { z } from "zod/v4";

export const checkUsernameSchema = z.strictObject({
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

export const sendTokenSchema = z.strictObject({
    email: z
        .email({
            error: (issue) =>
                issue.input === undefined
                    ? "Email is required"
                    : "Invalid email format",
        })
        .trim()
        .min(1, "Email is required"),
});

export const verifyTokenSchema = z.strictObject({
    email: z
        .email({
            error: (issue) =>
                issue.input === undefined
                    ? "Email is required"
                    : "Invalid email format",
        })
        .trim()
        .min(1, "Email is required"),

    loginToken: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Login token is required"
                    : "Login token must be a string",
        })
        .trim()
        .min(6, "Login token must be of 6 digits")
        .max(6, "Login token must be of 6 digits"),
});

export const onboardSchema = z.strictObject({
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
