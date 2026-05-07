import { Response } from "express";
import mongoose, { Types } from "mongoose";
import { User } from "../models";

// error thrower
export const throwError = (
  res: Response,
  code: number,
  message: string,
): never => {
  res.status(code);
  throw new Error(message);
};

// ObjectId comparison
export const hasId = (
  arr: (Types.ObjectId | string)[],
  target: Types.ObjectId | string,
) => {
  const targetStr = target.toString();
  return arr.some((id) => id.toString() === targetStr);
};

// remove ObjectId from array
export const removeId = (
  arr: Types.ObjectId[],
  target: Types.ObjectId | string,
): Types.ObjectId[] => {
  const targetStr = target.toString();
  return arr.filter((id) => id.toString() !== targetStr);
};

// missing fields check
export const requireFields = (res: Response, fields: Record<string, any>) => {
  const missing = Object.entries(fields)
    .filter(([_, v]) => !v)
    .map(([k]) => k);

  if (missing.length)
    throwError(res, 400, `Missing fields: ${missing.join(", ")} `);
};

// target user validation
export const validateTargetUser = (
  res: Response,
  currentUserId: string,
  target: string,
) => {
  requireFields(res, { target });

  if (!mongoose.Types.ObjectId.isValid(target))
    throwError(res, 400, "Invalid userID");

  if (currentUserId === target)
    throwError(res, 400, "Target user cannot be self");
};

// check if users exist
export const findUsers = async (
  res: Response,
  currentUserId: string,
  targetId: string,
) => {
  const [currentUser, targetUser] = await Promise.all([
    User.findById(currentUserId),
    User.findById(targetId),
  ]);

  if (!currentUser) throwError(res, 401, "Authenticated User not found");
  if (!targetUser) throwError(res, 401, "Target User not found");
  return { currentUser: currentUser!, targetUser: targetUser! };
};
