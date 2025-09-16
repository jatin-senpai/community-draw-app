import axios from "axios";
import { httpUrl } from "./config";

export interface DrawProps {
  id: string;
  type: "rect" | "circle" | "line" | "text" | "mermaid";
  startX: number;
  startY: number;
  height?: number;
  width?: number;
  endX?: number;
  endY?: number;
  radius?: number;
  text?: string;
  userId?: string;
  code?: string;
  x?: number;
  y?: number;

  
  img?: HTMLImageElement;
}

export function createMermaidShape(shape: {
  id: string;
  code: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  userId?: string;
  img?: HTMLImageElement;
}): DrawProps {
  return {
    id: shape.id,
    type: "mermaid",
    code: shape.code,
    x: shape.x,
    y: shape.y,
    width: shape.width ?? 300,
    height: shape.height ?? 200,
    startX: shape.x,
    startY: shape.y,
    userId: shape.userId,
    img: shape.img, 
  };
}

export async function getExistingShapes(roomId: number): Promise<DrawProps[]> {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${httpUrl}/chats/${roomId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    const shapes: DrawProps[] = (res.data as any[])
      .map((shape) => {
        if (!shape || !shape.type) return null;
        return {
          id: shape.id,
          type: shape.type,
          startX: shape.startX ?? shape.x ?? 0,
          startY: shape.startY ?? shape.y ?? 0,
          endX: shape.endX,
          endY: shape.endY,
          height: shape.height,
          width: shape.width,
          radius: shape.radius,
          text: shape.text,
          userId: shape.userId,
          code: shape.code,
          x: shape.x,
          y: shape.y,
        } as DrawProps;
      })
      .filter((x): x is DrawProps => x !== null);

    return shapes;
  } catch (err: any) {
    console.error("Error fetching shapes:", err?.response?.data || err.message);
    return [];
  }
}
