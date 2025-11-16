import { z } from "zod/v4";

export const saveMessageSchema = z.strictObject({
    text: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Text content is required"
                    : "Text content must be a string",
        })
        .trim()
        .min(1, "Text content is required"),
});
