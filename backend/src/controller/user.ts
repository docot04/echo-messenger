import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import * as config from "../config";
import { User } from "../models";

interface AuthRequest extends Request {
  user?: any;
}

// register user
export const registerUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      email,
      password,
      publicKey,
      encryptedPrivateKey,
      encryptedPrivateKeySalt,
      encryptedPrivateKeyIV,
    } = req.body;

    // check for empty fields
    config.requireFields(res, {
      name,
      email,
      password,
      publicKey,
      encryptedPrivateKey,
      encryptedPrivateKeySalt,
      encryptedPrivateKeyIV,
    });

    // check if unique entry (name, email)
    const userExists = await User.findOne({
      $or: [{ email }, { name }],
    });
    if (userExists) {
      const message =
        userExists.email === email
          ? `Email already in use`
          : `Username already taken`;
      config.throwError(res, 400, message);
    }

    // create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      publicKey,
      encryptedPrivateKey,
      encryptedPrivateKeySalt,
      encryptedPrivateKeyIV,
    });

    // return newly created user
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      publicKey: user.publicKey,
      token: config.generateToken(user._id),
    });
  },
);

// auth user (login with email + password)
export const authUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // check for empty fields
    config.requireFields(res, { email, password });

    // find user
    const user = await User.findOne({ email });
    if (!user) return config.throwError(res, 401, "Invalid email or password");

    // match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return config.throwError(res, 401, "Invalid email or password");

    // return user if matched
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      publicKey: user.publicKey,
      encryptedPrivateKey: user.encryptedPrivateKey,
      encryptedPrivateKeySalt: user.encryptedPrivateKeySalt,
      encryptedPrivateKeyIV: user.encryptedPrivateKeyIV,
      token: config.generateToken(user._id),
    });
  },
);

// search user
export const searchUser = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    // construct search query
    const keyword =
      typeof req.query.search === "string"
        ? {
            $or: [
              { name: { $regex: req.query.search, $options: "i" } },
              { email: { $regex: req.query.search, $options: "i" } },
            ],
          }
        : {};

    // return users if any
    const users = await User.find(keyword)
      .find({ _id: { $ne: req.user._id } })
      .limit(10)
      .select("name email bio pic _id");

    res.json(users);
  },
);

// get profile (other users)
export const getUser = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    // check if self
    if (req.user._id.toString() === id)
      config.throwError(res, 400, "User /me for self");

    const currentUser = await User.findById(req.user._id);
    const targetUser = await User.findById(id);

    // check if exists
    if (!targetUser) return config.throwError(res, 404, "User not found");

    // return user
    res.json({
      _id: targetUser._id,
      name: targetUser.name,
      email: targetUser.email,
      bio: targetUser.bio,
      pic: targetUser.pic,
      friends: targetUser.friends,
      dateJoined: targetUser.createdAt,
      self: false,

      // return boolean values for frontend parsing
      blockedBy: targetUser.blocked.includes(currentUser!._id),
      blocked: currentUser!.blocked.includes(targetUser._id),
      friend: currentUser!.friends.includes(targetUser._id),
      sentReq: currentUser!.sentRequests.includes(targetUser._id),
      recReq: currentUser!.pendingRequests.includes(targetUser._id),
    });
  },
);

// get profile (self)
export const getSelf = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user._id).select("-password");

    // check if exists
    if (!user) return config.throwError(res, 404, "User not found");
    res.json(user);
  },
);

// edit profile
export const editProfile = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, bio, pic } = req.body;

    // check for empty fields
    if (!name && !bio && !pic) config.throwError(res, 400, "Nothing to update");

    const user = await User.findById(req.user._id);

    // check if exists
    if (!user) return config.throwError(res, 404, "User not found");

    // update only provided fields
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (pic) user.pic = pic;

    const updatedUser = await user.save();

    // return updated info
    res.json({
      name: updatedUser.name,
      bio: updatedUser.bio,
      pic: updatedUser.pic,
    });
  },
);

// send friend req
export const sendFriendReq = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user: target } = req.body;

    // validate target and find user and target
    config.validateTargetUser(res, req.user._id.toString(), target);
    const { currentUser, targetUser } = await config.findUsers(
      res,
      req.user._id,
      target,
    );

    // check if currentUser blocked targetUser
    if (config.hasId(currentUser.blocked, target))
      config.throwError(res, 400, "Cannot send Friend Request to blocked user");

    // check if targetUser blocked currentUser
    if (config.hasId(targetUser.blocked, req.user._id))
      config.throwError(res, 400, "Cannot send Friend Request to this user");

    // check if already friends
    if (config.hasId(currentUser.friends, target))
      config.throwError(res, 400, "Already Friends");

    // prevent duplicate requests
    if (
      config.hasId(currentUser.sentRequests, target) ||
      config.hasId(targetUser.pendingRequests, req.user._id)
    )
      config.throwError(res, 400, "Friend request already sent or pending");

    // send friend request
    currentUser.sentRequests.push(target);
    targetUser.pendingRequests.push(req.user._id);
    await Promise.all([currentUser.save(), targetUser.save()]);
    res.json({ message: "Friend request sent" });
  },
);

