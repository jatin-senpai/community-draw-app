import { existshapes,DrawProps } from "../../components/common";
import { redrawAll } from "../../components/draw";
export function Circle(canvasRef:React.RefObject<HTMLCanvasElement>){
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

      const radius = Math.sqrt(
        Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
      );

      existshapes.push({
        type: "circle",
        startX,
        startY,
        radius,
      } as DrawProps & { radius: number });

      // redraw with the new circle added
      if(!ctx) return
      redrawAll(ctx, canvas);
    }

    function onMouseMove(e: MouseEvent) {
      if (!ctx || !clicked) return;

      const currentX = e.offsetX;
      const currentY = e.offsetY;

      const radius = Math.sqrt(
        Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)
      );

      // redraw everything first
      redrawAll(ctx, canvas);

      // then preview current circle
      ctx.strokeStyle = "white";
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
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