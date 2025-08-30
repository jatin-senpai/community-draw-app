"use client";
import {  useEffect, useState } from "react";

import { wsUrl } from "./config";
import { Canvas } from "./canvas";

export function RoomCanvas({ roomId }: { roomId: number }) {
  const [socket,setSocket] =useState<WebSocket | null>(null);
  useEffect(()=>{
    const ws = new WebSocket(`${wsUrl}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlMDViNGUxMC0xMDkyLTQwZmYtYjI1MS04NGEzNzJmOWNiZmEiLCJpYXQiOjE3NTYxMTY5MTd9.LhMQNhlP2sDjIOYxOSQ00sU5kJyqscKoWSercr9ImSo`)
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
