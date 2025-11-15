import { Schema, model, Document, Types } from "mongoose";

export interface IRelation extends Document {
    _id: Types.ObjectId;

    from: Types.ObjectId;
    to: Types.ObjectId;
    status: "pending" | "accepted";
}

const relationSchema = new Schema<IRelation>({
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
    status: {
        type: String,
        enum: ["pending", "accepted"],
        default: "pending",
    },
});

relationSchema.index({ from: 1, to: 1 }, { unique: true });

const Relation = model<IRelation>("Relation", relationSchema);
export default Relation;
