import { useState, useEffect } from "react";
import { useCampaigns } from "../../hooks/campaignHooks";

export default function ActiveCampaigns({ tailorId, onSelectCampaign }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getActiveCampaigns } = useCampaigns();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const response = await getActiveCampaigns();
      // Filter campaigns for the specific tailor if tailorId is provided
      const filteredCampaigns = tailorId
        ? response.campaigns.filter(
            (campaign) => campaign.tailorId === tailorId
          )
        : response.campaigns;
      setCampaigns(filteredCampaigns);
    } catch (error) {
      console.error("Failed to load campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading campaigns...</div>;
  }

  if (campaigns.length === 0) {
    return null; // Don't show anything if no active campaigns
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-3">Active Campaigns</h3>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {campaigns.map((campaign) => (
          <div
            key={campaign._id}
            className="border rounded-lg p-4 bg-gradient-to-r from-indigo-50 to-white cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectCampaign(campaign)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-indigo-600">
                  {campaign.title}
                </h4>
                <p className="text-sm text-gray-600">{campaign.description}</p>
              </div>
              <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-medium">
                {campaign.discountValue}
                {campaign.discountType === "percentage" ? "%" : " PKR"} OFF
              </div>
            </div>

            <div className="mt-2 text-sm">
              {campaign.minimumOrderValue && (
                <p className="text-gray-600">
                  Min. order: PKR {campaign.minimumOrderValue}
                </p>
              )}
              <p className="text-gray-500">
                Valid until:{" "}
                {new Date(campaign.validUntil).toLocaleDateString()}
              </p>
              {campaign.termsAndConditions && (
                <p className="text-xs text-gray-500 mt-1">
                  *{campaign.termsAndConditions}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
