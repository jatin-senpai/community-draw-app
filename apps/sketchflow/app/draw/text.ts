import { DrawProps } from "../../components/common";
import { redrawAll } from "../../components/draw";
import { v4 as uuidv4 } from "uuid";

export function Text(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setShapes: React.Dispatch<React.SetStateAction<DrawProps[]>>,
  socket: WebSocket,
  roomId: number
) {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  function onClick(e: MouseEvent) {
    const text = prompt("Enter text:");
    if (!text) return;


    const newShape: DrawProps = {
      id: uuidv4(),
      type: "text",
      startX: e.offsetX,
      startY: e.offsetY,
      text,
    };


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


  canvas.addEventListener("click", onClick);


  return () => {
    canvas.removeEventListener("click", onClick);
  };
}
