import Drink from "../models/Drink.js";

export const getDrinks = async (req, res) => {
  try {
    console.log("Fetching all drinks...");
    const drinks = await Drink.find();
    console.log(`Found ${drinks.length} drinks`);
    res.json(drinks);
  } catch (error) {
    console.error("Error fetching drinks:", error);
    res.status(500).json({ 
      message: "Error fetching drinks", 
      error: error.message 
    });
  }
};

export const addDrink = async (req, res) => {
  try {
    const { name, price, type, image, stock } = req.body;
    
    if (!name || !price || !type) {
      return res.status(400).json({ message: "Name, price, and type are required" });
    }
    
    const newDrink = new Drink({
      name,
      price,
      type,
      image: image || "",
      stock: stock || 0
    });
    
    await newDrink.save();
    res.status(201).json(newDrink);
  } catch (error) {
    console.error("Error adding drink:", error);
    res.status(500).json({ message: "Error adding drink", error: error.message });
  }
};

export const updateDrink = async (req, res) => {
  const { id, name, price, type, image, stock } = req.body;
  try {
    const updatedDrink = await Drink.findByIdAndUpdate(
      id,
      { name, price, type, image, stock },
      { new: true }
    );
    res.json(updatedDrink);
  } catch (error) {
    res.status(500).json({ message: "Error updating drink" });
  }
};

export const deleteDrink = async (req, res) => {
  const { id } = req.body;
  try {
    await Drink.findByIdAndDelete(id);
    res.json({ message: "Drink deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting drink" });
  }
};
