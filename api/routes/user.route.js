import { deleteUser, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import express from "express";

const router = express.Router();

router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);

export default router;
