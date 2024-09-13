import { verifyToken } from "../utils/verifyUser.js";
import express from "express";

import {
  deleteUser,
  getUser,
  getUsers,
  signOut,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signout", signOut);
router.get("/:userId", getUser);
router.get("/getusers", verifyToken, getUsers);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);

export default router;
