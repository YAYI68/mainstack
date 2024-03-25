import { z } from "zod";


export const addStoreSchema = z.object({
  name: z.string({required_error:"name is required"}),
  location: z.string({required_error:"location is required"}),
  phoneNumber: z.string().optional(),
});

export const editStoreSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  phoneNumber: z.string().optional(),
});

