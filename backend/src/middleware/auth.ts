import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User, IUser } from "../models";
import * as config from "../config";

interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  id: string;
}

// middleware to protect routes
export const protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
      return config.throwError(res, 401, "Authorization: No token found");

    try {
      const decoded = jwt.verify(token, config.ENV.JWT_SECRET) as JwtPayload;
      const user = await User.findById(decoded.id).select("-password");

      if (!user)
        return config.throwError(res, 401, "Authorization: User not found");

      req.user = user;
      next();
    } catch (e) {
      config.throwError(res, 401, "Authorization: Token failed");
    }
  },
);
