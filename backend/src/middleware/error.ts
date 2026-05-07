import { Request, Response, NextFunction } from "express";
import * as config from "../config";

// 404 handler
export function notFound(req: Request, res: Response, next: NextFunction) {
  const error = new Error(`Not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
}

// general purpose handler
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const statusCode = err.statusCode || res.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: config.ENV.NODE_ENV === "production" ? undefined : err.stack,
  });
}
