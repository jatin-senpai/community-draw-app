import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_Secret } from "@repo/backend-common/jwtconfig";

export function middleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  console.log("🔑 Incoming Authorization header:", authHeader);

  const token = authHeader?.split(" ")[1];
  if (!token) {
    console.warn(" No token provided");
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_Secret) as { userId: string };
    console.log("✅ Token verified, decoded payload:", decoded);

    // @ts-ignore - attach to request
    req.userId = decoded.userId;

    next();
  } catch (err: any) {
    console.error(" JWT verification failed:", err.message);
    return res.status(401).json({ message: `Unauthorized: ${err.message}` });
  }
}
