import { Schema, model, models } from "mongoose";

export interface IUser {
  name: string;
  role: "student" | "admin";
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "admin"],
    required: true,
  },
});

const User = models.User || model<IUser>("User", UserSchema);

export default User;
