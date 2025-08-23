import mongoose from "mongoose";

const riceCurrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantityForOne: { type: Number, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true },
  image: { type: String, default: "" },
  stock: { type: Number, default: 0 }
}, {
  timestamps: true
});

const RiceCurry = mongoose.model("RiceCurry", riceCurrySchema);

export default RiceCurry;