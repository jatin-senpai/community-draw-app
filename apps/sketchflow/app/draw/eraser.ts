import { DrawProps } from "../../components/common";
import { redrawAll } from "../../components/draw";
import axios from "axios";
import { httpUrl } from "../../components/config";

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
      return (
        x >= s.startX &&
        x <= s.startX + s.width &&
        y >= s.startY &&
        y <= s.startY + s.height
      );
    } else if (s.type === "circle" && s.radius) {
      const dx = x - s.startX;
      const dy = y - s.startY;
      return Math.sqrt(dx * dx + dy * dy) <= s.radius;
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
      return Math.hypot(px - x, py - y) < 5;
    } else if (s.type === "text" && s.text) {
      return (
        x >= s.startX &&
        x <= s.startX + s.text.length * 10 &&
        y <= s.startY &&
        y >= s.startY - 20
      );
    } else if (s.type === "mermaid" && s.x !== undefined && s.y !== undefined) {
      const width = s.width ?? 300;
      const height = s.height ?? 200;
      return x >= s.x && x <= s.x + width && y >= s.y && y <= s.y + height;
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
      if(ctx) redrawAll(ctx, canvas, updated); 
      

      if (!shape.id.toString().startsWith("temp")) {
        axios.delete(`${httpUrl}/chats/${roomId}/${shape.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

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
