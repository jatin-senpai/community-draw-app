import { DrawProps, existshapes } from "@/components/common";

export function redrawAll(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  existshapes.forEach((shape) => {
    ctx.strokeStyle = "white";

    if (shape.type === "rect" && shape.width !== undefined && shape.height !== undefined) {
      ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
    } else if (
      shape.type === "line" &&
      shape.endX !== undefined &&
      shape.endY !== undefined
    ) {
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
    }
  });
}
