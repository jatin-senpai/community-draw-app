import { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_Secret } from "@repo/backend-common/jwtconfig";
export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, JWT_Secret);
    if(decoded){
        //@ts-ignore
        req.userId = decoded.userId;
        next();
    }
    else{
        return res.status(401).json({ message: "Unauthorized" });
    }
}