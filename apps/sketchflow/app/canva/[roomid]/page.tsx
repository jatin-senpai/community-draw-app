"use client";
import { useRef, useEffect, useState } from "react";
import { Rect } from "@/app/draw/rect";
import { Line } from "@/app/draw/line";
import { Eraser } from "@/app/draw/eraser";
import { redrawAll } from "@/components/draw";
import { Text } from "@/app/draw/text";
import { Circle } from "@/app/draw/circle";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const [tool, setTool] = useState("");

  // ✅ only once: set up canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  // ✅ tool switching
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (tool === "rect") cleanup = Rect(canvasRef);
    if (tool === "line") cleanup = Line(canvasRef);
    if (tool === "eraser") cleanup = Eraser(canvasRef);
    if (tool === "text") cleanup = Text(canvasRef);
    if (tool === "circle") cleanup = Circle(canvasRef);

    return () => {
      if (cleanup) cleanup();
    };
  }, [tool]);

  return (
    <>
      <canvas ref={canvasRef} className="block h-screen w-screen bg-black" />
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex gap-4 mt-5 z-10">
        <button onClick={() => setTool("rect")} className="bg-blue-500 hover:bg-amber-400 text-black px-5 py-2 rounded shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300">Rectangle</button>
        <button onClick={() => setTool("circle")} className="bg-blue-500 hover:bg-amber-400 text-black px-5 py-2 rounded shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300">Circle</button>
        <button onClick={() => setTool("line")} className="bg-blue-500 hover:bg-amber-400 text-black px-5 py-2 rounded shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300">Line</button>
        <button onClick={() => setTool("eraser")} className="bg-blue-500 hover:bg-amber-400 text-black px-5 py-2 rounded shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300">Eraser</button>
        <button onClick={() => setTool("text")} className="bg-blue-500 hover:bg-amber-400 text-black px-5 py-2 rounded shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300">Text🗨️</button>
      </div>
    </>
  );
}
