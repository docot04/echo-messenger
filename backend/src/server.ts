import express from "express";
import * as config from "./config";
import * as middleware from "./middleware";
import * as routes from "./routes";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { initSocket } from "./socket";

const startServer = async () => {
  await config.connectDB();
  const app = express();
  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  const httpServer = createServer(app);
  initSocket(httpServer);

  // MIDDLEWARES
  app.use(helmet());
  app.use(compression());
  app.use(
    cors({
      origin: config.ENV.ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(middleware.logger);

  // RATE LIMIT (auth)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
  });

  app.use("/api/user/login", authLimiter);
  app.use("/api/user/register", authLimiter);

  // HEALTH ROUTE
  app.use("/health", routes.health);
  app.get("/", (_req, res) => {
    res.send("API is running...");
  });
  app.use("/api/user", routes.user);
  app.use("/api/chat", routes.chat);
  app.use("/api/message", routes.message);

  // ERROR HANDLING
  app.use(middleware.notFound);
  app.use(middleware.errorHandler);

  // START SERVER
  const server = httpServer.listen(config.ENV.PORT, () => {
    console.log(
      `Server running in ${config.ENV.NODE_ENV} mode on port ${config.ENV.PORT}`,
    );
  });

  // SHUTDOWN SERVER
  process.on("unhandledRejection", (err: any) => {
    console.error("Unhandled Rejection:", err);
    server.close(() => process.exit(1));
  });

  process.on("uncaughtException", (err: any) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
  });
};

startServer();
