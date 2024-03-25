import mongoose, { Document } from "mongoose";
import { Schema } from "mongoose";
import { UserType } from "./users.model";

export interface StoreType extends Document {
  owner: UserType;
  name: string;
  location: string;
  phoneNumber: string;
}

const StoreSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  phoneNumber: {
    type : String
  } 
});

export const StoreModel = mongoose.model<StoreType>("Store", StoreSchema);
