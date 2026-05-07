import { user } from "../controller";
import { protect } from "../middleware";
import express, { Router } from "express";
const router: Router = express.Router();

router.post("/", user.registerUser);
router.get("/", protect, user.searchUser);
router.post("/login", user.authUser);
router.get("/me", protect, user.getSelf);
router.get("/:id", protect, user.getUser);
router.put("/edit", protect, user.editProfile);
router.post("/friend", protect, user.sendFriendReq);
router.post("/friend/accept", protect, user.acceptFriendReq);
router.post("/friend/reject", protect, user.rejectFriendReq);
router.post("/friend/remove", protect, user.removeFriend);
router.post("/friend/block", protect, user.blockUser);
router.post("/friend/unblock", protect, user.unblockUser);
router.get("/friend/all", protect, user.fetchFriends);

export default router;
