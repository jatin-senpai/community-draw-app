// components/common.ts
import axios from "axios";
import { httpUrl } from "./config";

export interface DrawProps {
  id: string; // ✅ unique DB id (or message id)
  type: "rect" | "circle" | "line" | "text";
  startX: number;
  startY: number;
  height?: number;
  width?: number;
  endX?: number;
  endY?: number;
  radius?: number;
  text?: string;
  userId?: string; // added for ownership
}

/**
 * Fetch all existing shapes for a given room
 */
export async function getExistingShapes(roomId: number): Promise<DrawProps[]> {
  try {
    const res = await axios.get(`${httpUrl}/chats/${roomId}`, {
      headers: {
        Authorization:
          "Bearer " +
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlMDViNGUxMC0xMDkyLTQwZmYtYjI1MS04NGEzNzJmOWNiZmEiLCJpYXQiOjE3NTYxMTY5MTd9.LhMQNhlP2sDjIOYxOSQ00sU5kJyqscKoWSercr9ImSo",
      },
    });

    // ✅ backend returns array directly (not { messages: [...] })
    const shapes: DrawProps[] = (res.data as any[])
      .map((shape) => {
        if (!shape || !shape.type) return null;
        return {
          ...shape,
          id: shape.id,
          userId: shape.userId,
        } as DrawProps;
      })
      .filter((x): x is DrawProps => x !== null); // ✅ type guard removes nulls

    return shapes;
  } catch (err: any) {
    console.error("Error fetching shapes:", err?.response?.data || err.message);
    return [];
  }
}
