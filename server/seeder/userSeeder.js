import mongoose from "mongoose";
import User from "../models/User.js";
import TailorProfile from "../models/TailorProfile.js";

// const seedUserData = async () => {
//   try {
//     await mongoose.connect(
//       "mongodb+srv://zainulabidin:zain123@cluster1.mlcu8.mongodb.net/SmartStitch",
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       }
//     );

//     const userId = "674bebcf0a52d67972371c15";

//     const user = await User.findById(userId);
//     if (!user) {
//       console.log("User not found.");
//       return;
//     }

//     user.contactInfo.address = {
//       line1: "123 Main St",
//       line2: "Apt 4B",
//       city: "New York",
//       state: "NY",
//       postalCode: "10001",
//       country: "USA",
//     };

//     user.measurements = [
//       {
//         title: "Initial Measurements",
//         data: {
//           height: 180,
//           chest: 100,
//           waist: 80,
//           hips: 90,
//           shoulder: 50,
//           wrist: 18,
//           sleeves: 60,
//           neck: 40,
//           lowerBody: {
//             length: 100,
//             waist: 80,
//             inseam: 75,
//             thigh: 55,
//             ankle: 20,
//           },
//         },
//       },
//     ];

//     await user.save();
//     console.log("User data seeded successfully.");
//   } catch (error) {
//     console.error("Error seeding user data:", error);
//   } finally {
//     mongoose.connection.close();
//   }
// };

const seedTailorData = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://zainulabidin:zain123@cluster1.mlcu8.mongodb.net/SmartStitch",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    const tailorData = [
      {
        tailorId: new mongoose.Types.ObjectId(),
        shopName: "Classic Tailor",
        phoneNumber: "1234567890",
        portfolio: [],
        serviceRates: [
          {
            type: "Men's Suits",
            description: "Custom tailored men's suits.",
            minPrice: 5000,
            maxPrice: 10000,
            image:
              "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
          },
        ],
        extraServices: [],
        shopLocation: {
          address: "123 Main St, New York, NY",
          coordinates: [40.7128, -74.006],
        },
        shopImages: [
          "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
        ],
        bio: "Expert tailor specializing in men's formal wear.",
        isVerified: true,
        rating: 4.5,
        experience: 5,
      },
      {
        tailorId: new mongoose.Types.ObjectId(),
        shopName: "Modern Tailor",
        phoneNumber: "0987654321",
        portfolio: [],
        serviceRates: [
          {
            type: "Women's Dresses",
            description: "Custom bridal and evening gowns.",
            minPrice: 8000,
            maxPrice: 15000,
            image:
              "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
          },
        ],
        extraServices: [],
        shopLocation: {
          address: "456 Elm St, Los Angeles, CA",
          coordinates: [34.0522, -118.2437],
        },
        shopImages: [
          "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
        ],
        bio: "Modern designs for the modern woman.",
        isVerified: true,
        rating: 4.2,
        experience: 3,
      },
      {
        tailorId: new mongoose.Types.ObjectId(),
        shopName: "Luxury Tailors",
        phoneNumber: "1122334455",
        portfolio: [],
        serviceRates: [
          {
            type: "Designer Wear",
            description: "Exclusive bespoke designer wear.",
            minPrice: 15000,
            maxPrice: 25000,
            image:
              "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
          },
        ],
        extraServices: [],
        shopLocation: {
          address: "789 Oak St, Chicago, IL",
          coordinates: [41.8781, -87.6298],
        },
        shopImages: [
          "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
        ],
        bio: "Luxury tailoring for discerning clients.",
        isVerified: true,
        rating: 4.8,
        experience: 10,
      },
      {
        tailorId: new mongoose.Types.ObjectId(),
        shopName: "Urban Tailors",
        phoneNumber: "6677889900",
        portfolio: [],
        serviceRates: [
          {
            type: "Casual Wear",
            description: "Trendy and comfortable casual wear.",
            minPrice: 3000,
            maxPrice: 7000,
            image:
              "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
          },
        ],
        extraServices: [],
        shopLocation: {
          address: "321 Pine St, Seattle, WA",
          coordinates: [47.6062, -122.3321],
        },
        shopImages: [
          "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
        ],
        bio: "Urban styles for modern living.",
        isVerified: true,
        rating: 4.3,
        experience: 4,
      },
      {
        tailorId: new mongoose.Types.ObjectId(),
        shopName: "Heritage Tailors",
        phoneNumber: "4455667788",
        portfolio: [],
        serviceRates: [
          {
            type: "Traditional Wear",
            description: "Authentic traditional attire.",
            minPrice: 6000,
            maxPrice: 12000,
            image:
              "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
          },
        ],
        extraServices: [],
        shopLocation: {
          address: "654 Maple St, Austin, TX",
          coordinates: [30.2672, -97.7431],
        },
        shopImages: [
          "https://res.cloudinary.com/dlhwfesiz/image/upload/v1679703977/suit4_m8icv4.jpg",
        ],
        bio: "Preserving heritage through tailoring.",
        isVerified: true,
        rating: 4.6,
        experience: 7,
      },
    ];

    await TailorProfile.insertMany(tailorData);
    console.log("Tailor data seeded successfully.");
  } catch (error) {
    console.error("Error seeding tailor data:", error);
  } finally {
    mongoose.connection.close();
  }
};

// seedUserData();
seedTailorData();