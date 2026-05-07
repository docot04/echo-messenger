import { message } from "../controller";
import { protect } from "../middleware";
import express, { Router } from "express";
const router: Router = express.Router();

router.post("/", protect, message.sendMessage);
router.get("/:chatId", protect, message.fetchMessage);

export default router;
