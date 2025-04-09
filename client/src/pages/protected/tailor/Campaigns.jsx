import { useCampaigns } from "../../../hooks/campaignHooks";
import { useState, useEffect, useCallback } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import ServiceSelector from "../../../components/client/ServiceSelector";

export default function Campaigns() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const { createCampaign, getTailorCampaigns, updateCampaign, deleteCampaign } =
    useCampaigns();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "seasonal",
    discountType: "percentage",
    discountValue: "",
    minimumOrderValue: "",
    validFrom: "",
    validUntil: "",
    termsAndConditions: "",
  });

  const loadCampaigns = useCallback(async () => {
    try {
      const response = await getTailorCampaigns();
      if (response.success) {
        setCampaigns(response.campaigns);
      }
    } catch (error) {
      console.error("Failed to load campaigns:", error);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title,
      description: campaign.description || "",
      type: campaign.type,
      discountType: campaign.discountType,
      discountValue: campaign.discountValue,
      minimumOrderValue: campaign.minimumOrderValue || "",
      validFrom: new Date(campaign.validFrom).toISOString().slice(0, 16),
      validUntil: new Date(campaign.validUntil).toISOString().slice(0, 16),
      termsAndConditions: campaign.termsAndConditions || "",
    });
    setSelectedServices(campaign.applicableServices);
    setIsModalOpen(true);
  };

  const handleDelete = async (campaignId) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        await deleteCampaign(campaignId);
        loadCampaigns();
      } catch (error) {
        console.error("Error deleting campaign:", error);
        alert(error.message || "Failed to delete campaign");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const campaignData = {
        ...formData,
        applicableServices: selectedServices,
        validFrom: new Date(formData.validFrom).toISOString(),
        validUntil: new Date(formData.validUntil).toISOString(),
        discountValue: Number(formData.discountValue),
        minimumOrderValue: formData.minimumOrderValue
          ? Number(formData.minimumOrderValue)
          : undefined,
      };

      let response;
      if (editingCampaign) {
        response = await updateCampaign(editingCampaign._id, campaignData);
      } else {
        response = await createCampaign(campaignData);
      }

      if (response.success) {
        setIsModalOpen(false);
        setEditingCampaign(null);
        setFormData({
          title: "",
          description: "",
          type: "seasonal",
          discountType: "percentage",
          discountValue: "",
          minimumOrderValue: "",
          validFrom: "",
          validUntil: "",
          termsAndConditions: "",
        });
        setSelectedServices([]);
        loadCampaigns();
      }
    } catch (error) {
      console.error("Error saving campaign:", error);
      alert(error.message || "Failed to save campaign");
    } finally {
      setIsLoading(false);
    }
  };

  const handleServicesSelected = (services) => {
    setSelectedServices(
      services.map((service) => ({
        serviceId: service._id,
        serviceType:
          service.type === "extra"
            ? "TailorProfile.extraServices"
            : "TailorProfile.serviceRates",
      }))
    );
  };

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Campaigns</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create and manage your promotional campaigns
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingCampaign(null);
              setFormData({
                title: "",
                description: "",
                type: "seasonal",
                discountType: "percentage",
                discountValue: "",
                minimumOrderValue: "",
                validFrom: "",
                validUntil: "",
                termsAndConditions: "",
              });
              setSelectedServices([]);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Create Campaign
          </button>
        </div>
      </div>

      {/* Campaign table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Discount
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Valid Period
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Min. Order
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {campaigns.map((campaign) => (
                    <tr key={campaign._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">
                          {campaign.title}
                        </div>
                        <div className="text-gray-500">
                          {campaign.description}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                        {campaign.type}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {campaign.discountValue}
                        {campaign.discountType === "percentage" ? "%" : " PKR"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div>
                          {new Date(campaign.validFrom).toLocaleDateString()}
                        </div>
                        <div>
                          to{" "}
                          {new Date(campaign.validUntil).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {campaign.minimumOrderValue
                          ? `PKR ${campaign.minimumOrderValue}`
                          : "-"}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(campaign)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(campaign._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto w-full max-w-2xl rounded-lg bg-white">
            <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-xl font-semibold text-gray-900">
                  {editingCampaign ? "Edit Campaign" : "Create New Campaign"}
                </Dialog.Title>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-6 py-4">
              <form
                id="campaign-form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Services
                  </label>
                  <div className="mt-2">
                    <ServiceSelector
                      onServicesSelected={handleServicesSelected}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="seasonal">Seasonal</option>
                      <option value="special">Special</option>
                      <option value="holiday">Holiday</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Discount Type
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountType: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Discount Value{" "}
                      {formData.discountType === "percentage" ? "(%)" : "(PKR)"}
                    </label>
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountValue: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Minimum Order Value
                    </label>
                    <input
                      type="number"
                      value={formData.minimumOrderValue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minimumOrderValue: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Valid From
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.validFrom}
                      onChange={(e) =>
                        setFormData({ ...formData, validFrom: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Valid Until
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.validUntil}
                      onChange={(e) =>
                        setFormData({ ...formData, validUntil: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Terms and Conditions
                  </label>
                  <textarea
                    value={formData.termsAndConditions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        termsAndConditions: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    rows={3}
                  />
                </div>
              </form>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="campaign-form"
                  disabled={isLoading}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? editingCampaign
                      ? "Updating..."
                      : "Creating..."
                    : editingCampaign
                    ? "Update Campaign"
                    : "Create Campaign"}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
