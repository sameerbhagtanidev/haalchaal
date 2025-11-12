import { Schema, model, Document, Types } from "mongoose";

export interface IRelation extends Document {
    _id: Types.ObjectId;

    fromUser: Types.ObjectId;
    toUser: Types.ObjectId;
    status: "pending" | "accepted";

    createdAt: Date;
    updatedAt: Date;
}

const relationSchema = new Schema<IRelation>(
    {
        fromUser: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        toUser: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Relation = model<IRelation>("Relation", relationSchema);

relationSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

export default Relation;
