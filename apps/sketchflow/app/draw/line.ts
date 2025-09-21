import { DrawProps } from "../../components/common";
import { redrawAll } from "../../components/draw";
import { v4 as uuidv4 } from "uuid";

export function Line(
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

    previewShape = {
      id: uuidv4(), 
      type: "line",
      startX,
      startY,
      endX: e.offsetX,
      endY: e.offsetY,
    };

    setShapes((prev) => {
      //@ts-ignore
      redrawAll(ctx, canvas, [...prev, ...(previewShape ? [previewShape] : [])]);
      return prev; 
    });
  }

  function onMouseUp(e: MouseEvent) {
    if (!drawing) return;
    drawing = false;

    const newShape: DrawProps = {
      id: uuidv4(), 
      type: "line",
      startX,
      startY,
      endX: e.offsetX,
      endY: e.offsetY,
    };
    previewShape = null;


    setShapes((prev) => {
      const updated = [...prev, newShape];
      //@ts-ignore
      redrawAll(ctx, canvas, updated);
      return updated;
    });


    socket.send(
      JSON.stringify({
        type: "chat",
        roomId,
        message: JSON.stringify(newShape),
      })
    );
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
