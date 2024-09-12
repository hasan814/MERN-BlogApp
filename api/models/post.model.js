import { model, Schema } from "mongoose";

const postSchema = new Schema(
  {
    userId: { type: String, required: true },
    content: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    category: { type: String, default: "uncategorized" },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Post = model("Post", postSchema);

export default Post;
