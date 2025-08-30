// server.ts
import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import { prismaClient } from "@repo/db/client";
import { UserSchema, SignInSchema, RoomSchema } from "@repo/backend-common/types";
import { JWT_Secret } from "@repo/backend-common/jwtconfig";
import { middleware } from "./middleware";

const app = express();
app.use(cors({
  origin: "*",
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// --- signup ---
app.post("/signup", async (req, res) => {
  const parseData = UserSchema.safeParse(req.body);
  if (!parseData.success) {
    return res.status(400).json({ error: "invalid inputs" });
  }
  try {
    const user = await prismaClient.user.create({
      data: {
        email: parseData.data.username,
        password: parseData.data.password,
        name: parseData.data.name,
      },
    });
    res.json({ userId: user.id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "User already exists" });
  }
});

// --- signin ---
app.post("/signin", async (req, res) => {
  const parseData = SignInSchema.safeParse(req.body);
  if (!parseData.success) {
    return res.status(400).json({ error: "invalid inputs" });
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: parseData.data.username,
      password: parseData.data.password,
    },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id }, JWT_Secret);
  res.json({ token });
});

// --- create room ---
app.post("/create-room", middleware, async (req, res) => {
  const data = RoomSchema.safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({ error: "invalid inputs" });
  }

  // @ts-ignore
  const userId = req.userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: data.data.name,
        adminId: userId,
      },
    });
    res.json({ roomId: room.id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// --- fetch shapes/chats for a room ---
app.get("/chats/:roomId", middleware, async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    if (isNaN(roomId)) {
      return res.status(400).json({ error: "Invalid roomId" });
    }

    const chats = await prismaClient.chat.findMany({
      where: { roomId },
      orderBy: { id: "asc" },
      take: 500,
    });

    const shapes = chats.map((chat) => {
      let parsed: any = {};
      try {
        parsed = JSON.parse(chat.message);
      } catch (e) {
        console.warn("Failed to parse chat.message for id", chat.id, e);
      }
      return { ...parsed, id: chat.id, userId: chat.userId };
    });

    res.json(shapes);
  } catch (err) {
    console.error("Error fetching chats:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// --- save shape ---
app.post("/chats/:roomId", middleware, async (req, res) => {
  const roomId = Number(req.params.roomId);
  if (isNaN(roomId)) {
    return res.status(400).json({ error: "Invalid roomId" });
  }

  // @ts-ignore
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const raw = JSON.stringify(req.body);
    const chat = await prismaClient.chat.create({
      data: {
        roomId,
        userId,
        message: raw,
      },
    });

    const shape = { ...req.body, id: chat.id, userId };
    res.json(shape);
  } catch (err) {
    console.error("Error saving shape:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// --- delete shape by DB id (safe version) ---
app.delete("/chats/:roomId/:shapeId", middleware, async (req, res) => {
  const roomId = Number(req.params.roomId);
  const shapeId = req.params.shapeId; // UUID string

  if (isNaN(roomId)) {
    return res.status(400).json({ error: "Invalid roomId" });
  }

  try {
    // @ts-ignore injected by middleware
    const userId = req.userId;

    const deleted = await prismaClient.chat.deleteMany({
      where: {
        id: shapeId,
        roomId// only allow owner to delete
      },
    });

    if (deleted.count === 0) {
      return res.status(403).json({ error: "Not allowed or not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting shape:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3003, () => {
  console.log("HTTP server listening on :3003");
});
