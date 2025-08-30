import { DrawProps } from "../../components/common";
import { redrawAll } from "../../components/draw";
import { v4 as uuidv4 } from "uuid";

export function Rect(
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
  let previewShape: DrawProps | null = null;

  function onMouseDown(e: MouseEvent) {
    drawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    previewShape = null;
  }

  function onMouseMove(e: MouseEvent) {
    if (!drawing) return;

    const width = e.offsetX - startX;
    const height = e.offsetY - startY;

    // temporary preview shape
    previewShape = {
      id: uuidv4(),
      type: "rect",
      startX,
      startY,
      width,
      height,
    };

    setShapes((prev) => {
      //@ts-ignore
      redrawAll(ctx, canvas, [...prev, ...(previewShape ? [previewShape] : [])]);
      return prev; // keep state unchanged until mouseup
    });
  }

  function onMouseUp(e: MouseEvent) {
    if (!drawing) return;
    drawing = false;

    const width = e.offsetX - startX;
    const height = e.offsetY - startY;

    // permanent shape
    const newShape: DrawProps = {
      id: uuidv4(),
      type: "rect",
      startX,
      startY,
      width,
      height,
    };
    previewShape = null;

    // update state
    setShapes((prev) => {
      const updated = [...prev, newShape];
      //@ts-ignore
      redrawAll(ctx, canvas, updated);
      return updated;
    });

    // broadcast to server
    socket.send(
      JSON.stringify({
        type: "chat",
        roomId,
        message: JSON.stringify(newShape),
      })
    );
  }

  // Attach listeners
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);

  // Cleanup
  return () => {
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseup", onMouseUp);
  };
}
