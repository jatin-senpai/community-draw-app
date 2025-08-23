import { DrawProps, existshapes } from "./common";
export function redrawAll(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // <-- important
  existshapes.forEach((shape) => {
    ctx.strokeStyle = "white";
    if (shape.type === "rect") {
      ctx.strokeRect(shape.startX, shape.startY, shape.width!, shape.height!);
    } else if (shape.type === "line") {
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX!, shape.endY!);
      ctx.stroke();
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.startX, shape.startY, shape.radius!, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape.type === "text" && shape.text) {
      ctx.font = "16px Arial";
      ctx.fillText(shape.text, shape.startX, shape.startY);
    }
  });
}
