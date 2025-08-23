import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String},
  portion: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const riceAndCurrySchema = new mongoose.Schema(
  {
    curry1: { type: itemSchema, required: true },
    curry2: { type: itemSchema, required: true },
    rice: { type: itemSchema, required: true },
    saved: { type: Boolean, required: true, default: false }
  },
  { timestamps: true }
);


export default mongoose.model("RiceAndCurry", riceAndCurrySchema);
