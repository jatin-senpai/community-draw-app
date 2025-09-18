"use client";
import {  useEffect, useState } from "react";

import { wsUrl } from "./config";
import { Canvas } from "./canvas";

export function RoomCanvas({ roomId }: { roomId: number }) {
  const [socket,setSocket] =useState<WebSocket | null>(null);
  useEffect(()=>{
    const token = localStorage.getItem("token")
    const ws = new WebSocket(`${wsUrl}?token=${token}`);
    ws.onopen=()=>{
      setSocket(ws)
      ws.send(JSON.stringify({
        type: "joinRoom",
        roomId : roomId
      }))
    }
    return ()=>{ws.close()}

  },[roomId])
  

 
  if(!socket){
    return <div>
      Connecting to server ...
    </div>
  }

  return (
    <>
      <Canvas roomId={roomId} socket={socket}/>
    </>
  );
}
