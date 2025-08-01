import express from "express";
import jwt from "jsonwebtoken";
import { UserSchema,SignInSchema,RoomSchema } from "@repo/backend-common/types";
import { JWT_Secret } from "@repo/backend-common/jwtconfig";
import { middleware } from "./middleware";
const app = express()
app.use(express.json())

app.post("/signup",(req,res)=>{
    const { userId, password } = req.body;
    // Handle signup logic here


})
app.post("/signin",(req,res)=>{
    
})
app.post("/create-room",middleware,(req,res)=>{
    
})
app.listen(3003, () => {
  console.log("Server is running on port 3003")
});
