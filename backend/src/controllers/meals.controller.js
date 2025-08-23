import RiceAndCurry from "../models/RiceAndCurry.js";


export const addRiceAndCurry = async (req, res) => {
  try {
    const { curry1, curry2, rice } = req.body;
    
    // Validate that all required objects are present
    // if (!saved) {
    //   saved = false;
    // }
    const saved = false;
    if (!curry1 || !curry2 || !rice) {
      return res.status(400).json({ 
        message: "Missing required data. Please provide curry1, curry2, and rice objects." 
      });
    }

    // Convert portion and price to numbers for each item
    const processedData = {
      curry1: {
        ...curry1,
        portion: Number(curry1.portion),
        price: Number(curry1.price)
      },
      curry2: {
        ...curry2,
        portion: Number(curry2.portion),
        price: Number(curry2.price)
      },
      rice: {
        ...rice,
        portion: Number(rice.portion),
        price: Number(rice.price)
      },
      saved: saved
    };

    const riceAndCurry = await RiceAndCurry.create(processedData);
    res.status(201).json(riceAndCurry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRiceAndCurry = async (req, res) => {
  try {
    const riceAndCurry = await RiceAndCurry.find();
    if (!riceAndCurry) return res.status(404).json({ message: "Rice and curry not found" });

    res.json(riceAndCurry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};