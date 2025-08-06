import express from "express";
import jwt from "jsonwebtoken";
import { UserSchema,SignInSchema,RoomSchema } from "@repo/backend-common/types";
import {prismaClient} from "@repo/db/client";
import { JWT_Secret } from "@repo/backend-common/jwtconfig";
import { middleware } from "./middleware";

const app = express()
app.use(express.json())

app.post("/signup",async (req,res)=>{
    const parseData = UserSchema.safeParse(req.body);
    console.log(parseData)
    if (!parseData.success) {
        return res.status(400).json({ error: "invalid inputs" });
    }
    try{
        const user = await prismaClient.user.create({
            data : {
                email: parseData.data.username,
                password:parseData.data.password,
                name:parseData.data.name
            }
        
        })
        res.json({
            userId: user.id
        })
    }
    catch(e){
        console.error(e); // Optional: log actual error
        return res.status(500).json({ error: "Internal server error" });
        message:"User already exists"
    }

})
app.post("/signin",async(req,res)=>{
  const parseData = SignInSchema.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({ error: "invalid inputs" });
    }

    const user = await prismaClient.user.findFirst({
            where : {
                email:parseData.data.username,
                password:parseData.data.password
            }
        
    })
    if(user){
        const token = jwt.sign({
            userId: user.id
        }, JWT_Secret);

        res.json({
            token: token
        });
    }
    else{
        return res.status(401).json({ error: "Invalid credentials" });
    }
    

    
    
})
app.post("/create-room",middleware,async(req,res)=>{
    const data = RoomSchema.safeParse(req.body);
    if (!data.success) {
        return res.status(400).json({ error: "invalid inputs" });
    }
    //@ts-ignore
    const userId = req.userId;
    try{
        const room = await prismaClient.room.create({
            data:{
                slug: data.data.name,
                adminId: userId
            }
        })
        res.json({
            roomId: room.id,
        })
    }
    catch(e){
        console.error(e);
        return res.status(500).json({ error: "Internal server error" });
    }
    

})
app.get("/chats/:roomId",middleware,async(req,res)=>{
    const roomId = Number(req.params.roomId);
    if (isNaN(roomId)) {
        return res.status(400).json({ error: "Invalid roomId" });
    }
    //@ts-ignore
    const messages = await prismaClient.chat.findMany({
        where: {
            roomId: roomId
        },
        take: 50,
        orderBy: {
            id: "desc"
        }
    });
    res.json({ messages });
})


app.listen(3003, () => {
  console.log("Server is running on port 3003")
});
