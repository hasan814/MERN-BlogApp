import { verifyToken } from "../utils/verifyUser.js";
import express from "express";

import {
  createComment,
  editComment,
  getPostComments,
  likeComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.put("/editComment/:commentId", verifyToken, editComment);
router.get("/getPostComments/:postId", verifyToken, getPostComments);

export default router;
