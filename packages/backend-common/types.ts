import z from "zod";
export const UserSchema = z.object({
    username: z.string().min(4).max(20),
    password: z.string(),
    name:z.string()
})

export const SignInSchema = z.object({
    username: z.email(),
    password: z.string(),
    name:z.string().min(3).max(20)
})

export const RoomSchema = z.object({
    name: z.string().min(3).max(20)
})