import mongoose from "mongoose";
import User from "../models/User.js";

const seedUserData = async () => {
  try {
    await mongoose.connect("mongodb+srv://zainulabidin:zain123@cluster1.mlcu8.mongodb.net/SmartStitch", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const userId = "674bebcf0a52d67972371c15";

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found.");
      return;
    }

    user.contactInfo.address = {
      line1: "123 Main St",
      line2: "Apt 4B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
    };

    user.measurements = [
      {
        title: "Initial Measurements",
        data: {
          height: 180,
          chest: 100,
          waist: 80,
          hips: 90,
          shoulder: 50,
          wrist: 18,
          sleeves: 60,
          neck: 40,
          lowerBody: {
            length: 100,
            waist: 80,
            inseam: 75,
            thigh: 55,
            ankle: 20,
          },
        },
      },
    ];

    await user.save();
    console.log("User data seeded successfully.");
  } catch (error) {
    console.error("Error seeding user data:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedUserData();
