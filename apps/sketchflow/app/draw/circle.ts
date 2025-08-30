import { DrawProps } from "../../components/common";
import { redrawAll } from "../../components/draw";
import { v4 as uuidv4 } from "uuid";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlMDViNGUxMC0xMDkyLTQwZmYtYjI1MS04NGEzNzJmOWNiZmEiLCJpYXQiOjE3NTYxMTY5MTd9.LhMQNhlP2sDjIOYxOSQ00sU5kJyqscKoWSercr9ImSo"; // replace with your full JWT

export function Circle(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setShapes: React.Dispatch<React.SetStateAction<DrawProps[]>>,
  socket: WebSocket,
  roomId: number
) {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let drawing = false;
  let startX = 0;
  let startY = 0;

  function onMouseDown(e: MouseEvent) {
    drawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
  }

  function onMouseMove(e: MouseEvent) {
    if (!drawing) return;

    const currentX = e.offsetX;
    const currentY = e.offsetY;
    const radius = Math.hypot(currentX - startX, currentY - startY);

    const previewShape: DrawProps = {
      id: "preview",
      type: "circle",
      startX,
      startY,
      radius,
    };

    setShapes((prev) => {
      const updated = [...prev.filter((s) => s.id !== "preview"), previewShape];
      //@ts-ignore
      redrawAll(ctx, canvas, updated);
      return updated;
    });
  }

  async function onMouseUp(e: MouseEvent) {
    if (!drawing) return;
    drawing = false;

    const endX = e.offsetX;
    const endY = e.offsetY;
    const radius = Math.hypot(endX - startX, endY - startY);

    if (radius < 2) return; // ignore tiny circles

    const tempShape: DrawProps = {
      id: uuidv4(),
      type: "circle",
      startX,
      startY,
      radius,
    };

    setShapes((prev) => {
      const updated = [...prev.filter((s) => s.id !== "preview"), tempShape];
      //@ts-ignore
      redrawAll(ctx, canvas, updated);
      return updated;
    });

    try {
      const res = await fetch(`http://localhost:3003/chats/${roomId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`, 
        },
        body: JSON.stringify(tempShape),
      });

      const savedShape = await res.json();

      setShapes((prev) => {
        const updated = prev.map((s) =>
          s.id === tempShape.id ? savedShape : s
        );
        //@ts-ignore
        redrawAll(ctx, canvas, updated);
        return updated;
      });

      socket.send(
        JSON.stringify({
          type: "chat",
          roomId,
          message: JSON.stringify(savedShape),
        })
      );
    } catch (err) {
      console.error("Error saving circle:", err);
    }
  }

  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);

  return () => {
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseup", onMouseUp);
  };
}
