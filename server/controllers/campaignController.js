import Campaign from "../models/Campaign.js";
import User from "../models/User.js";
import TailorProfile from "../models/TailorProfile.js";
import Notification from "../models/Notification.js";
import { sendNotificationToUser } from "../helper/notificationHelper.js";

const createAndSendNotification = async (notificationData) => {
  try {
    const notification = await Notification.create(notificationData);
    await sendNotificationToUser(notification);
    return notification;
  } catch (error) {
    console.error("Error creating/sending notification:", error);
  }
};

// Create a new campaign
export const createCampaign = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      discountType,
      discountValue,
      validFrom,
      validUntil,
      applicableServices,
      minimumOrderValue,
      maximumDiscount,
      termsAndConditions,
    } = req.body;

    const tailorId = req.user._id;

    // Verify user is a tailor
    const user = await User.findById(tailorId);
    if (!user || user.role !== "tailor") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Only tailors can create campaigns.",
      });
    }

    // Calculate discounted prices for applicable services
    const processedServices = await Promise.all(
      applicableServices.map(async (service) => {
        const tailorProfile = await TailorProfile.findOne({ tailorId });
        let serviceDetails;

        if (service.serviceType === "TailorProfile.serviceRates") {
          serviceDetails = tailorProfile.serviceRates.id(service.serviceId);
        } else {
          serviceDetails = tailorProfile.extraServices.id(service.serviceId);
        }

        if (!serviceDetails) {
          throw new Error(`Service ${service.serviceId} not found`);
        }

        const originalPrice = serviceDetails.minPrice;
        const discountedPrice =
          discountType === "percentage"
            ? originalPrice * (1 - discountValue / 100)
            : originalPrice - discountValue;

        return {
          ...service,
          originalPrice,
          discountedPrice: Math.max(discountedPrice, 0),
        };
      })
    );

    const campaign = new Campaign({
      tailorId,
      title,
      description,
      type,
      discountType,
      discountValue,
      validFrom,
      validUntil,
      applicableServices: processedServices,
      minimumOrderValue,
      maximumDiscount,
      termsAndConditions,
    });

    await campaign.save();

    // Get tailor's subscribers for notification
    const tailorProfile = await TailorProfile.findOne({ tailorId }).populate(
      "subscribers.userId"
    );

    // Send notifications to all subscribers
    if (tailorProfile && tailorProfile.subscribers) {
      const notifications = tailorProfile.subscribers.map((sub) => ({
        userId: sub.userId._id,
        type: "new_campaign",
        message: `New campaign from ${tailorProfile.shopName}: ${title}`,
        relatedId: campaign._id,
        onModel: "Campaign",
      }));

      // Send notifications in parallel
      await Promise.all(
        notifications.map((notification) =>
          createAndSendNotification(notification)
        )
      );
    }

    res.status(201).json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all campaigns for a tailor
export const getTailorCampaigns = async (req, res) => {
  try {
    const tailorId = req.user._id;
    const campaigns = await Campaign.find({ tailorId }).sort("-createdAt");
    res.json({ success: true, campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get active campaigns for customers
export const getActiveCampaigns = async (req, res) => {
  try {
    const now = new Date();
    const campaigns = await Campaign.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
    }).populate("tailorId", "name email");

    res.json({ success: true, campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update campaign
export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const tailorId = req.user._id;

    const campaign = await Campaign.findById(id);
    if (!campaign || campaign.tailorId.toString() !== tailorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. You can only update your own campaigns.",
      });
    }

    if (updates.applicableServices) {
      // Recalculate discounted prices if services are updated
      updates.applicableServices = await Promise.all(
        updates.applicableServices.map(async (service) => {
          const tailorProfile = await TailorProfile.findOne({ tailorId });
          let serviceDetails;

          if (service.serviceType === "TailorProfile.serviceRates") {
            serviceDetails = tailorProfile.serviceRates.id(service.serviceId);
          } else {
            serviceDetails = tailorProfile.extraServices.id(service.serviceId);
          }

          if (!serviceDetails) {
            throw new Error(`Service ${service.serviceId} not found`);
          }

          const originalPrice = serviceDetails.minPrice;
          const discountedPrice =
            updates.discountType === "percentage"
              ? originalPrice * (1 - updates.discountValue / 100)
              : originalPrice - updates.discountValue;

          return {
            ...service,
            originalPrice,
            discountedPrice: Math.max(discountedPrice, 0),
          };
        })
      );
    }

    Object.assign(campaign, updates);
    await campaign.save();

    res.json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete campaign
export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const tailorId = req.user._id;

    const campaign = await Campaign.findById(id);
    if (!campaign || campaign.tailorId.toString() !== tailorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. You can only delete your own campaigns.",
      });
    }

    await campaign.deleteOne();

    res.json({ success: true, message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
