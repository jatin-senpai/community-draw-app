import { DrawProps } from "./common";

export function redrawAll(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  shapes: DrawProps[]
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "white";
  ctx.fillStyle = "white";

  shapes.forEach((shape) => {
    if (!shape || !shape.type) {
      console.warn("Skipping invalid shape:", shape);
      return;
    }

    if (shape.type === "rect" && shape.width && shape.height) {
      ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
    } 
    else if (shape.type === "line" && shape.endX && shape.endY) {
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
    } 
    else if (shape.type === "circle" && shape.radius) {
      ctx.beginPath();
      ctx.arc(shape.startX, shape.startY, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
    } 
    else if (shape.type === "text" && shape.text) {
      // set font before drawing
      ctx.font = "32px Arial";
      ctx.fillText(shape.text, shape.startX, shape.startY);
    } 
    else {
      console.warn("Unknown or incomplete shape:", shape);
    }
  });
}
