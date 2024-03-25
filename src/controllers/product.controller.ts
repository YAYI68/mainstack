import { tryCatch } from "../utils/tryCatch";
import { Request, Response } from "express";

import CustomError from "../utils/error/CustomError";
import { addProductSchema, editProductSchema } from "../validators/product.validators";
import { StoreModel } from "../models/store.model";
import { ProductModel } from "../models/product.model";

export const addProduct = tryCatch(async (req: Request, res: Response) => {
  const data = addProductSchema.parse(req.body);
  const { name, description,price,quantity , storeId } = data;

  const store = await StoreModel.findOne({ _id: storeId });
  if(!store){
    throw new CustomError(
      "Sorry, You need to add a store before creating a product",
      400,
    );
  }
  const product = await ProductModel.create({
    store,
    name,
    description,
    price,
    quantity,
  });
  if (!product) {
    throw new CustomError(
      "Sorry, Error occur why creating the product",
      400,
    );
  }
  return res.status(201).json({
    status: "success",
    message: "Product registered successfully",
    data: product,
  });
});

export const allProduct = tryCatch(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const products = await ProductModel.find({})
    .populate({ path: "store"})
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();
  return res.status(200).json({ status: "success", data: products });
});

export const singleProduct = tryCatch(async (req: Request, res: Response) => {
  const id = req.params.id;
  const product = await ProductModel.findOne({ _id: id }).populate("store");
  if (!product) {
    throw new CustomError("product not found", 400);
  }
  return res.status(200).json({ status: "success", data: product });
});


export const editProduct = tryCatch(async (req: Request, res: Response)=>{
  const id = req.params.id;
  const data = editProductSchema.parse(req.body);
  const { name, description,price,quantity , storeId } = data;

  const store = await StoreModel.findOne({ _id: storeId });
  if(!store){
    throw new CustomError(
      "Sorry, You need to add a store before creating a product",
      400,
    );
  }
  const product = await ProductModel.updateOne({_id:id},{
    store,
    name,
    description,
    price,
    quantity,
  });
  if (!product) {
    throw new CustomError(
      "Sorry, Error occur why creating the product",
      400,
    );
  }
  return res.status(201).json({
    status: "success",
    message: "Product updated successfully",
  });

})

export const deleteProduct = tryCatch(async (req: Request, res: Response) => {
  const id = req.params.id;

  const product = await ProductModel.findOneAndDelete({ _id: id });
  if (!product) {
    throw new CustomError("Product not found", 400);
  }
  return res.status(201).json({
    status: "success",
    message: `Product deleted successfully`,
  });
});
