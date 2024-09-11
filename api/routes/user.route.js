import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import express from "express";

const router = express.Router();

router.get("/test", test);
router.get("/update/:userId", verifyToken, updateUser);

export default router;
