"use client";
import { useRef, useEffect, useState } from "react";
import { Rect } from "@/app/draw/rect";
import { Line } from "@/app/draw/line";
import { Eraser } from "@/app/draw/eraser";
import { redrawAll } from "@/components/draw";
import { Text } from "@/app/draw/text";
import { Circle } from "@/app/draw/circle";
import { getExistingShapes, DrawProps } from "./common";

export function Canvas({
  roomId,
  socket,
}: {
  roomId: number;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const [tool, setTool] = useState("");
  const [shapes, setShapes] = useState<DrawProps[]>([]);

  // load existing DB shapes
  useEffect(() => {
    getExistingShapes(roomId).then((data) => setShapes(data));
  }, [roomId]);

  // canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  // redraw when shapes change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) redrawAll(ctx, canvasRef.current, shapes);
  }, [shapes]);

  // receive from WS
  useEffect(() => {
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "chat" && msg.message) {
        const shape = JSON.parse(msg.message);
        if (shape?.id) {
          setShapes((prev) => {
            if (prev.find((s) => s.id === shape.id)) return prev; // avoid dupes
            return [...prev, shape];
          });
        }
      }

      if (msg.type === "erase" && msg.shapeId) {
        setShapes((prev) => prev.filter((s) => s.id !== msg.shapeId));
      }
    };
  }, [socket]);

  // tool handling
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (tool === "rect") cleanup = Rect(canvasRef, setShapes, socket, roomId);
    if (tool === "line") cleanup = Line(canvasRef, setShapes, socket, roomId);
    if (tool === "eraser")
      cleanup = Eraser(canvasRef, setShapes, socket, roomId);
    if (tool === "text") cleanup = Text(canvasRef, setShapes, socket, roomId);
    if (tool === "circle") cleanup = Circle(canvasRef, setShapes, socket, roomId);

    return () => {
      if (cleanup) cleanup();
    };
  }, [tool, socket, roomId]);

  return (
    <>
      <canvas ref={canvasRef} className="block h-screen w-screen bg-black" />
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex gap-4 mt-5 z-10">
        <button
          className="bg-blue-500 hover:bg-amber-400 text-black px-5 py-2 rounded shadow transition-colors duration-150"
          onClick={() => setTool("rect")}
        >
          Rectangle
        </button>
        <button
          className="bg-blue-500 hover:bg-amber-400 text-black px-5 py-2 rounded shadow transition-colors duration-150"
          onClick={() => setTool("circle")}
        >
          Circle
        </button>
        <button
          className="bg-blue-500 hover:bg-amber-400 text-black px-5 py-2 rounded shadow transition-colors duration-150"
          onClick={() => setTool("line")}
        >
          Line
        </button>
        <button
          className="bg-blue-500 hover:bg-amber-400 text-black px-5 py-2 rounded shadow transition-colors duration-150"
          onClick={() => setTool("eraser")}
        >
          Eraser
        </button>
        <button
          className="bg-blue-500 hover:bg-amber-400 text-black px-5 py-2 rounded shadow transition-colors duration-150"
          onClick={() => setTool("text")}
        >
          Text
        </button>
      </div>
    </>
  );
}
