import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: {
      type: String,
      default: "https://img.icons8.com/color/48/gender-neutral-user.png",
    },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
