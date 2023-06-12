import express from "express";
import {
  getUser,
  updateUser,
  getUsers,
  getUserActivity,
  getUserFriends,
  getFriends,
} from "../controllers/user.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/activities", getUserActivity);
router.get("/friends", getUserFriends);
router.get("/find/:userId", getUser);
router.get("/search/:item", getFriends);
router.put("/", updateUser);

export default router;
