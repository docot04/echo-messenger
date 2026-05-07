import mongoose, { Schema, Document, Types } from "mongoose";
import { ENV } from "../config";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  publicKey: string;
  encryptedPrivateKey: string;
  encryptedPrivateKeySalt: string;
  bio?: string;
  pic?: string;
  friends: Types.ObjectId[];
  blocked: Types.ObjectId[];
  pendingRequests: Types.ObjectId[];
  sentRequests: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    publicKey: { type: String, required: true },
    encryptedPrivateKey: { type: String, required: true },
    encryptedPrivateKeySalt: { type: String, required: true },
    bio: { type: String, default: "" },
    pic: { type: String, default: ENV.DEFAULT_IMAGE },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    blocked: [{ type: Schema.Types.ObjectId, ref: "User" }],
    pendingRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    sentRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", userSchema);
