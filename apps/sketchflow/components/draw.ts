import { DrawProps } from "./common";

export function redrawAll(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  shapes: DrawProps[]
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const shape of shapes) {
    if (shape.type === "rect" && shape.width && shape.height) {
      ctx.strokeStyle = "white";
      ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
    }

    if (shape.type === "circle" && shape.radius) {
      ctx.strokeStyle = "white";
      ctx.beginPath();
      ctx.arc(shape.startX, shape.startY, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (shape.type === "line" && shape.endX && shape.endY) {
      ctx.strokeStyle = "white";
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
    }

    if (shape.type === "text" && shape.text) {
      ctx.fillStyle = "white";
      ctx.font = "28px Arial";
      ctx.fillText(shape.text, shape.startX, shape.startY);
    }

    if (shape.type === "mermaid") {
    const width = shape.width ?? 300;
  const height = shape.height ?? 200;
  const x = shape.x ?? 50;
  const y = shape.y ?? 50;

  if (shape.img instanceof HTMLImageElement) {
    
    ctx.drawImage(shape.img, x, y, width, height);
  }
}
  }
}
