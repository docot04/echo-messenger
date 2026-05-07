import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
  sender: Types.ObjectId;
  chat: Types.ObjectId;
  isEncrypted: boolean;
  content: string; // plaintext for groupchat messages (not encrypted), encrypted payload otherwise
  iv?: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    isEncrypted: { type: Boolean, default: true },
    content: { type: String, required: true },
    iv: { type: String },
  },
  { timestamps: true },
);

export const Message = mongoose.model<IMessage>("Message", messageSchema);
