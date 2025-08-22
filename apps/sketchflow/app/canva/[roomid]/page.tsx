"use client";
import { useRef, useEffect } from "react";
import { Draw } from "@/app/draw/draw";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  useEffect(() => {})

  useEffect(() => {
    
    if (canvasRef.current){
        Draw(canvasRef);
    }

    // make canvas fill the window
    

    
    
  }, []);

  return <canvas ref={canvasRef} className="block h-screen w-screen bg-black" />;
}
