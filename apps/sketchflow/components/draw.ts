import mermaid from "mermaid";
import { DrawProps } from "./common";

export async function redrawAll(
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

    if (shape.type === "mermaid" && shape.code) {
      const { code, x = 50, y = 50, width = 300, height = 200 } = shape;

      const { svg } = await mermaid.render(`m-${shape.id}`, code);
      const img = new Image();
      const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      await new Promise<void>((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, x, y, width, height);
          URL.revokeObjectURL(url);
          resolve();
        };
        img.src = url;
      });
    }
  }
}
