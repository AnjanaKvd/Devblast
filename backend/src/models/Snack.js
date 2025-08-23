import mongoose from "mongoose";

const drinkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true }
});

const Drink = mongoose.model("Drink", drinkSchema);

export default Drink;