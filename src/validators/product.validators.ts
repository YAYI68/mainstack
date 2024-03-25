import { z } from "zod";

export const addProductSchema = z.object({
  name: z.string({ required_error: "Product name is required" }),
  description: z.string().optional(),
  storeId:z.string({required_error:'StoreId is required'}),
  quantity: z.coerce.number({required_error:"The quantity is required"}),
  price: z.coerce.number({required_error:"The price is required"}),
});


export const editProductSchema = z.object({
  name: z.string({ required_error: "Candidate name is required" }).optional(),
  description: z.string().optional(),
  storeId:z.string({required_error:'StoreId is required'}).optional(),
  quantity: z.coerce.number({required_error:"The quantity is required"}).optional(),
  price: z.coerce.number({required_error:"The price is required"}).optional(),
});

