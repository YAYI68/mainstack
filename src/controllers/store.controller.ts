import { editStoreSchema } from './../validators/store.validators';
import { Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";
import { addStoreSchema } from "../validators/store.validators";
import { StoreModel } from "../models/store.model";
import CustomError from "../utils/error/CustomError";

export const addStore = tryCatch(async (req: Request, res: Response) => {
  const data = addStoreSchema.parse(req.body);
  const { name,location,phoneNumber } = data;

  const store = await StoreModel.create({
    name,
    location,
    phoneNumber
  });

  return res.status(201).json({
    status: "success",
    message: "Store is added successfully",
    data: store,
  });
});

export const allStores = tryCatch(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const jobs = await StoreModel.find({})
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();
  if (!jobs) {
    throw new CustomError("Sorry, Stores not found", 404);
  }
  return res.status(200).json({ status: "success", data: jobs });
});

export const singleStore = tryCatch(async (req: Request, res: Response) => {
  const id = req.params.id;

  const store = await StoreModel.findOne({ _id: id }).exec();
  if (!store) {
    throw new CustomError("Sorry, Store not found", 404);
  }
  return res.status(200).json({ status: "success", data: store });
});


export const editStore = tryCatch(async (req: Request, res: Response)=>{
  const id = req.params.id
  const data = editStoreSchema.parse(req.body)

  const store = await StoreModel.updateOne({_id:id},{
   ...data
  })

  if(!store){
    throw new CustomError("Sorry, Store not found", 404);
  }
  
  return res.status(201).json({status: "success", message:"Product updated successfully"})

})

export const deleteStore = tryCatch(async (req: Request, res: Response) => {
  const id = req.params.id;
  const store = await StoreModel.deleteOne({ _id: id });
  if (!store) {
    throw new CustomError("Sorry, Store not found", 404);
  }
  return res.status(201).json({
    status: "success",
    message: "Store is deletedd successfully",
  });
});
