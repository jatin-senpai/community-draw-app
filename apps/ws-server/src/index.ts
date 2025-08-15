import { WebSocketServer } from "ws";
import WebSocket from "ws";
import { JWT_Secret } from "@repo/backend-common/jwtconfig"; // Adjust the import path as necessary
import jwt, { JwtPayload } from "jsonwebtoken";
import {prismaClient} from "@repo/db/client"; // Adjust the import path as necessary

interface User {
    userId: string;
    rooms: string[];
    ws: WebSocket;
}
const wss = new WebSocketServer({ port: 8080 });
const users:User[]=[]


function checkUser(token: string): string | null{
    try{
        const decoded  = jwt.verify(token,JWT_Secret)

        if(typeof decoded == "string"){
            return null;
        }

        if(!decoded || !(decoded as JwtPayload).userId){
            return null;
            
        }
        return decoded.userId ;
    }
    catch(e){
        console.error("Token verification failed:", e);
        return null;
    }
     
} 
wss.on("connection", (ws, request) => {
    const url = request.url; //ws:localhost:8080?token=12345
    if (!url) {
        return ws.close(1008, "Invalid URL");
    }

    const queryParams = new URLSearchParams(url.split("?")[1]); // create array of ["ws:localhost:8080", "token=12345"]
    const token = queryParams.get("token") || "";
    const userId = checkUser(token);

    if (userId == null) {
        ws.close(1008, "Invalid token");
        return;
    }

    users.push({
        userId,
        rooms: [],
        ws
    });

    ws.on("message", async (data) => {
        const parseData = JSON.parse(data as unknown as string);

        if (parseData.type === "joinRoom") {
            const user = users.find(x => x.ws === ws);
            user?.rooms.push(parseData.roomId);
        }

        if (parseData.type === "leaveRoom") {
            const user = users.find(x => x.ws === ws);
            if (!user) {
                return;
            }
            user.rooms = user?.rooms.filter(x => x === parseData.roomId);
        }

        if (parseData.type === "chat") {
            const roomId = parseInt(parseData.roomId);
            const message = parseData.message;
            const user = users.find(x => x.ws === ws);
            console.log("Chat request:", { roomId, message, user });

            try {
        await prismaClient.chat.create({
            data: {
                roomId: roomId,
                userId: user?.userId || "", // ensure userId exists in DB
                message: message
            }
        });
    } catch (err) {
        console.error("Error saving chat:", err);
    }

            users.forEach(user => {
                if (user.rooms.includes(roomId.toString())) {
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message: message,
                        roomId
                    }));
                }
            });
        }
    });
});


        
    
    
