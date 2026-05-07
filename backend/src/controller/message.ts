import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import * as config from "../config";
import { Message, Chat } from "../models";
import { io } from "../socket";

interface AuthRequest extends Request {
  user?: any;
}

// send new message
export const sendMessage = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    // validate fields
    const { content, chatId, iv } = req.body;
    config.requireFields(res, { content, chatId });
    const chat = await Chat.findById(chatId).populate("users", "_id");
    if (!chat) return config.throwError(res, 404, "Chat not found");

    // check if participant
    const isParticipant = chat.users.some((u: any) =>
      u._id.equals(req.user._id),
    );
    if (!isParticipant) return config.throwError(res, 403, "Access denied");

    // check if groupchat
    const isEncrypted = !chat.isGroupChat;
    if (isEncrypted && !iv) return config.throwError(res, 400, "IV required");
    if (!isEncrypted && iv) return config.throwError(res, 400, "IV unallowed");

    // create message
    let message = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
      isEncrypted,
      iv: isEncrypted ? iv : undefined,
    });

    message = await message.populate([
      { path: "sender", select: "name pic email" },
      {
        path: "chat",
        populate: { path: "users", select: "name pic email" },
      },
    ]);

    // update latest message
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });

    // socket emit
    try {
      const fullChat = message.chat as any;

      // emit to chat room
      io.to(chatId).emit("message received", message);

      // emit to individual users (as fallback)
      fullChat.users.forEach((user: any) => {
        if (user._id.toString() === req.user._id.toString()) return;

        io.to(user._id.toString()).emit("message received", message);
      });
    } catch (err) {
      console.error("Socket emit failed:", err);
    }

    res.json(message);
  },
);

// fetch all messages (paginated)
export const fetchMessage = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { chatId } = req.params;
    const limit = Math.min(Number(req.query.limit) || 30, 50);
    const cursor = req.query.cursor as string | undefined;
    const chat = await Chat.findById(chatId).populate("users", "_id");

    // validate inputs
    if (!chat) return config.throwError(res, 404, "Chat not found");

    // check if participant
    const isParticipant = chat.users.some((u: any) =>
      u._id.equals(req.user._id),
    );
    if (!isParticipant) return config.throwError(res, 403, "Access denied");

    const query: any = { chat: chatId };

    // use _id cursor
    if (cursor) {
      query._id = { $lt: cursor };
    }

    const rawMessages = await Message.find(query)
      .sort({ _id: -1 }) // newest first
      .limit(limit)
      .populate("sender", "name pic email");

    const hasMore = rawMessages.length === limit;

    // reverse for chronological order
    const messages = rawMessages.reverse();
    const nextCursor =
      rawMessages.length > 0 ? rawMessages[rawMessages.length - 1]!._id : null;

    res.json({
      messages,
      nextCursor,
      hasMore,
    });
  },
);
