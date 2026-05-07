import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { ENV } from "./env";

interface JwtPayload {
  id: string;
}

export function generateToken(id: string | Types.ObjectId) {
  return jwt.sign({ id: id.toString() }, ENV.JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
}
