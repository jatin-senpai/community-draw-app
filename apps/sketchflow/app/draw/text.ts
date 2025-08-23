import { DrawProps } from "@/components/common";
import { redrawAll } from "@/components/draw";
import { existshapes } from "../../components/common";
export function Text(canvasRef:React.RefObject<HTMLCanvasElement>){
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

      const text = prompt("Enter text:");
      if (text) {
        if(!ctx) return;
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(text, startX, startY);

        // Store the text shape
        existshapes.push({
          type: "text",
          startX,
          startY,
          text,
        } as DrawProps & { text: string });

        // Redraw all to ensure text is persistent
        redrawAll(ctx, canvas);
      }
    }

    function onMouseMove(e: MouseEvent) {
      // No preview for text
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