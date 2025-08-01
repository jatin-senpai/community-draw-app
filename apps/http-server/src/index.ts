import express from "express";
import jwt from "jsonwebtoken";
import { UserSchema,SignInSchema,RoomSchema } from "@repo/backend-common/types";
import { JWT_Secret } from "@repo/backend-common/jwtconfig";
import { middleware } from "./middleware";
const app = express()
app.use(express.json())

app.post("/signup",(req,res)=>{
    const data = UserSchema.safeParse(req.body);
    if (!data.success) {
        return res.status(400).json({ error: "invalid inputs" });
    }

    // Handle signup logic here


})
app.post("/signin",(req,res)=>{
  const data = SignInSchema.safeParse(req.body);
    if (!data.success) {
        return res.status(400).json({ error: "invalid inputs" });
    }
    
})
app.post("/create-room",middleware,(req,res)=>{
    const data = RoomSchema.safeParse(req.body);
    if (!data.success) {
        return res.status(400).json({ error: "invalid inputs" });
    }
})
app.listen(3003, () => {
  console.log("Server is running on port 3003")
});
