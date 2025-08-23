import mongoose from "mongoose";

const drinkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true },
  image: { type: String, default: "" },
  stock: { type: Number, default: 0 }
});

const Drink = mongoose.model("Drink", drinkSchema);

export default Drink;