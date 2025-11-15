import { Schema, model, Document, Types } from "mongoose";

export interface IMessage extends Document {
    _id: Types.ObjectId;
    chatId: string;

    from: Types.ObjectId;
    to: Types.ObjectId;
    text: string;
    seen: boolean;
    createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        chatId: { type: String, required: true, index: true },
        from: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        to: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        text: { type: String, required: true, trim: true },
        seen: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });

messageSchema.index({ chatId: 1, createdAt: 1 });
messageSchema.index({ from: 1, to: 1, createdAt: 1 });

const Message = model<IMessage>("Message", messageSchema);
export default Message;