// accept friend req
export const acceptFriendReq = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user: target } = req.body;

    // validate target and find user and target
    config.validateTargetUser(res, req.user._id.toString(), target);
    const { currentUser, targetUser } = await config.findUsers(
      res,
      req.user._id,
      target,
    );

    // check if friend request exists
    if (
      !config.hasId(currentUser.pendingRequests, target) ||
      !config.hasId(targetUser.sentRequests, req.user._id)
    )
      config.throwError(res, 400, "No Friend Request from this user");

    // accept friend request
    currentUser.friends.push(target);
    targetUser.friends.push(req.user._id);
    currentUser.pendingRequests = config.removeId(
      currentUser.pendingRequests,
      target,
    );
    targetUser.sentRequests = config.removeId(
      targetUser.sentRequests,
      req.user._id,
    );
    await Promise.all([currentUser.save(), targetUser.save()]);
    res.json({ message: "Friend Request accepted" });
  },
);

// reject friend req
export const rejectFriendReq = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user: target } = req.body;

    // validate target and find user and target
    config.validateTargetUser(res, req.user._id.toString(), target);
    const { currentUser, targetUser } = await config.findUsers(
      res,
      req.user._id,
      target,
    );

    // check if friend request exists
    if (
      !config.hasId(currentUser.pendingRequests, target) ||
      !config.hasId(targetUser.sentRequests, req.user._id)
    )
      config.throwError(res, 400, "No Friend Request from this user");

    // reject friend request
    currentUser.pendingRequests = config.removeId(
      currentUser.pendingRequests,
      target,
    );
    targetUser.sentRequests = config.removeId(
      targetUser.sentRequests,
      req.user._id,
    );
    await Promise.all([currentUser.save(), targetUser.save()]);
    res.json({ message: "Friend Request rejected" });
  },
);

// remove friend
export const removeFriend = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user: target } = req.body;

    // validate target and find user and target
    config.validateTargetUser(res, req.user._id.toString(), target);
    const { currentUser, targetUser } = await config.findUsers(
      res,
      req.user._id,
      target,
    );

    // check if not already friends
    if (!config.hasId(currentUser.friends, target))
      config.throwError(res, 400, "Cannot remove friend");

    // remove friend
    currentUser.friends = config.removeId(currentUser.friends, target);
    targetUser.friends = config.removeId(targetUser.friends, req.user._id);
    await Promise.all([currentUser.save(), targetUser.save()]);
    res.json({ message: "Removed Friend" });
  },
);

// block user
export const blockUser = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user: target } = req.body;

    // validate target and find user and target
    config.validateTargetUser(res, req.user._id.toString(), target);
    const { currentUser, targetUser } = await config.findUsers(
      res,
      req.user._id,
      target,
    );

    // check if already blocked
    if (config.hasId(currentUser.blocked, target))
      config.throwError(res, 400, "User already blocked");

    // check if blocked by target
    if (config.hasId(targetUser.blocked, req.user._id))
      config.throwError(res, 400, "Cannot block this user");

    // remove all relationships (user side)
    currentUser.friends = config.removeId(currentUser.friends, target);
    currentUser.pendingRequests = config.removeId(
      currentUser.pendingRequests,
      target,
    );
    currentUser.sentRequests = config.removeId(
      currentUser.sentRequests,
      target,
    );

    // remove all relationships (target side)
    targetUser.friends = config.removeId(targetUser.friends, req.user._id);
    targetUser.pendingRequests = config.removeId(
      targetUser.pendingRequests,
      req.user._id,
    );
    targetUser.sentRequests = config.removeId(
      targetUser.sentRequests,
      req.user._id,
    );

    // block user
    currentUser.blocked.push(target);
    await Promise.all([currentUser.save(), targetUser.save()]);
    res.json({ message: "User Blocked" });
  },
);

// unblock user
export const unblockUser = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user: target } = req.body;

    // validate target and find user and target
    config.validateTargetUser(res, req.user._id.toString(), target);
    const { currentUser, targetUser } = await config.findUsers(
      res,
      req.user._id,
      target,
    );

    // check if already unblocked
    if (!config.hasId(currentUser.blocked, target))
      config.throwError(res, 400, "User not blocked");

    // unblock user
    currentUser.blocked = config.removeId(currentUser.blocked, target);
    await currentUser.save();
    res.json({ message: "User Unblocked" });
  },
);

// fetch friends
export const fetchFriends = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user._id)
      .populate("friends", "_id name pic bio")
      .populate("sentRequests", "_id name pic bio")
      .populate("pendingRequests", "_id name pic bio");

    // find user
    if (!user) return config.throwError(res, 400, "User not found");

    res.json({
      friends: user.friends,
      sentRequests: user.sentRequests,
      recievedRequests: user.pendingRequests,
    });
  },
);
