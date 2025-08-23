import { existshapes, DrawProps } from "../../components/common";
import { redrawAll } from "../../components/draw";

export function Rect(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let clicked = false;
  let startX = 0;
  let startY = 0;

  function onMouseDown(e: MouseEvent) {
    clicked = true;
    startX = e.offsetX;
    startY = e.offsetY;
  }

  function onMouseUp(e: MouseEvent) {
    if (!clicked) return;
    clicked = false;

    const width = e.offsetX - startX;
    const height = e.offsetY - startY;

    existshapes.push({
      type: "rect",
      startX,
      startY,
      width,
      height,
    });
    //@ts-ignore

    redrawAll(ctx, canvas); // 🔥 central redraw
  }

  function onMouseMove(e: MouseEvent) {
    if (!clicked) return;

    const width = e.offsetX - startX;
    const height = e.offsetY - startY;
    if(!ctx) return
    redrawAll(ctx, canvas); // 🔥 redraw everything first
    
    ctx.strokeStyle = "white";
    ctx.strokeRect(startX, startY, width, height); // preview
  }

  // attach listeners
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mousemove", onMouseMove);

  // 🔥 always redraw on tool activation
  redrawAll(ctx, canvas);

  return () => {
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mouseup", onMouseUp);
    canvas.removeEventListener("mousemove", onMouseMove);
  };
}
