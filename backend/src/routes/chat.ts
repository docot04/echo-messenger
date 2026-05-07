import { chat } from "../controller";
import { protect } from "../middleware";
import express, { Router } from "express";
const router: Router = express.Router();

router.post("/", protect, chat.accessChat);
router.get("/", protect, chat.fetchChats);
router.post("/group/create", protect, chat.createGroupChat);
router.put("/group/rename", protect, chat.renameGroupChat);
router.put("/group/add", protect, chat.addToGroupChat);
router.put("/group/remove", protect, chat.removeFromGroup);

export default router;
