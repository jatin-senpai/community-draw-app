import { existshapes, DrawProps } from "../../components/common";

function clearcanvas(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  existshapes: DrawProps[]
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  existshapes.forEach((shape) => {
    if (shape.type === "rect" && shape.width !== undefined && shape.height !== undefined) {
      ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
    }
  });
}

export function Rect(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let clicked = false;
  let startX = 0;
  let startY = 0;

  // ✅ define functions explicitly
  function onMouseDown(e: MouseEvent) {
    clicked = true;
    startX = e.offsetX;
    startY = e.offsetY;
  }

  function onMouseUp(e: MouseEvent) {
    if(!ctx) return;
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
    clearcanvas(ctx, canvas, existshapes); // redraw all
  }

  function onMouseMove(e: MouseEvent) {
    if (clicked) {
      if(!ctx) return;
      const width = e.offsetX - startX;
      const height = e.offsetY - startY;
      clearcanvas(ctx, canvas, existshapes);
      ctx.strokeStyle = "white";
      ctx.strokeRect(startX, startY, width, height);
    }
  }

  // ✅ attach once
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mousemove", onMouseMove);

  // ✅ return cleanup so Canvas.tsx can remove them when switching tools
  return () => {
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mouseup", onMouseUp);
    canvas.removeEventListener("mousemove", onMouseMove);
  };
}
