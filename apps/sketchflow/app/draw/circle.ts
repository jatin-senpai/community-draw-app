import { DrawProps } from "../../components/common";
import { redrawAll } from "../../components/draw";
import { v4 as uuidv4 } from "uuid";

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

  function onMouseUp(e: MouseEvent) {
    if (!drawing) return;
    drawing = false;

    const endX = e.offsetX;
    const endY = e.offsetY;
    const radius = Math.hypot(endX - startX, endY - startY);

    if (radius < 2) return; // ignore tiny circles

    const newShape: DrawProps = {
      id: uuidv4(),
      type: "circle",
      startX,
      startY,
      radius,
    };

    setShapes((prev) => {
      const updated = [...prev.filter((s) => s.id !== "preview"), newShape];
      //@ts-ignore
      redrawAll(ctx, canvas, updated);
      return updated;
    });

    // Broadcast immediately
    socket.send(
      JSON.stringify({
        type: "chat",
        roomId,
        message: JSON.stringify(newShape),
      })
    );

    // Save in background (optional)
    fetch(`https://httpserver-zram.onrender.com/${roomId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newShape),
    }).catch((err) => console.error("Error saving circle:", err));
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
