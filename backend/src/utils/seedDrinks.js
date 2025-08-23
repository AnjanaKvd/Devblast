import Drink from "../models/Drink.js";

export const seedDrinks = async () => {
  try {
    // Check if we already have drinks in the database
    const drinksCount = await Drink.countDocuments();
    if (drinksCount > 0) {
      console.log(`Found ${drinksCount} drinks in the database. Skipping seeding.`);
      return;
    }

    console.log("🥤 Seeding drinks data...");

    const drinksData = [
      // Soft Drinks
      { name: "Cola", price: 100, type: "softdrink", stock: 50 },
      { name: "Sprite", price: 100, type: "softdrink", stock: 50 },
      { name: "Fanta Orange", price: 100, type: "softdrink", stock: 50 },
      { name: "Ginger Ale", price: 110, type: "softdrink", stock: 30 },
      { name: "Iced Tea", price: 120, type: "softdrink", stock: 40 },
      
      // Milkshakes
      { name: "Chocolate Shake", price: 200, type: "milkshake", stock: 20 },
      { name: "Strawberry Shake", price: 200, type: "milkshake", stock: 20 },
      { name: "Vanilla Shake", price: 180, type: "milkshake", stock: 20 },
      { name: "Oreo Shake", price: 220, type: "milkshake", stock: 15 },
      { name: "Caramel Shake", price: 230, type: "milkshake", stock: 15 },
      
      // Ice Creams
      { name: "Chocolate Ice Cream", price: 150, type: "icecream", stock: 25 },
      { name: "Vanilla Ice Cream", price: 150, type: "icecream", stock: 25 },
      { name: "Strawberry Ice Cream", price: 150, type: "icecream", stock: 25 },
      { name: "Butterscotch Ice Cream", price: 170, type: "icecream", stock: 20 },
      { name: "Mint Chocolate Chip", price: 180, type: "icecream", stock: 15 }
    ];

    await Drink.insertMany(drinksData);
    console.log(`✅ Successfully seeded ${drinksData.length} drinks`);
  } catch (error) {
    console.error("❌ Error seeding drinks:", error);
  }
};
