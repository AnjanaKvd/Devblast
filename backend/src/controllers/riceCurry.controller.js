import Rice from "../models/RiceCurry.js";

export const getRiceCurries = async (req, res) => {
  try {
    const riceCurries = await Rice.find();
    res.json(riceCurries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rice curries" });
  }
};

export const addRiceCurry = async (req, res) => {
  const { name, quantityForOne, price, type, image, stock } = req.body;

  try {
    // Validate required fields
    if (!name || !type || price === undefined) {
      return res.status(400).json({ message: "Name, type, and price are required" });
    }

    const newRiceCurry = new Rice({
      name,
      quantityForOne: quantityForOne || 1,
      price,
      type,
      image: image || "",
      stock: stock || 0
    });
    
    await newRiceCurry.save();
    res.status(201).json(newRiceCurry);
  } catch (error) {
    console.error("Error adding rice curry:", error);
    res.status(500).json({ 
      message: "Error adding rice curry", 
      error: error.message 
    });
  }
};

export const updateRiceCurry = async (req, res) => {
  const { id, ...updates } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: "ID is required for updates" });
    }

    const updatedRiceCurry = await Rice.findByIdAndUpdate(id, updates, { new: true });
    
    if (!updatedRiceCurry) {
      return res.status(404).json({ message: "Rice curry not found" });
    }
    
    res.json(updatedRiceCurry);
  } catch (error) {
    console.error("Error updating rice curry:", error);
    res.status(500).json({ 
      message: "Error updating rice curry",
      error: error.message
    });
  }
};

export const deleteRiceCurry = async (req, res) => {
  const { id } = req.body;

  try {
    await Rice.findByIdAndDelete(id);
    res.json({ message: "Rice curry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting rice curry" });
  }
};
