import { existshapes } from "../../components/common";
import { redrawAll } from "@/components/draw";

export function Line(canvasRef: React.RefObject<HTMLCanvasElement>) {
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

    const endX = e.offsetX;
    const endY = e.offsetY;

    existshapes.push({
      type: "line",
      startX,
      startY,
      endX,
      endY,
    });

    // redraw with the new line added
    if(!ctx) return
    redrawAll(ctx, canvas);
  }

  function onMouseMove(e: MouseEvent) {
    if (!ctx || !clicked) return;

    const endX = e.offsetX;
    const endY = e.offsetY;

    // redraw everything first
    redrawAll(ctx, canvas);

    // then preview current line
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }

  
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mousemove", onMouseMove);

  
  return () => {
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mouseup", onMouseUp);
    canvas.removeEventListener("mousemove", onMouseMove);
  };
}
