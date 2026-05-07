import express, { Request, Router, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
const router: Router = express.Router();

const health = expressAsyncHandler(async (_req: Request, res: Response) => {
  const dbStates = ["disconnected", "connected", "connecting", "disconnecting"];
  const dbState = mongoose.connection.readyState;

  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date(),
    db: dbStates[dbState] || "unknown",
  });
});

router.get("/", health);
export default router;
