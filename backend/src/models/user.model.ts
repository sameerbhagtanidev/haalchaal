import { Schema, model, Document, Types } from "mongoose";
import { hash, compare } from "bcrypt";

export interface IUser extends Document {
    _id: Types.ObjectId;
    username?: string;
    email: string;
    googleId?: string;

    loginToken?: string;
    loginTokenExpiresAt?: Date;

    createdAt: Date;
    updatedAt: Date;

    compareLoginToken(loginToken: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true,
            unique: true,
            index: true,
            min: 3,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },

        loginToken: String,
        loginTokenExpiresAt: Date,
    },
    { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
    if (!this.loginToken || !this.isModified("loginToken")) return next();

    try {
        const saltRounds = Number(process.env.SALT_ROUNDS);
        this.loginToken = await hash(this.loginToken, saltRounds);
        return next();
    } catch (err: any) {
        return next(err);
    }
});

userSchema.method(
    "compareLoginToken",
    async function (this: IUser, loginToken: string) {
        return compare(loginToken, this.loginToken!);
    }
);

const User = model<IUser>("User", userSchema);

export default User;
