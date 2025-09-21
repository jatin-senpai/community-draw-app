"use client";
import { useRef, useEffect, useState } from "react";
import mermaid from "mermaid";
import { Rect } from "@/app/draw/rect";
import { Line } from "@/app/draw/line";
import { Eraser } from "@/app/draw/eraser";
import { redrawAll } from "@/components/draw";
import { Text } from "@/app/draw/text";
import { Circle } from "@/app/draw/circle";
import { getExistingShapes, DrawProps, createMermaidShape } from "./common";

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

  useEffect(() => {
    getExistingShapes(roomId).then((data) => setShapes(data));
  }, [roomId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) redrawAll(ctx, canvas, shapes);
  }, [shapes]);

  useEffect(() => {
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "chat" && msg.message) {
        const shape: DrawProps = JSON.parse(msg.message);
        if (shape?.id) {
          if (shape.type === "mermaid" && shape.code) {
            mermaid.render(`m-${shape.id}`, shape.code).then(({ svg }) => {
              const img = new Image();
              const svgBlob = new Blob([svg], {
                type: "image/svg+xml;charset=utf-8",
              });
              const url = URL.createObjectURL(svgBlob);
              img.onload = () => {
                setShapes((prev) => {
                  if (prev.find((s) => s.id === shape.id)) return prev;
                  return [...prev, { ...shape, img }];
                });
                URL.revokeObjectURL(url);
              };
              img.src = url;
            });
          } else {
            setShapes((prev) => {
              if (prev.find((s) => s.id === shape.id)) return prev;
              return [...prev, shape];
            });
          }
        }
      }
      if (msg.type === "erase" && msg.shapeId) {
        setShapes((prev) => prev.filter((s) => s.id !== msg.shapeId));
      }
    };
  }, [socket]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    if (tool === "rect") cleanup = Rect(canvasRef, setShapes, socket, roomId);
    if (tool === "line") cleanup = Line(canvasRef, setShapes, socket, roomId);
    if (tool === "eraser") cleanup = Eraser(canvasRef, setShapes, socket, roomId);
    if (tool === "text") cleanup = Text(canvasRef, setShapes, socket, roomId);
    if (tool === "circle") cleanup = Circle(canvasRef, setShapes, socket, roomId);
    if (tool === "mermaid") {
      const code = prompt(
        "Enter Mermaid diagram code:",
        "graph TD; A-->B; A-->C; B-->D; C-->D;"
      );
      if (!code) return;
      mermaid.render(`m-${Date.now()}`, code).then(({ svg }) => {
        const img = new Image();
        const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        img.onload = () => {
          const shape = createMermaidShape({
            id: crypto.randomUUID(),
            code,
            x: 100,
            y: 100,
            img,
          });
          setShapes((prev) => [...prev, shape]);
          socket.send(
            JSON.stringify({
              type: "chat",
              roomId,
              message: JSON.stringify({
                id: shape.id,
                type: "mermaid",
                code: shape.code,
                x: shape.x,
                y: shape.y,
                width: shape.width,
                height: shape.height,
              }),
            })
          );
          URL.revokeObjectURL(url);
        };
        img.src = url;
      });
    }
    return () => {
      if (cleanup) cleanup();
    };
  }, [tool, socket, roomId]);

  return (
    <>
      <canvas ref={canvasRef} className="block h-screen w-screen bg-black" />
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex gap-4 mt-5 z-10">
        <button onClick={() => setTool("rect")} className="bg-blue-500 hover:bg-amber-400 text-black px-5 py-2 rounded">Rectangle</button>
        <button onClick={() => setTool("circle")} className="bg-blue-500 hover:bg-amber-400 text-black px-5 py-2 rounded">Circle</button>
        <button onClick={() => setTool("line")} className="bg-blue-500 hover:bg-amber-400 text-black px-5 py-2 rounded">Line</button>
        <button onClick={() => setTool("eraser")} className="bg-blue-500 hover:bg-amber-400 text-black px-5 py-2 rounded">Eraser</button>
        <button onClick={() => setTool("text")} className="bg-blue-500 hover:bg-amber-400 text-black px-5 py-2 rounded">Text</button>
        <button onClick={() => setTool("mermaid")} className="bg-blue-500 hover:bg-amber-400 text-black px-5 py-2 rounded">Create Diagram</button>
      </div>
    </>
  );
}
