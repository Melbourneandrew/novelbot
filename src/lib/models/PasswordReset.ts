import mongoose, { models, Schema, Document } from "mongoose";
import { IUser } from "./User";

interface IPasswordReset extends Document {
    user: IUser,
    token: string,
    expires: Date
}

const passwordResetSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    token: {
        type: String,
        required: true
    },
    expires: {
        type: Date,
        required: true,
        default: () => new Date(new Date().getTime() + 30 * 60000) // Adds 30 minutes to the current time
    }
});

const PasswordResetModel = models.PasswordReset || mongoose.model<IPasswordReset>("PasswordReset", passwordResetSchema);

export { PasswordResetModel as PasswordReset }
export type { IPasswordReset }