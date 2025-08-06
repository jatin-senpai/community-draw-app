import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const JWT_Secret = process.env.JWT_SECRET || 'default_fallback_secret';
