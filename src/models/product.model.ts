import mongoose, { Document, Schema } from "mongoose";
import { StoreType } from "./store.model";

export interface Product extends Document {
  name: string;
  price: number;
  quantity: number;
  store: StoreType;
  image: string;
}

const productSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      unique: true,
    },
    quantity : {
      type: Number,
      required: true,
      unique: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      require: true,
    },
  },
  { timestamps: true },
);

export const ProductModel = mongoose.model<Product>(
  "Product",
  productSchema,
);
