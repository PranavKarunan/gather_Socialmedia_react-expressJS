import express from "express";
const router = express.Router();
import {
  userRegister,
  userLogin,
  otpValidation,
  getUser,
  updateUser,
  deleteUser,
  followUser,
  unFollowUser,
} from "../controllers/userControllers.js";

router.post("/register", userRegister);
router.post("/otpValidation", otpValidation);
router.post("/login", userLogin);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unFollowUser);

export default router;
