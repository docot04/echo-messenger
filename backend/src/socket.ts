import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import * as config from "./config";

export let io: Server;

export const initSocket = (httpServer: HTTPServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: config.ENV.ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("setup", (userId: string) => {
      socket.join(userId);
      socket.emit("connected");
    });

    socket.on("join chat", (chatId: string) => {
      socket.join(chatId);
    });

    socket.on("typing", (chatId: string) => {
      socket.to(chatId).emit("typing");
    });

    socket.on("stop typing", (chatId: string) => {
      socket.to(chatId).emit("stop typing");
    });

    socket.on("new message", (message) => {
      const chat = message.chat;

      if (!chat?.users) return;

      chat.users.forEach((user: any) => {
        if (user._id === message.sender._id) return;

        socket.to(user._id).emit("message received", message);
      });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};
