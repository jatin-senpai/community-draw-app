// server.ts
import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import { prismaClient } from "@repo/db/client";
import { UserSchema, SignInSchema, RoomSchema } from "@repo/backend-common/types";
import { JWT_Secret } from "@repo/backend-common/jwtconfig";
import { middleware } from "./middleware";

const app = express();
app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());


app.post("/signup", async (req, res) => {
  const parseData = UserSchema.safeParse(req.body);
  if (!parseData.success) return res.status(400).json({ error: "invalid inputs" });

  try {
    const user = await prismaClient.user.create({
      data: {
        email: parseData.data.email,
        password: parseData.data.password, 
        name: parseData.data.name,
      },
    });

    res.status(200).json({ userId: user.id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "User already exists" });
  }
});


app.post("/signin", async (req, res) => {
  const parseData = SignInSchema.safeParse(req.body);
  if (!parseData.success) return res.status(400).json({ error: "invalid inputs" });

  const user = await prismaClient.user.findFirst({
    where: {
      email: parseData.data.email,
      password: parseData.data.password, 
      
    },
  });

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, JWT_Secret);
  res.status(200).json({ token });
});


app.post("/create-room", middleware, async (req, res) => {
  const data = RoomSchema.safeParse(req.body);
  if (!data.success) return res.status(400).json({ error: "invalid inputs" });

  // @ts-ignore
  const userId = req.userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: data.data.name,
        adminId: userId,
      },
    });

    await prismaClient.roomMember.create({
      data: {
        userId,
        roomId: room.id,
      },
    });

    res.json({ roomId: room.id, slug: room.slug });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/rooms/join/:slug", middleware, async (req, res) => {
  const { slug } = req.params;
  // @ts-ignore
  const userId = req.userId;

  const room = await prismaClient.room.findUnique({ where: { slug } });
  if (!room) return res.status(404).json({ error: "Room not found" });

  await prismaClient.roomMember.upsert({
    where: {
      userId_roomId: { userId, roomId: room.id },
    },
    update: {},
    create: { userId, roomId: room.id },
  });

  res.json({ success: true, roomId: room.id });
});


app.get("/rooms", middleware, async (req, res) => {
  // @ts-ignore
  const userId = req.userId;

  const memberships = await prismaClient.roomMember.findMany({
    where: { userId },
    include: { room: true },
  });

  return res.json({ rooms: memberships.map((m: any) => m.room) }); // fixed TS error
});


app.get("/chats/:roomId", middleware, async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    if (isNaN(roomId)) return res.status(400).json({ error: "Invalid roomId" });

    const chats = await prismaClient.chat.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
      take: 500,
    });

    const shapes = chats.map((chat: any) => {
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


app.post("/chats/:roomId", middleware, async (req, res) => {
  const roomId = Number(req.params.roomId);
  if (isNaN(roomId)) return res.status(400).json({ error: "Invalid roomId" });

  // @ts-ignore
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

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


app.delete("/chats/:roomId/:shapeId", middleware, async (req, res) => {
  const roomId = Number(req.params.roomId);
  const shapeId = req.params.shapeId;

  if (isNaN(roomId)) return res.status(400).json({ error: "Invalid roomId" });

  try {
    // @ts-ignore
    const userId = req.userId;

    await prismaClient.chat.deleteMany({
      where: {
        id: shapeId,
        roomId,
        userId,
      },
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Error deleting shape:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3003, () => {
  console.log("HTTP server listening on :3003");
});
