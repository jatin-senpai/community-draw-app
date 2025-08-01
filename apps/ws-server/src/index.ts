import { WebSocketServer } from "ws";
import WebSocket from "ws";
import { JWT_Secret } from "@repo/backend-common/jwtconfig"; // Adjust the import path as necessary
import jwt, { JwtPayload } from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection",(ws,request)=>{
    const url = request.url; //ws:localhost:8080?token=12345
    if(!url){
        return ws.close(1008, "Invalid URL");
    }
    const queryParams = new URLSearchParams(url.split("?")[1]);//create array of ["ws:localhost:8080", "token=12345"]
    const token = queryParams.get("token")|| "";
    const decoded  = jwt.verify(token,JWT_Secret)

    if(!decoded || !(decoded as JwtPayload).userId){
        ws.close();
        return 
    }
    
    ws.on("message",(message)=>{
        console.log(`Received message: ${message}`);
        ws.send("pong");
    });
    ws.on("close",()=>{
        console.log("Client disconnected");
    });
})