import { verifyToken } from "../utils/verifyUser.js";
import express from "express";

import {
  createComment,
  getPostComments,
  likeComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.get("/getPostComments/:postId", verifyToken, getPostComments);

export default router;
