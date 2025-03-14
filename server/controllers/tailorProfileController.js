import TailorProfile from "../models/TailorProfile.js";
import {
  uploadMultipleFiles,
  uploadSingleFile,
} from "../helper/cloudinaryUploader.js";
import { sendEmail } from "../helper/mail.js";
import crypto from "crypto";

export const createTailorProfile = async (req, res) => {
  try {
    const { shopName, shopImages, shopLocation, bio } = req.body;
    const tailorId = req.user._id;

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
    let uploadedImages, shopImageUrls;
    if (shopImages.length > 0) {
      uploadedImages = await uploadMultipleFiles(shopImages, "Home");
      shopImageUrls = uploadedImages.map((img) => img.secure_url);
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const tailorProfile = new TailorProfile({
      tailorId,
      shopName,
      shopImages: shopImageUrls,
      shopLocation,
      bio,
      isVerified: false,
      verificationToken,
    });

    const savedProfile = await tailorProfile.save();

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

    // await sendEmail("info@cogentro.com", req.user.email, subject, emailBody);

    res.status(201).json({
      message:
        "Tailor profile created successfully. Please check your email for verification.",
      tailorProfile: savedProfile,
      success: true,
    });
  } catch (error) {
    console.error("Error creating tailor profile:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error, success: false });
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

    const portfolioImages = uploadedImages.map((img) => img.secure_url);

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
    const { type, description, price, image } = req.body;
    const tailorId = req.user._id;
    const tailorProfile = await TailorProfile.findOne({ tailorId });
    if (!tailorProfile) {
      return res
        .status(404)
        .json({ message: "Tailor profile not found.", success: false });
    }

    if (!type || type.trim() === "") {
      return res
        .status(400)
        .json({ message: "Service type is required.", success: false });
    }
    if (!description || description.trim() === "") {
      return res
        .status(400)
        .json({ message: "Service description is required.", success: false });
    }
    if (!price || typeof price !== "number" || price <= 0) {
      return res
        .status(400)
        .json({ message: "Valid service price is required.", success: false });
    }
    if (!image) {
      return res
        .status(400)
        .json({ message: "Service image is required.", success: false });
    }

    const uploadedImage = await uploadSingleFile(image, "Home");

    const service = {
      type,
      description,
      price,
      image: uploadedImage.secure_url,
    };
    tailorProfile.serviceRates.push(service);

    await tailorProfile.save();

    res.status(200).json({
      message: "Service added successfully.",
      service,
      success: true,
    });
  } catch (error) {
    console.error("Error adding service:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error, success: false });
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

export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params; // Service ID passed as a route parameter
    const { type, description, price, image } = req.body;
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
    if (price) service.price = price;

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
    const { serviceName, description, price } = req.body;
    const tailorId = req.user._id; // Get the tailorId from the authenticated user

    // Validate required fields
    if (!serviceName || !description || !price) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Find the tailor profile
    const tailorProfile = await TailorProfile.findOne({ tailorId });
    if (!tailorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Tailor profile not found." });
    }

    const extraService = { serviceName, description, price };
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
    const { serviceName, description, price } = req.body;
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
    if (price) extraService.price = price;

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

export const getListOfServices = async (req, res) => {
  try {
    const tailorId = req.user._id; // Get the tailorId from the authenticated user

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
    const tailorId = req.user._id; // Get the tailorId from the authenticated user

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
    const tailorId = req.user._id; // Get the tailorId from the authenticated user

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
    const { query } = req.query;

    const tailors = await TailorProfile.find({
      $or: [
        { shopName: { $regex: query, $options: "i" } },
        { "serviceRates.type": { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({ success: true, tailors });
  } catch (error) {
    console.error("Error searching tailors:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
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
