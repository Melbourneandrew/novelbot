import mongoose, { models, Schema, Document } from "mongoose";

interface IUser extends Document {
  email?: string;
  password?: string;
}
const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel =
  models.User || mongoose.model<IUser>("User", userSchema);
export { UserModel as User };
export type { IUser };
