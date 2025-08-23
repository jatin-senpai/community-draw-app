import { DrawProps, existshapes } from "@/components/common";

export function Eraser(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let erasing = false;

  function onMouseDown(e: MouseEvent) {
    erasing = true;
    eraseAt(e.offsetX, e.offsetY);
  }

  function onMouseMove(e: MouseEvent) {
    if (erasing) {
      eraseAt(e.offsetX, e.offsetY);
    }
  }

  function onMouseUp() {
    erasing = false;
  }

  function eraseAt(x: number, y: number) {
    for (let i = 0; i < existshapes.length; i++) {
      const shape = existshapes[i];

      if (shape.type === "rect") {
        if (
          x >= shape.startX &&
          x <= shape.startX + shape.width! &&
          y >= shape.startY &&
          y <= shape.startY + shape.height!
        ) {
          existshapes.splice(i, 1);
          redrawAll();
          break;
        }
      }

      if (shape.type === "line") {
        const dist = pointToLineDistance(
          x,
          y,
          shape.startX,
          shape.startY,
          shape.endX!,
          shape.endY!
        );
        if (dist < 5) {
          existshapes.splice(i, 1);
          redrawAll();
          break;
        }
      }

      // TODO: add circle detection here
    }
  }

  function redrawAll() {
    if(!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    existshapes.forEach((shape) => {
      ctx.strokeStyle = "white";
      if (shape.type === "rect") {
        ctx.strokeRect(shape.startX, shape.startY, shape.width!, shape.height!);
      } else if (shape.type === "line") {
        ctx.beginPath();
        ctx.moveTo(shape.startX, shape.startY);
        ctx.lineTo(shape.endX!, shape.endY!);
        ctx.stroke();
      }
    });
  }

  function pointToLineDistance(
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // ✅ attach named listeners
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);

  // ✅ cleanup for when tool changes
  return () => {
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseup", onMouseUp);
  };
}
