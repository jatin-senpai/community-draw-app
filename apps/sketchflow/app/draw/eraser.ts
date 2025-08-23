import { existshapes } from "@/components/common";
import { redrawAll } from "@/components/draw";

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
    let erased = false;

    // loop backwards so splice doesn’t mess with indexes
    for (let i = existshapes.length - 1; i >= 0; i--) {
      const shape = existshapes[i];

      // ✅ FIXED RECTANGLE ERASE
      if (shape.type === "rect" && shape.width !== undefined && shape.height !== undefined) {
        const x1 = Math.min(shape.startX, shape.startX + shape.width);
        const x2 = Math.max(shape.startX, shape.startX + shape.width);
        const y1 = Math.min(shape.startY, shape.startY + shape.height);
        const y2 = Math.max(shape.startY, shape.startY + shape.height);

        if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
          existshapes.splice(i, 1);
          erased = true;
        }
      }

      else if (shape.type === "line" && shape.endX !== undefined && shape.endY !== undefined) {
        const dist = pointToLineDistance(x, y, shape.startX, shape.startY, shape.endX, shape.endY);
        if (dist < 5) {
          existshapes.splice(i, 1);
          erased = true;
        }
      }

      else if (shape.type === "circle" && shape.radius !== undefined) {
        const dist = Math.sqrt((x - shape.startX) ** 2 + (y - shape.startY) ** 2);
        if (dist <= shape.radius) {
          existshapes.splice(i, 1);
          erased = true;
        }
      }

      else if (shape.type === "text" && shape.text) {
        if(!ctx) return
        ctx.font = "16px Arial";
        const metrics = ctx.measureText(shape.text);
        const width = metrics.width;
        const height = 16; // estimate baseline height
        if (x >= shape.startX && x <= shape.startX + width &&
            y <= shape.startY && y >= shape.startY - height) {
          existshapes.splice(i, 1);
          erased = true;
        }
      }
    }

    if (erased) {
      if(!ctx) return
      redrawAll(ctx, canvas);
    }
  }

  function pointToLineDistance(px:number, py:number, x1:number, y1:number, x2:number, y2:number) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) param = dot / len_sq;

    let xx, yy;
    if (param < 0) { xx = x1; yy = y1; }
    else if (param > 1) { xx = x2; yy = y2; }
    else { xx = x1 + param * C; yy = y1 + param * D; }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);

  return () => {
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseup", onMouseUp);
  };
}
