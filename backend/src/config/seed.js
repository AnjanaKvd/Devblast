import Drink from "../models/Drink.js";

export const seedDatabase = async () => {
  try {
    // Check if drinks already exist
    const drinkCount = await Drink.countDocuments();
    
    if (drinkCount === 0) {
      console.log("🌱 Seeding drinks data...");
      
      const defaultDrinks = [
        {
          name: "Cola",
          price: 100,
          type: "softdrink",
          image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=150&auto=format&fit=crop&q=60",
          stock: 50
        },
        {
          name: "Sprite",
          price: 100,
          type: "softdrink",
          image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=150&auto=format&fit=crop&q=60",
          stock: 50
        },
        {
          name: "Orange Soda",
          price: 120,
          type: "softdrink",
          image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150&auto=format&fit=crop&q=60",
          stock: 30
        },
        {
          name: "Chocolate Milkshake",
          price: 200,
          type: "milkshake",
          image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=150&auto=format&fit=crop&q=60",
          stock: 25
        },
        {
          name: "Strawberry Milkshake",
          price: 220,
          type: "milkshake",
          image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=150&auto=format&fit=crop&q=60",
          stock: 20
        },
        {
          name: "Vanilla Milkshake",
          price: 180,
          type: "milkshake",
          image: "https://images.unsplash.com/photo-1568901839119-631418a3910d?w=150&auto=format&fit=crop&q=60",
          stock: 25
        },
        {
          name: "Chocolate Ice Cream",
          price: 150,
          type: "icecream",
          image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=150&auto=format&fit=crop&q=60",
          stock: 20
        },
        {
          name: "Vanilla Ice Cream",
          price: 130,
          type: "icecream",
          image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=150&auto=format&fit=crop&q=60",
          stock: 20
        },
        {
          name: "Strawberry Ice Cream",
          price: 150,
          type: "icecream",
          image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=150&auto=format&fit=crop&q=60",
          stock: 15
        }
      ];
      
      await Drink.insertMany(defaultDrinks);
      console.log("✅ Drinks data seeded successfully");
    } else {
      console.log("ℹ️ Drinks data already exists, skipping seed");
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
  }
};
