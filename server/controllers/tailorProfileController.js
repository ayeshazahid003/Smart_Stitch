import TailorProfile from "../models/TailorProfile.js";
import Campaign from "../models/Campaign.js";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import {
  uploadMultipleFiles,
  uploadSingleFile,
} from "../helper/cloudinaryUploader.js";
import { sendEmail } from "../helper/mail.js";
import crypto from "crypto";

// Helper function to calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Convert latitude and longitude from degrees to radians
  const radLat1 = (Math.PI * lat1) / 180;
  const radLon1 = (Math.PI * lon1) / 180;
  const radLat2 = (Math.PI * lat2) / 180;
  const radLon2 = (Math.PI * lon2) / 180;

  // Haversine formula
  const dLat = radLat2 - radLat1;
  const dLon = radLon2 - radLon1;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) *
      Math.cos(radLat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Earth radius in kilometers
  const radius = 6371;

  // Distance in kilometers
  return radius * c;
};

export const createTailorProfile = async (req, res) => {
  try {
    const { shopName, shopImages, shopLocation, bio, phoneNumber, experience } =
      req.body;

    const tailorId = req.user._id;

    // 1. Validate required fields
    if (!shopName || shopName.trim() === "") {
      return res
        .status(400)
        .json({ message: "Shop name is required.", success: false });
    }
    if (!shopLocation || (!shopLocation.address && !shopLocation.coordinates)) {
      return res.status(400).json({
        message: "Shop location (address or coordinates) is required.",
        success: false,
      });
    }
    if (!bio || bio.trim() === "") {
      return res
        .status(400)
        .json({ message: "Bio is required.", success: false });
    }

    // 2. Convert shopLocation.coordinates to array [latitude, longitude]

    console.log("shop locations", shopLocation);
    if (shopLocation?.coordinates) {
      const { lat, lng } = shopLocation.coordinates;
      shopLocation.coordinates = { lat: Number(lat), lng: Number(lng) };
    }

    // 3. Check if tailor profile already exists
    let tailorProfile = await TailorProfile.findOne({ tailorId });

    // 4. Always discard existing images and upload new ones if provided.
    let shopImageUrls = [];
    if (Array.isArray(shopImages) && shopImages.length > 0) {
      const uploadedImages = await uploadMultipleFiles(shopImages, "Home");
      shopImageUrls = uploadedImages;
    }

    console.log(shopImageUrls);
    if (tailorProfile) {
      // 5. Update existing profile with new images (discard old ones)
      tailorProfile.shopName = shopName;
      tailorProfile.phoneNumber = phoneNumber;
      tailorProfile.shopImages = shopImageUrls;
      tailorProfile.shopLocation = shopLocation;
      tailorProfile.bio = bio;
      (tailorProfile.experience = experience),
        (tailorProfile.updatedAt = Date.now());

      await tailorProfile.save();

      return res.status(200).json({
        message: "Tailor profile updated successfully.",
        tailorProfile,
        success: true,
      });
    } else {
      // 6. Create new profile
      const verificationToken = crypto.randomBytes(32).toString("hex");

      tailorProfile = new TailorProfile({
        tailorId,
        shopName,
        phoneNumber,
        shopImages: shopImageUrls,
        shopLocation,
        bio,
        isVerified: true, // Adjust verification status as needed
        verificationToken,
        experience,
      });

      const savedProfile = await tailorProfile.save();

      // 7. Construct verification link and (optionally) send email
      const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}&tailorId=${tailorId}`;
      const subject = "Verify Your Tailor Profile";
      const emailBody = `
        <h1>Welcome to Our Platform!</h1>
        <p>Hi there,</p>
        <p>Thank you for creating your tailor profile. To complete your registration, please verify your email by clicking the link below:</p>
        <a href="${verificationLink}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Your Email</a>
        <p>If the button above doesn't work, you can also click the link below:</p>
        <p>${verificationLink}</p>
        <p>Best regards,</p>
        <p>The Team</p>
      `;

      // Example: await sendEmail("info@cogentro.com", req.user.email, subject, emailBody);

      return res.status(201).json({
        message:
          "Tailor profile created successfully. Please check your email for verification.",
        tailorProfile: savedProfile,
        success: true,
      });
    }
  } catch (error) {
    console.error("Error creating or updating tailor profile:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error,
      success: false,
    });
  }
};

export const getTailorShopDetails = async (req, res) => {
  try {
    const tailorId = req.user._id; // Get tailor ID from authenticated user

    // Find the tailor profile by tailorId, only select required fields
    const tailorProfile = await TailorProfile.findOne({ tailorId }).lean(); // Convert Mongoose document to a plain object

    // If no profile is found
    if (!tailorProfile) {
      return res.status(404).json({
        message: "Tailor shop profile not found.",
        success: false,
      });
    }

    // Return the tailor shop details
    return res.status(200).json({
      message: "Tailor shop details retrieved successfully.",
      shopDetails: tailorProfile,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching tailor shop details:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error,
      success: false,
    });
  }
};

export const verifyTailor = async (req, res) => {
  const { token, tailorId } = req.query;

  try {
    const tailorProfile = await TailorProfile.findOne({
      tailorId,
      verificationToken: token,
    });

    if (!tailorProfile) {
      return res
        .status(400)
        .json({ message: "Invalid or expired token.", success: false });
    }

    // Mark profile as verified
    tailorProfile.isVerified = true;
    tailorProfile.verificationToken = undefined; // Clear the token
    await tailorProfile.save();

    res
      .status(200)
      .json({ message: "Email verified successfully.", success: true });
  } catch (error) {
    console.error("Error verifying email:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error, success: false });
  }
};

export const addPortfolioEntry = async (req, res) => {
  try {
    const { name, images, description, date } = req.body;
    const tailorId = req.user._id;
    const tailorProfile = await TailorProfile.findOne({ tailorId });

    if (!tailorProfile) {
      return res
        .status(404)
        .json({ message: "Tailor profile not found.", success: false });
    }

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ message: "Portfolio name is required.", success: false });
    }
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res
        .status(400)
        .json({ message: "Portfolio images are required.", success: false });
    }
    if (!date) {
      return res
        .status(400)
        .json({ message: "Portfolio date is required.", success: false });
    }

    const uploadedImages = await uploadMultipleFiles(images, "Home");

    const portfolioImages = uploadedImages;

    const portfolioEntry = {
      name,
      images: portfolioImages,
      description,
      date,
    };
    tailorProfile.portfolio.push(portfolioEntry);

    await tailorProfile.save();

    res.status(200).json({
      message: "Portfolio entry added successfully.",
      portfolio: portfolioEntry,
      success: true,
    });
  } catch (error) {
    console.error("Error adding portfolio entry:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error, success: false });
  }
};

export const addServiceToTailor = async (req, res) => {
  try {
    const { type, description, minPrice, maxPrice, image } = req.body;
    console.log(req.body);
    const tailorId = req.user._id;

    // 1. Fetch tailor profile
    const tailorProfile = await TailorProfile.findOne({ tailorId });
    if (!tailorProfile) {
      return res.status(404).json({
        message: "Tailor profile not found.",
        success: false,
      });
    }

    // 2. Validate input fields
    if (!type || type.trim() === "") {
      return res.status(400).json({
        message: "Service type is required.",
        success: false,
      });
    }
    if (!description || description.trim() === "") {
      return res.status(400).json({
        message: "Service description is required.",
        success: false,
      });
    }

    // Validate minPrice and maxPrice
    //convert prices in number
    const newMinPrice = Number(minPrice);
    const newMaxPrice = Number(maxPrice);

    if (!newMinPrice || !newMaxPrice) {
      return res.status(400).json({
        message: "Service price is required.",
        success: false,
      });
    }

    if (!image) {
      return res.status(400).json({
        message: "Service image is required.",
        success: false,
      });
    }

    // 3. Upload image to Cloudinary
    const uploadedImage = await uploadSingleFile(image, "Home");

    // 4. Create service object
    const service = {
      type,
      description,
      minPrice: newMinPrice,
      maxPrice: newMaxPrice,
      image: uploadedImage.secure_url,
    };

    // 5. Push service into tailor profile and save
    tailorProfile.serviceRates.push(service);
    await tailorProfile.save();

    return res.status(200).json({
      message: "Service added successfully.",
      service,
      success: true,
    });
  } catch (error) {
    console.error("Error adding service:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error,
      success: false,
    });
  }
};

export const removeServiceFromTailor = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const tailorId = req.user._id;

    // Find the tailor profile
    const tailorProfile = await TailorProfile.findOne({ tailorId });
    if (!tailorProfile) {
      return res.status(404).json({
        success: false,
        message: "Tailor profile not found.",
      });
    }

    const serviceIndex = tailorProfile.serviceRates.findIndex(
      (service) => service._id.toString() === serviceId
    );
    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    tailorProfile.serviceRates.splice(serviceIndex, 1);

    // Save the updated profile
    await tailorProfile.save();

    res.status(200).json({
      success: true,
      message: "Service removed successfully.",
    });
  } catch (error) {
    console.error("Error removing service:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const removePortfolioFromTailor = async (req, res) => {
  try {
    const { portfolioId } = req.params; // Portfolio ID passed as a route parameter
    const tailorId = req.user._id; // Get the tailorId from the authenticated user

    // Find the tailor profile
    const tailorProfile = await TailorProfile.findOne({ tailorId });
    if (!tailorProfile) {
      return res.status(404).json({
        success: false,
        message: "Tailor profile not found.",
      });
    }

    // Find and remove the portfolio entry
    const portfolioIndex = tailorProfile.portfolio.findIndex(
      (portfolio) => portfolio._id.toString() === portfolioId
    );
    if (portfolioIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Portfolio entry not found.",
      });
    }

    tailorProfile.portfolio.splice(portfolioIndex, 1);

    // Save the updated profile
    await tailorProfile.save();

    res.status(200).json({
      success: true,
      message: "Portfolio entry removed successfully.",
    });
  } catch (error) {
    console.error("Error removing portfolio entry:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const updatePortfolio = async (req, res) => {
  try {
    const { portfolioId } = req.params; // Portfolio ID passed as a route parameter
    const { name, description, date, image } = req.body;
    const tailorId = req.user._id; // Get the tailorId from the authenticated user

    // Find the tailor profile
    const tailorProfile = await TailorProfile.findOne({ tailorId });

    if (!tailorProfile) {
      return res.status(404).json({
        success: false,
        message: "Tailor profile not found.",
      });
    }

    // Find the portfolio entry and update it
    const portfolioEntry = tailorProfile.portfolio.find(
      (portfolio) => portfolio._id.toString() === portfolioId
    );
    if (!portfolioEntry) {
      return res.status(404).json({
        success: false,
        message: "Portfolio entry not found.",
      });
    }

    if (name) portfolioEntry.name = name;
    if (description) portfolioEntry.description = description;
    if (date) portfolioEntry.date = date;
    if (image) {
      try {
        const uploadedImage = await uploadSingleFile(image, "Home");
        portfolioEntry.image = uploadedImage.secure_url;
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload image to Cloudinary.",
          error: uploadError.message,
        });
      }
    }

    // Save the updated profile
    await tailorProfile.save();

    res.status(200).json({
      success: true,
      message: "Portfolio entry updated successfully.",
      portfolioEntry,
    });
  } catch (error) {
    console.error("Error removing portfolio entry:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params; // Service ID passed as a route parameter
    const { type, description, image, maxPrice, minPrice } = req.body;
    const tailorId = req.user._id; // Get the tailorId from the authenticated user

    // Find the tailor profile
    const tailorProfile = await TailorProfile.findOne({ tailorId });
    if (!tailorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Tailor profile not found." });
    }

    // Find the service and update it
    const service = tailorProfile.serviceRates.find(
      (service) => service._id.toString() === serviceId
    );
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found." });
    }

    if (type) service.type = type;
    if (description) service.description = description;
    if (minPrice) service.minPrice = minPrice;
    if (maxPrice) service.maxPrice = maxPrice;

    // If an image is provided, upload it to Cloudinary
    if (image) {
      try {
        const uploadedImage = await uploadSingleFile(image, "Home");
        service.image = uploadedImage.secure_url;
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload image to Cloudinary.",
          error: uploadError.message,
        });
      }
    }

    // Save the updated profile
    await tailorProfile.save();

    res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      service,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const addExtraService = async (req, res) => {
  try {
    const { serviceName, description, minPrice, maxPrice } = req.body;
    const tailorId = req.user._id; // Get the tailorId from the authenticated user

    if (!serviceName || !description || !minPrice || !maxPrice) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const newMinPrice = Number(minPrice);
    const newMaxPrice = Number(maxPrice);

    // Find the tailor profile
    const tailorProfile = await TailorProfile.findOne({ tailorId });
    if (!tailorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Tailor profile not found." });
    }

    const extraService = {
      serviceName,
      description,
      minPrice: newMinPrice,
      maxPrice: newMaxPrice,
    };
    tailorProfile.extraServices.push(extraService);

    await tailorProfile.save();

    res.status(201).json({
      success: true,
      message: "Extra service added successfully.",
      extraService,
    });
  } catch (error) {
    console.error("Error adding extra service:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const updateExtraService = async (req, res) => {
  try {
    const { extraServiceId } = req.params; // Extra service ID passed as a route parameter
    const { serviceName, description, minPrice, maxPrice } = req.body;
    const tailorId = req.user._id; // Get the tailorId from the authenticated user

    // Find the tailor profile
    const tailorProfile = await TailorProfile.findOne({ tailorId });
    if (!tailorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Tailor profile not found." });
    }

    // Find the extra service and update it
    const extraService = tailorProfile.extraServices.find(
      (service) => service._id.toString() === extraServiceId
    );
    if (!extraService) {
      return res
        .status(404)
        .json({ success: false, message: "Extra service not found." });
    }

    if (serviceName) extraService.serviceName = serviceName;
    if (description) extraService.description = description;
    if (minPrice) extraService.minPrice = minPrice;
    if (maxPrice) extraService.maxPrice = maxPrice;
    await tailorProfile.save();

    res.status(200).json({
      success: true,
      message: "Extra service updated successfully.",
      extraService,
    });
  } catch (error) {
    console.error("Error updating extra service:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const deleteExtraService = async (req, res) => {
  try {
    const { extraServiceId } = req.params; // Extra service ID passed as a route parameter
    const tailorId = req.user._id; // Get the tailorId from the authenticated user

    // Find the tailor profile
    const tailorProfile = await TailorProfile.findOne({ tailorId });
    if (!tailorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Tailor profile not found." });
    }

    // Find and remove the extra service
    const extraServiceIndex = tailorProfile.extraServices.findIndex(
      (service) => service._id.toString() === extraServiceId
    );
    if (extraServiceIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Extra service not found." });
    }

    tailorProfile.extraServices.splice(extraServiceIndex, 1);

    await tailorProfile.save();

    res
      .status(200)
      .json({ success: true, message: "Extra service deleted successfully." });
  } catch (error) {
    console.error("Error deleting extra service:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getAllTailorServices = async (req, res) => {
  try {
    const { tailorId } = req.params;

    const tailorProfile = await TailorProfile.findOne(
      { tailorId },
      "serviceRates extraServices"
    );

    if (!tailorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Tailor profile not found." });
    }

    res.status(200).json({
      success: true,
      services: tailorProfile.serviceRates || [],
      extraServices: tailorProfile.extraServices || [],
    });
  } catch (error) {
    console.error("Error fetching tailor services:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getListOfServices = async (req, res) => {
  try {
    const tailorId = req.params.tailorId;

    // Find the tailor profile
    const tailorProfile = await TailorProfile.findOne(
      { tailorId },
      "serviceRates"
    );
    if (!tailorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Tailor profile not found." });
    }

    res
      .status(200)
      .json({ success: true, services: tailorProfile.serviceRates });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getListOfExtraServices = async (req, res) => {
  try {
    const tailorId = req.params.tailorId;

    // Find the tailor profile
    const tailorProfile = await TailorProfile.findOne(
      { tailorId },
      "extraServices"
    );
    if (!tailorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Tailor profile not found." });
    }

    res
      .status(200)
      .json({ success: true, extraServices: tailorProfile.extraServices });
  } catch (error) {
    console.error("Error fetching extra services:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getListOfPortfolio = async (req, res) => {
  try {
    const tailorId = req.params.tailorId;

    // Find the tailor profile
    const tailorProfile = await TailorProfile.findOne(
      { tailorId },
      "portfolio"
    );
    if (!tailorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Tailor profile not found." });
    }

    res.status(200).json({ success: true, portfolio: tailorProfile.portfolio });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getTailorProfile = async (req, res) => {
  try {
    const { tailorId } = req.params;

    const tailorProfile = await TailorProfile.findOne(
      { tailorId },
      "-verificationToken" // Exclude sensitive data
    ).populate("reviews"); // Populate reviews for detailed info

    if (!tailorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Tailor profile not found." });
    }

    res.status(200).json({ success: true, tailorProfile });
  } catch (error) {
    console.error("Error fetching tailor profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getAllTailors = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const tailors = await TailorProfile.find({})
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("tailorId shopName rating");

    res.status(200).json({ success: true, tailors });
  } catch (error) {
    console.error("Error fetching all tailors:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const updateTailorProfile = async (req, res) => {
  try {
    const tailorId = req.user._id; // Authenticated user
    const { shopName, bio, shopLocation } = req.body;

    const tailorProfile = await TailorProfile.findOne({ tailorId });
    if (!tailorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Tailor profile not found." });
    }

    if (shopName) tailorProfile.shopName = shopName;
    if (bio) tailorProfile.bio = bio;
    if (shopLocation) tailorProfile.shopLocation = shopLocation;

    const updatedProfile = await tailorProfile.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const searchTailors = async (req, res) => {
  try {
    const {
      query,
      minPrice,
      maxPrice,
      minRating,
      minExperience,
      latitude,
      longitude,
      maxDistance,
    } = req.query;

    // Build the filter query
    let filterQuery = {};

    // Text search filter
    if (query) {
      filterQuery.$or = [
        { shopName: { $regex: query, $options: "i" } },
        { bio: { $regex: query, $options: "i" } },
        { "serviceRates.type": { $regex: query, $options: "i" } },
      ];
    }

    // Rating filter
    if (minRating) {
      filterQuery.rating = { $gte: parseFloat(minRating) };
    }

    // Experience filter
    if (minExperience) {
      filterQuery.experience = { $gte: parseInt(minExperience) };
    }

    // Get tailors matching the base criteria
    let tailors = await TailorProfile.find(filterQuery).lean();

    // Location-based filtering
    if (latitude && longitude && maxDistance) {
      const userLat = parseFloat(latitude);
      const userLng = parseFloat(longitude);
      const maxDist = parseFloat(maxDistance);

      // Calculate distance for each tailor and filter based on maxDistance
      tailors = tailors.filter((tailor) => {
        // Skip tailors without location coordinates
        if (
          !tailor.shopLocation ||
          !tailor.shopLocation.coordinates ||
          !tailor.shopLocation.coordinates.lat ||
          !tailor.shopLocation.coordinates.lng
        ) {
          return false;
        }

        // Calculate distance between coordinates using the Haversine formula
        const distance = calculateDistance(
          userLat,
          userLng,
          tailor.shopLocation.coordinates.lat,
          tailor.shopLocation.coordinates.lng
        );

        // Add distance to tailor object for sorting or displaying
        tailor.distance = distance;

        // Return true if within maxDistance
        return distance <= maxDist;
      });

      // Sort tailors by distance (closest first)
      tailors.sort((a, b) => a.distance - b.distance);
    }

    console.log("Tailors found:", tailors);

    // Get active campaigns for all tailors
    const currentDate = new Date();
    const activeCampaigns = await Campaign.find({
      tailorId: { $in: tailors.map((tailor) => tailor.tailorId) },
      isActive: true,
    }).lean();

    console.log("Active campaigns:", activeCampaigns);

    // Post-query filtering for price ranges and add campaign data
    if (minPrice || maxPrice) {
      tailors = tailors.filter((tailor) => {
        const prices = tailor.serviceRates.map((service) => service.minPrice);
        const minServicePrice = Math.min(...prices);
        const maxServicePrice = Math.max(
          ...tailor.serviceRates.map((service) => service.maxPrice)
        );

        return (
          !minPrice ||
          (minServicePrice >= parseFloat(minPrice) && !maxPrice) ||
          maxServicePrice <= parseFloat(maxPrice)
        );
      });
    }

    const formattedTailors = tailors.map((tailor) => {
      // Calculate price range from all services
      const minServicePrice =
        tailor.serviceRates.length > 0
          ? Math.min(...tailor.serviceRates.map((service) => service.minPrice))
          : 0;
      const maxServicePrice =
        tailor.serviceRates.length > 0
          ? Math.max(...tailor.serviceRates.map((service) => service.maxPrice))
          : 0;

      // Get campaigns for this tailor
      const tailorCampaigns = activeCampaigns.filter(
        (campaign) =>
          campaign.tailorId.toString() === tailor.tailorId.toString()
      );

      // Add campaign discount info to services
      const servicesWithDiscounts = tailor.serviceRates.map((service) => {
        let bestDiscount = null;

        // Find the best discount for this service from all active campaigns
        tailorCampaigns.forEach((campaign) => {
          const applicableService = campaign.applicableServices.find(
            (as) =>
              as.serviceId.toString() === service._id.toString() &&
              as.serviceType === "TailorProfile.serviceRates"
          );

          if (applicableService) {
            const discountInfo = {
              type: campaign.discountType,
              value: campaign.discountValue,
              campaignTitle: campaign.title,
            };

            // Update best discount if this is better
            if (!bestDiscount || bestDiscount.value < campaign.discountValue) {
              bestDiscount = discountInfo;
            }
          }
        });

        return {
          ...service,
          discount: bestDiscount,
        };
      });

      return {
        id: tailor.tailorId,
        shopName: tailor.shopName,
        image: tailor.shopImages[0] || "",
        rating: tailor.rating || 0,
        experience: tailor.experience || 0,
        location: tailor.shopLocation || "Location not provided",
        distance: tailor.distance
          ? parseFloat(tailor.distance.toFixed(2))
          : null, // Distance in km, rounded to 2 decimal places
        priceRange: {
          min: minServicePrice,
          max: maxServicePrice,
        },
        description: tailor.bio ? tailor.bio.substring(0, 100) : "",
        services: servicesWithDiscounts,
      };
    });

    res.status(200).json({
      success: true,
      tailors: formattedTailors,
      total: formattedTailors.length,
    });
  } catch (error) {
    console.error("Error searching tailors:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const deleteTailorProfile = async (req, res) => {
  try {
    const tailorId = req.user._id;

    const tailorProfile = await TailorProfile.findOneAndDelete({ tailorId });

    if (!tailorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Tailor profile not found." });
    }

    res.status(200).json({ success: true, message: "Profile deleted." });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const searchTailorsByPartialService = async (req, res) => {
  try {
    const { serviceName } = req.query;

    // Ensure the search string exists
    if (!serviceName || serviceName.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Service name is required." });
    }

    const tailors = await TailorProfile.find({
      "serviceRates.type": { $regex: serviceName, $options: "i" }, // Partial matching with regex
    }).select("tailorId shopName serviceRates");

    if (!tailors.length) {
      return res.status(404).json({
        success: false,
        message: "No tailors found for this service.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tailors offering the service found.",
      tailors,
    });
  } catch (error) {
    console.error("Error searching tailors by partial service name:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getAllServicesBySearch = async (req, res) => {
  try {
    const { search } = req.query;

    // Query condition based on whether search input exists
    const query = search
      ? { "serviceRates.type": { $regex: search, $options: "i" } } // Partial match with regex
      : {};

    const services = await TailorProfile.find(query, "shopName serviceRates")
      .populate("tailorId", "name email") // Include tailor info if required
      .exec();

    if (!services.length) {
      return res
        .status(404)
        .json({ success: false, message: "No services found." });
    }

    // Flatten services into a list if needed
    const allServices = services.map((tailor) => ({
      tailorId: tailor.tailorId?._id,
      tailorName: tailor.shopName,
      services: tailor.serviceRates,
    }));

    res.status(200).json({
      success: true,
      message: search
        ? `Services matching '${search}' retrieved successfully.`
        : "All services retrieved successfully.",
      services: allServices,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getTailorProfileById = async (req, res) => {
  try {
    const { tailorId } = req.params;

    // Find the tailor's profile, also populate relevant fields if needed
    const tailorProfile = await TailorProfile.findOne({ tailorId })
      .populate("tailorId", "name profilePicture")
      .populate({
        path: "reviews",
        select: "user comment rating",
      });

    if (!tailorProfile) {
      return res.status(404).json({ message: "Tailor not found" });
    }

    // Construct your response object to match the required format
    const tailorData = {
      name: tailorProfile.tailorId?.name || "Unknown Tailor",
      shopName: tailorProfile.shopName,
      profilePicture:
        tailorProfile.tailorId?.profilePicture ||
        "https://source.unsplash.com/150x150/?portrait", // fallback
      shopLocation:
        tailorProfile.shopLocation?.address || "Location not provided",
      bio: tailorProfile.bio || "",
      rating: tailorProfile.rating || 0,
      shopImages: tailorProfile.shopImages || [],
      portfolio: (tailorProfile.portfolio || []).map((item) => ({
        name: item.name,
        images: item.images,
        description: item.description,
      })),
      serviceRates: (tailorProfile.serviceRates || []).map((service) => ({
        type: service.type,
        description: service.description,
        minPrice: service.minPrice,
        maxPrice: service.maxPrice,
        image: service.image,
      })),
      // Include extraServices in the same structured format
      extraServices: (tailorProfile.extraServices || []).map((service) => ({
        serviceName: service.serviceName,
        description: service.description,
        minPrice: service.minPrice,
        maxPrice: service.maxPrice,
      })),
      reviews: (tailorProfile.reviews || []).map((review) => ({
        user: review.user,
        comment: review.comment,
        rating: review.rating,
      })),
    };

    return res.status(200).json({ tailorData, success: true });
  } catch (error) {
    console.error("Error fetching tailor profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTailorDashboard = async (req, res) => {
  try {
    const tailorId = req.user._id; // Get tailor ID from authenticated user

    // Find the tailor profile
    const tailorProfile = await TailorProfile.findOne({ tailorId }).lean();

    if (!tailorProfile) {
      return res.status(404).json({
        message: "Tailor profile not found.",
        success: false,
      });
    }

    // Aggregate order data
    const orderStats = await Order.aggregate([
      { $match: { tailorId: new mongoose.Types.ObjectId(tailorId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$pricing.total" },
        },
      },
    ]);

    // Format order stats
    const formattedOrderStats = {
      total: { count: 0, amount: 0 },
      active: { count: 0, amount: 0 },
      completed: { count: 0, amount: 0 },
      refunded: { count: 0, amount: 0 },
    };

    orderStats.forEach((stat) => {
      if (stat._id === "completed") {
        formattedOrderStats.completed = {
          count: stat.count,
          amount: stat.totalAmount,
        };
        formattedOrderStats.total.count += stat.count;
        formattedOrderStats.total.amount += stat.totalAmount;
      } else if (
        [
          "pending",
          "in progress",
          "placed",
          "stiched",
          "ready for pickup",
        ].includes(stat._id)
      ) {
        formattedOrderStats.active.count += stat.count;
        formattedOrderStats.active.amount += stat.totalAmount;
        formattedOrderStats.total.count += stat.count;
        formattedOrderStats.total.amount += stat.totalAmount;
      } else if (stat._id === "refunded") {
        formattedOrderStats.refunded = {
          count: stat.count,
          amount: stat.totalAmount,
        };
        formattedOrderStats.total.count += stat.count;
      }
    });

    // Get recent orders (limit to 5)
    const recentOrders = await Order.find({ tailorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customerId", "name")
      .lean();

    // Calculate sales trend data
    const currentDate = new Date();
    const oneWeekAgo = new Date(currentDate);
    oneWeekAgo.setDate(currentDate.getDate() - 7);

    const oneMonthAgo = new Date(currentDate);
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    const oneYearAgo = new Date(currentDate);
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    // Weekly sales trend
    const weeklySales = await Order.aggregate([
      {
        $match: {
          tailorId: new mongoose.Types.ObjectId(tailorId),
          createdAt: { $gte: oneWeekAgo },
          status: { $nin: ["refunded", "cancelled", "failed"] },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          sales: { $sum: "$pricing.total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Monthly sales trend
    const monthlySales = await Order.aggregate([
      {
        $match: {
          tailorId: new mongoose.Types.ObjectId(tailorId),
          createdAt: { $gte: oneMonthAgo },
          status: { $nin: ["refunded", "cancelled", "failed"] },
        },
      },
      {
        $group: {
          _id: { $week: "$createdAt" },
          sales: { $sum: "$pricing.total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Yearly sales trend
    const yearlySales = await Order.aggregate([
      {
        $match: {
          tailorId: new mongoose.Types.ObjectId(tailorId),
          createdAt: { $gte: oneYearAgo },
          status: { $nin: ["refunded", "cancelled", "failed"] },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          sales: { $sum: "$pricing.total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get average rating
    const avgRating = tailorProfile.rating || 0;

    return res.status(200).json({
      success: true,
      dashboardData: {
        shopDetails: {
          name: tailorProfile.shopName,
          location: tailorProfile.shopLocation,
          image: tailorProfile.shopImages?.[0] || null,
        },
        orderStats: formattedOrderStats,
        avgRating,
        recentOrders: recentOrders.map((order) => ({
          id: order._id,
          customer: order.customerId?.name || "Unknown Customer",
          date: order.createdAt,
          status: order.status,
          amount: order.pricing.total,
          image: order.design?.designImage?.[0] || null,
        })),
        salesTrend: {
          weekly: weeklySales.map((day) => day.sales),
          monthly: monthlySales.map((week) => week.sales),
          yearly: yearlySales.map((month) => month.sales),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching tailor dashboard data:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
      success: false,
    });
  }
};
