import { verifyToken } from "../utils/verifyUser.js";
import express from "express";

import {
  createComment,
  deleteComment,
  editComment,
  getPostComments,
  likeComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.put("/editComment/:commentId", verifyToken, editComment);
router.get("/getPostComments/:postId", verifyToken, getPostComments);
router.delete("/deleteComment/:commentId", verifyToken, deleteComment);

export default router;
