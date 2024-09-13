import { verifyToken } from "../utils/verifyUser.js";
import express from "express";

import {
  createComment,
  getPostComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getPostComments/:postId", verifyToken, getPostComments);

export default router;
