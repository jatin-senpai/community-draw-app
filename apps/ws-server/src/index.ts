// ws-server.ts
import { WebSocketServer } from "ws";
import WebSocket from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_Secret } from "@repo/backend-common/jwtconfig";
import { prismaClient } from "@repo/db/client";

interface UserConn {
  userId: string;
  rooms: string[]; // array of stringified roomIds
  ws: WebSocket;
}

const wss = new WebSocketServer({ port: 8080 });
const users: UserConn[] = [];

function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_Secret);
    if (typeof decoded === "string") return null;
    const uid = (decoded as JwtPayload)?.userId;
    return typeof uid === "string" ? uid : null;
  } catch (e) {
    console.error("Token verification failed:", e);
    return null;
  }
}

wss.on("connection", (ws, request) => {
  const url = request.url; // e.g. "/?token=abc"
  if (!url) {
    ws.close(1008, "Invalid URL");
    return;
  }

  const query = new URLSearchParams(url.split("?")[1] ?? "");
  const token = query.get("token") || "";
  const userId = verifyToken(token);

  if (!userId) {
    ws.close(1008, "Invalid token");
    return;
  }

  // track user connection
  const conn: UserConn = { userId, rooms: [], ws };
  users.push(conn);

  ws.on("close", () => {
    const idx = users.indexOf(conn);
    if (idx >= 0) users.splice(idx, 1);
  });

  ws.on("message", async (raw) => {
    let data: any;
    try {
      data = JSON.parse(raw.toString());
    } catch {
      console.warn("Invalid WS payload:", raw.toString());
      return;
    }

    // --- join room ---
    if (data.type === "joinRoom") {
      const roomId = String(data.roomId);
      if (!conn.rooms.includes(roomId)) {
        conn.rooms.push(roomId);
      }
      return;
    }

    // --- leave room ---
    if (data.type === "leaveRoom") {
      const roomId = String(data.roomId);
      conn.rooms = conn.rooms.filter((r) => r !== roomId);
      return;
    }

    // --- new shape / chat ---
    if (data.type === "chat") {
      const roomIdNum = Number(data.roomId);
      if (isNaN(roomIdNum)) return;

      if (!conn.userId) {
        console.error("Missing userId for chat");
        return;
      }

      const rawMessage: string = data.message; // this is a JSON string from client
      let shape: any;
      try {
        shape = JSON.parse(rawMessage);
      } catch {
        console.warn("WS chat payload is not valid JSON shape");
        return;
      }

      // Persist in DB
      let chat;
      try {
        chat = await prismaClient.chat.create({
          data: {
            roomId: roomIdNum,
            userId: conn.userId,
            message: rawMessage, // store raw (original) payload too
          },
        });
      } catch (err) {
        console.error("Error saving chat:", err);
        return;
      }

      // Critical: overwrite/attach database id + userId so frontends can erase/delete
      shape.id = chat.id;
      shape.userId = conn.userId;

      // Broadcast to everyone in the room (including sender)
      // Keep the `message` field as a JSON string because your frontend expects msg.message to be a JSON string
      const payload = JSON.stringify({
        type: "chat",
        roomId: roomIdNum,
        message: JSON.stringify(shape),
      });

      users.forEach((u) => {
        if (u.rooms.includes(String(roomIdNum))) {
          try {
            u.ws.send(payload);
          } catch (e) {
            console.warn("Failed to send ws payload", e);
          }
        }
      });

      return;
    }

    // --- erase shape ---
    if (data.type === "erase") {
      const roomIdNum = Number(data.roomId);
      if (isNaN(roomIdNum)) return;

      const shapeId: string = data.shapeId;
      if (!shapeId) return;

      // delete from DB (if present)
      try {
        await prismaClient.chat.delete({ where: { id: shapeId } });
      } catch (err) {
        console.error("Error deleting shape:", err);
        // still broadcast erase so UIs stay in sync even if shape was already gone
      }

      // Broadcast erase
      const payload = JSON.stringify({
        type: "erase",
        roomId: roomIdNum,
        shapeId,
      });

      users.forEach((u) => {
        if (u.rooms.includes(String(roomIdNum))) {
          try {
            u.ws.send(payload);
          } catch (e) {
            console.warn("Failed to send erase payload", e);
          }
        }
      });

      return;
    }

    // Unknown types are ignored
  });
});

console.log("WS server listening on :8080");
