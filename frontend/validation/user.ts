import { z } from "zod/v4";

export const authSchema = z.strictObject({
    email: z.email("Invalid Email Address"),
});

export const verifySchema = z.strictObject({
    loginToken: z
        .string()
        .min(6, "Code must be of 6 digits")
        .max(6, "Code must be of 6 digits"),
});

export const onboardSchema = z.strictObject({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .regex(
            /^[a-z0-9._]+$/,
            "Only lowercase letters, numbers, dots, and underscores are allowed",
        )
        .regex(/^\S+$/, "Username cannot contain spaces"),
});
