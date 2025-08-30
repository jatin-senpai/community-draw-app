import { DrawProps } from "../../components/common";
import { redrawAll } from "../../components/draw";
import axios from "axios";
import { httpUrl } from "../../components/config";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlMDViNGUxMC0xMDkyLTQwZmYtYjI1MS04NGEzNzJmOWNiZmEiLCJpYXQiOjE3NTYxMTY5MTd9.LhMQNhlP2sDjIOYxOSQ00sU5kJyqscKoWSercr9ImSo";

export function Eraser(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setShapes: React.Dispatch<React.SetStateAction<DrawProps[]>>,
  socket: WebSocket,
  roomId: number
) {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  function isShapeHit(s: DrawProps, x: number, y: number): boolean {
    if (s.type === "rect" && s.width && s.height) {
      const within =
        x >= s.startX &&
        x <= s.startX + s.width &&
        y >= s.startY &&
        y <= s.startY + s.height;
      const nearEdge =
        Math.abs(x - s.startX) < 5 ||
        Math.abs(x - (s.startX + s.width)) < 5 ||
        Math.abs(y - s.startY) < 5 ||
        Math.abs(y - (s.startY + s.height)) < 5;
      return within || nearEdge;
    } else if (s.type === "circle" && s.radius) {
      const dx = x - s.startX;
      const dy = y - s.startY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return Math.abs(dist - s.radius) < 5;
    } else if (s.type === "line" && s.endX && s.endY) {
      const A = x - s.startX;
      const B = y - s.startY;
      const C = s.endX - s.startX;
      const D = s.endY - s.startY;

      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      const t = Math.max(0, Math.min(1, dot / lenSq));

      const px = s.startX + t * C;
      const py = s.startY + t * D;
      const dist = Math.hypot(px - x, py - y);
      return dist < 5;
    } else if (s.type === "text" && s.text) {
      return (
        x >= s.startX &&
        x <= s.startX + s.text.length * 10 &&
        y <= s.startY &&
        y >= s.startY - 20
      );
    }
    return false;
  }

  async function onClick(e: MouseEvent) {
    const x = e.offsetX;
    const y = e.offsetY;

    setShapes((prev) => {
      const shape = prev.find((s) => isShapeHit(s, x, y));
      if (!shape) return prev;

      const updated = prev.filter((s) => s.id !== shape.id);

      // @ts-ignore
      redrawAll(ctx, canvas, updated);

      // delete from DB (UUID string, not number)
      if (!shape.id.toString().startsWith("temp")) {
        axios.delete(`${httpUrl}/chats/${roomId}/${shape.id}`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });
      }

      // broadcast erase
      socket.send(
        JSON.stringify({
          type: "erase",
          roomId,
          shapeId: shape.id,
        })
      );

      return updated;
    });
  }

  canvas.addEventListener("click", onClick);

  return () => {
    canvas.removeEventListener("click", onClick);
  };
}
