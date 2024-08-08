import { z } from "zod";

export const messageSchema = z.object({
    content:z.string()
    .min(10,{message:"Content must be at least of 10 characters"})
    .max(80,{message:"Content must be no longer than 50 characters"})
})
