import AppError from "./AppError.util.js";
import type { ZodType } from "zod";
import { Types } from "mongoose";

export function validateData<T>(schema: ZodType<T>, data: unknown) {
    if (data == null) {
        throw new AppError(400, "Incomplete Information");
    }

    const result = schema.safeParse(data);

    if (!result.success) {
        const message = result.error.issues
            .map((issue) => issue.message)
            .join(", ");
        throw new AppError(400, message);
    }

    return result.data;
}

export function validateObjectIds(ids: string | string[]) {
    const arr = Array.isArray(ids) ? ids : [ids];

    for (const id of arr) {
        if (!Types.ObjectId.isValid(id)) {
            throw new AppError(400, `Invalid ObjectId`);
        }
    }
}
