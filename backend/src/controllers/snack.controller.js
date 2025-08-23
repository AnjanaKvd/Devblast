import Snack from "../models/Snack";

export const getSnacks = async (req, res) => {
  try {
    const Snacks = await Snack.find();
    res.json(Snacks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Snacks" });
  }
};

export const addSnack = async (req, res) => {
  const { name, price, type, image, stock } = req.body;
  const newSnack = new Snack({ name, price, type, image, stock });
  try {
    await newSnack.save();
    res.status(201).json(newSnack);
  } catch (error) {
    res.status(500).json({ message: "Error adding Snack" });
  }
};

export const updateSnack = async (req, res) => {
  const { id, name, price, type, image, stock } = req.body;
  try {
    const updatedSnack = await Snack.findByIdAndUpdate(
      id,
      { name, price, type, image, stock },
      { new: true }
    );
    res.json(updatedSnack);
  } catch (error) {
    res.status(500).json({ message: "Error updating Snack" });
  }
};

export const deleteSnack = async (req, res) => {
  const { id } = req.body;
  try {
    await Snack.findByIdAndDelete(id);
    res.json({ message: "Snack deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Snack" });
  }
};
