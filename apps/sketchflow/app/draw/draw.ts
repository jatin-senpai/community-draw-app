interface DrawProps {
    type: "rect" | "circle" | "line";
    startX: number;
    startY: number;
    height: number;
    width: number;

}

export function Draw(canvasRef: React.RefObject<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let existshapes:DrawProps[] = []
    let clicked = false;
    let startX = 0;
    let startY = 0;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.addEventListener("mousedown", (e) => {
      clicked = true;
      startX = e.offsetX;
      startY = e.offsetY;
    });

    canvas.addEventListener("mouseup", (e) => {
      clicked = false;
      const width = e.offsetX - startX;
      const height = e.offsetY - startY;
      existshapes.push({
        type: "rect",
        startX,
        startY,
        width,
        height
      })



    });

    canvas.addEventListener("mousemove", (e) => {
      if (clicked) {
        const width = e.offsetX - startX;
        const height = e.offsetY - startY;
        clearcanvas(ctx, canvas, existshapes);
        ctx.strokeStyle = "white";
        ctx.strokeRect(startX, startY, width, height);
        
      }
    });
    function clearcanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement,existshapes:DrawProps[]){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        existshapes.map((shape)=>{
            if (shape.type === "rect"){
                ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
            }
        })

    }
}
