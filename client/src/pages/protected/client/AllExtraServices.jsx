import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { getListOfExtraServices, updateExtraService, deleteExtraService } from "../../../hooks/TailorHooks";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

export default function AllExtraServices() {
  const [extraServices, setExtraServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchExtraServices = async () => {
      setLoading(true);
      const response = await getListOfExtraServices(user._id);
      if (response.success) {
        // Reverse array so newest appear first
        setExtraServices(response.extraServices.slice().reverse());
      } else {
        setMessage(response.message);
      }
      setLoading(false);
    };

    fetchExtraServices();
  }, [user._id]);

  // Open Edit Modal
  const openEditModal = (service) => {
    setSelectedService(service);
    setModalEditOpen(true);
  };

  const closeEditModal = () => {
    setSelectedService(null);
    setModalEditOpen(false);
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (service) => {
    setSelectedService(service);
    setModalDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedService(null);
    setModalDeleteOpen(false);
  };

  // Handle field change in edit modal
  const handleChange = (field, value) => {
    setSelectedService((prev) => ({ ...prev, [field]: value }));
  };

  // Handle update extra service
  const handleUpdate = async () => {
    if (!selectedService.serviceName || !selectedService.minPrice || !selectedService.maxPrice) {
      toast.error("Service name and price range are required.");
      return;
    }
    const payload = {
      serviceName: selectedService.serviceName,
      description: selectedService.description,
      minPrice: selectedService.minPrice,
      maxPrice: selectedService.maxPrice,
    };

    const response = await updateExtraService(selectedService._id, payload);
    if (!response.success) {
      toast.error("Failed to update extra service");
      return;
    }
    toast.success("Extra service updated successfully!");
    setExtraServices((prev) =>
      prev.map((s) => (s._id === selectedService._id ? response.extraService : s))
    );
    closeEditModal();
  };

  // Handle delete extra service
  const handleDelete = async () => {
    const response = await deleteExtraService(selectedService._id);
    if (!response.success) {
      toast.error("Failed to delete extra service");
      return;
    }
    toast.success("Extra service deleted successfully!");
    setExtraServices((prev) =>
      prev.filter((s) => s._id !== selectedService._id)
    );
    closeDeleteModal();
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="p-4">
      {message && <p className="text-red-500 text-center mb-4">{message}</p>}
      <h1 className="text-3xl font-bold text-center mb-6">All Extra Services</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {extraServices.map((service) => (
          <div
            key={service._id}
            className="bg-white border border-gray-200 rounded-lg shadow p-4 flex flex-col"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {service.serviceName}
            </h2>
            <p className="text-gray-600 mb-2">{service.description}</p>
            <p className="text-gray-500 mb-4">
              Price Range: ${service.minPrice} - ${service.maxPrice}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => openEditModal(service)}
                className="text-blue-600 hover:text-blue-800"
              >
                <PencilSquareIcon className="w-6 h-6" />
              </button>
              <button
                onClick={() => openDeleteModal(service)}
                className="text-red-600 hover:text-red-800"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Extra Service Modal */}
      <Modal
        isOpen={modalEditOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Extra Service"
        className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
      >
        {selectedService && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Edit Extra Service
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-semibold text-gray-700">
                  Service Name
                </label>
                <input
                  type="text"
                  value={selectedService.serviceName}
                  onChange={(e) => handleChange("serviceName", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  value={selectedService.description}
                  onChange={(e) =>
                    handleChange("description", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  rows="3"
                ></textarea>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-semibold text-gray-700">
                    Minimum Price ($)
                  </label>
                  <input
                    type="number"
                    value={selectedService.minPrice}
                    onChange={(e) => handleChange("minPrice", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-700">
                    Maximum Price ($)
                  </label>
                  <input
                    type="number"
                    value={selectedService.maxPrice}
                    onChange={(e) => handleChange("maxPrice", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Update
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalDeleteOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Confirm Delete Extra Service"
        className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
      >
        {selectedService && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Confirm Deletion
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "{selectedService.serviceName}"?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
