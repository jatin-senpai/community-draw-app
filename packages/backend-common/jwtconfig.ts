import dotenv from "dotenv";

dotenv.config();

export const JWT_Secret = process.env.JWT || "default_secret";
