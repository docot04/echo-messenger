import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import * as config from "../config";
import { Chat, User } from "../models";

interface AuthRequest extends Request {
  user?: any;
}

// access or create DM
export const accessChat = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user: target } = req.body;

    // validate target and find user and target
    config.validateTargetUser(res, req.user._id.toString(), target);
    const { currentUser, targetUser } = await config.findUsers(
      res,
      req.user._id,
      target,
    );

    // check if blocked in either direction
    if (
      config.hasId(currentUser.blocked, target) ||
      config.hasId(targetUser.blocked, req.user._id)
    )
      config.throwError(res, 403, "Cannot access chat with this user");

    // check existing chat
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user._id, target] },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (chat) {
      res.json(chat);
      return;
    }

    // must be friends to start new DM
    if (!config.hasId(currentUser.friends, target))
      config.throwError(res, 403, "Can only start new chat with Friends");

    // create new chat
    const createdChat = await Chat.create({
      chatName: "DM",
      isGroupChat: false,
      users: [req.user._id, target],
    });
    const fullChat = await Chat.findById(createdChat._id).populate(
      "users",
      "-password",
    );

    res.status(200).json(fullChat);
  },
);

// fetch all chats (paginated)
export const fetchChats = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const cursor = req.query.cursor as string | undefined;

    // apply limit and cursor for pagination
    const query: any = {
      users: { $elemMatch: { $eq: req.user._id } },
    };
    if (cursor) {
      query.updatedAt = { $lt: new Date(cursor) };
    }

    const currentUser = await User.findById(req.user._id);

    let chats = await Chat.find(query)
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .limit(limit);

    // filter blocked users
    const filtered = chats.filter((chat: any) => {
      const others = chat.users.filter((u: any) => !u._id.equals(req.user._id));

      return !others.some(
        (u: any) =>
          u.blocked.includes(req.user._id) ||
          currentUser!.blocked.includes(u._id),
      );
    });

    // next cursor
    const nextCursor =
      filtered.length > 0 ? filtered[filtered.length - 1]?.updatedAt : null;

    // return
    res.json({
      chats: filtered,
      nextCursor,
      hasMore: chats.length === limit,
    });
  },
);

// create a new group chat
export const createGroupChat = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    // validate inputs
    const { users, name } = req.body;
    config.requireFields(res, { users, name });

    const currentUser = await User.findById(req.user._id);

    let parsedUsers: string[] =
      typeof users === "string" ? JSON.parse(users) : users;

    // only allow friends and not blocked
    parsedUsers = parsedUsers.filter(
      (id: any) =>
        currentUser!.friends.some((f) => f.equals(id)) &&
        !currentUser!.blocked.includes(id),
    );
    const validUsers = await User.find({ _id: { $in: parsedUsers } });
    const filtered = validUsers.filter(
      (u) => !u.blocked.includes(req.user._id),
    );

    // require more than 2 users
    if (filtered.length < 2)
      config.throwError(res, 400, "Require at least 2 valid users");

    // create group
    const groupChat = await Chat.create({
      chatName: name,
      users: [...filtered.map((u) => u._id), req.user._id],
      isGroupChat: true,
      groupAdmin: req.user._id,
    });
    const fullGroup = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(fullGroup);
  },
);

// rename a group chat
export const renameGroupChat = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    //validate fields
    const { chatId, name: chatName } = req.body;
    config.requireFields(res, { chatId, chatName });
    const chat = await Chat.findById(chatId);
    if (!chat) return config.throwError(res, 404, "Chat not found");

    // check if admin
    if (!chat.groupAdmin?.equals(req.user._id))
      config.throwError(res, 403, "Not authorized to rename group");

    // change name
    chat.chatName = chatName;
    await chat.save();
    const updated = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.json(updated);
  },
);

// add user to group chat
export const addToGroupChat = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    // validate inputs
    const { chatId, user: target } = req.body;
    config.requireFields(res, { chatId, target });

    // find fields
    const { currentUser, targetUser } = await config.findUsers(
      res,
      req.user._id,
      target,
    );
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.isGroupChat)
      return config.throwError(res, 404, "Chat not found");

    if (!chat.groupAdmin?.equals(req.user._id))
      config.throwError(res, 403, "Not authorized to add users");

    if (
      config.hasId(currentUser.friends, targetUser._id) ||
      config.hasId(currentUser.blocked, targetUser._id) ||
      config.hasId(targetUser.blocked, currentUser._id)
    )
      config.throwError(res, 403, "Cannot add this user");

    chat.users.push(targetUser!._id);
    await chat.save();

    const updated = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(updated);
  },
);

// remove users from group
export const removeFromGroup = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    // validate inputs
    const { chatId, user: target } = req.body;
    config.requireFields(res, { chatId, target });
    const { currentUser, targetUser } = await config.findUsers(
      res,
      req.user._id,
      target,
    );
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.isGroupChat)
      return config.throwError(res, 404, "Chat not found");

    // only admin can remove users OR users can remove themselves BUT admin cannot remove themselves
    const isAdmin = chat.groupAdmin?.equals(req.user._id);
    const isSelf = target._id.equals(req.user._id);
    if ((!isAdmin && !isSelf) || (isAdmin && isSelf)) {
      config.throwError(res, 403, "Cannot remove user");
    }

    chat.users = chat.users.filter((u) => !u.equals(target));
    await chat.save();

    const updated = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(updated);
  },
);
