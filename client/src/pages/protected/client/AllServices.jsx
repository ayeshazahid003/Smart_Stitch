import React, { useEffect, useState } from "react";
import { getListOfServices, updateService, removeServiceFromTailor } from "../../../hooks/TailorHooks";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import EditServiceModal from "../../../components/Modals/EditServiceModal";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

Modal.setAppElement("#root");

export default function AllServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const user = JSON.parse(localStorage.getItem("user")) || null;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      if (!user || !user._id) return;

      setLoading(true);
      const response = await getListOfServices(user._id);
      if (response.success) {
        setServices(response.services.slice().reverse());
      } else {
        setMessage(response.message);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  const openEditModal = (service) => {
    setSelectedService(service);
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => {
    setSelectedService(null);
    setEditModalIsOpen(false);
  };

  const openDeleteModal = (service) => {
    setSelectedService(service);
    setDeleteModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedService(null);
    setDeleteModalIsOpen(false);
  };

  const handleUpdate = async () => {
    let image64 = selectedService.image;

    if (selectedService.image && selectedService.image instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedService.image);
      reader.onloadend = async () => {
        image64 = reader.result;

        const payload = {
          type: selectedService.type,
          description: selectedService.description,
          minPrice: selectedService.minPrice,
          maxPrice: selectedService.maxPrice,
          image: image64,
        };

        const response = await updateService(selectedService._id, payload);

        if (!response.success) {
          toast.error("Failed to update service");
          return;
        }
        toast.success("Service updated successfully!");
        setServices((prev) =>
          prev.map((s) => (s._id === selectedService._id ? response.service : s))
        );
        closeEditModal();
      };
    } else {
      const payload = {
        type: selectedService.type,
        description: selectedService.description,
        minPrice: selectedService.minPrice,
        maxPrice: selectedService.maxPrice,
        image: selectedService.image,
      };

      const response = await updateService(selectedService._id, payload);
      if (!response.success) {
        toast.error("Failed to update service");
        return;
      }
      toast.success("Service updated successfully!");
      setServices((prev) =>
        prev.map((s) => (s._id === selectedService._id ? response.service : s))
      );
      closeEditModal();
    }
  };

  const handleDelete = async () => {
    const response = await removeServiceFromTailor(selectedService._id);
    if (!response.success) {
      toast.error("Failed to delete service");
      return;
    }
    toast.success("Service deleted successfully!");
    setServices((prev) => prev.filter((s) => s._id !== selectedService._id));
    closeDeleteModal();
  };

  const handleChange = (field, value) => {
    setSelectedService((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (message === "Tailor profile not found.") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 text-xl w-[400px] mb-4">
            We couldn’t find your tailor profile. Please add your shop details to get started.
          </p>
          <button
            onClick={() => navigate("/add-shop-details")}
            className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900"
          >
            Add Shop Details
          </button>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-xl w-[400px] mb-4">
            It seems like you haven't added any services yet.
          </p>
          <button
            onClick={() => navigate("/add-services")}
            className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900"
          >
            Add Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {message && message !== "Tailor profile not found." && (
        <p className="text-red-500 text-center mb-4">{message}</p>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white border border-gray-200 rounded-lg shadow p-4 flex flex-col"
          >
            {service.image && (
              <div className="mb-4">
                <img
                  src={service.image}
                  alt={`Service ${service.type}`}
                  className="w-full h-48 object-cover rounded"
                />
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {service.type}
            </h2>
            <p className="text-gray-600 text-sm mb-2">
              {service.description.length > 100
                ? `${service.description.substring(0, 100)}...`
                : service.description}
            </p>
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

      <EditServiceModal
        isOpen={editModalIsOpen}
        service={selectedService}
        onClose={closeEditModal}
        onChange={handleChange}
        onUpdate={handleUpdate}
      />

      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Confirm Delete Service"
        className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
      >
        {selectedService && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Confirm Deletion
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the service "{selectedService.type}"?
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
