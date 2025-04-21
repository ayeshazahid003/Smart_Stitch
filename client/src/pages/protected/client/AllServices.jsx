import { useEffect, useState } from "react";
import {
  getListOfServices,
  updateService,
  removeServiceFromTailor,
  addServiceToTailor,
} from "../../../hooks/TailorHooks";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import EditServiceModal from "../../../components/Modals/EditServiceModal";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

Modal.setAppElement("#root");

/* -------------------------------------------------------------------- */
/* Helper: always get an ID, whether it’s _id or id                      */
/* -------------------------------------------------------------------- */
const getId = (obj) => obj?._id || obj?.id;

export default function AllServices() {
  /* ------------------------------------------------------------------ */
  /* State                                                              */
  /* ------------------------------------------------------------------ */
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [newService, setNewService] = useState({
    type: "",
    description: "",
    minPrice: "",
    maxPrice: "",
    image: null,
  });

  /* ------------------------------------------------------------------ */
  /* Tailor ID                                                          */
  /* ------------------------------------------------------------------ */
  const [userId] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?._id;
  });

  /* ------------------------------------------------------------------ */
  /* Fetch services                                                     */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const fetchServices = async () => {
      if (!userId) return;
      setLoading(true);
      const response = await getListOfServices(userId);
      if (response.success) {
        setServices(
          response.services
            .filter(Boolean)
            .map((s) => ({ ...s, _id: getId(s) })) // normalize id
            .reverse()
        );
      } else {
        setMessage(response.message);
      }
      setLoading(false);
    };
    fetchServices();
  }, [userId]);

  /* ------------------------------------------------------------------ */
  /* Edit service                                                       */
  /* ------------------------------------------------------------------ */
  const openEditModal = (service) => {
    setSelectedService({ ...service, _id: getId(service) });
    setEditModalIsOpen(true);
  };
  const closeEditModal = () => {
    setSelectedService(null);
    setEditModalIsOpen(false);
  };
  const handleChange = (field, value) =>
    setSelectedService((prev) => ({ ...prev, [field]: value }));
  const handleUpdate = async () => {
    if (!selectedService) return;
    const { minPrice, maxPrice } = selectedService;
    if (Number(maxPrice) < Number(minPrice)) {
      toast.error("Maximum price cannot be less than minimum price");
      return;
    }

    let image64 = selectedService.image;
    if (selectedService.image instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedService.image);
      reader.onloadend = async () => {
        image64 = reader.result;
        await finalizeUpdate(image64);
      };
    } else {
      await finalizeUpdate(image64);
    }
  };
  const finalizeUpdate = async (img) => {
    const payload = {
      type: selectedService.type,
      description: selectedService.description,
      minPrice: selectedService.minPrice,
      maxPrice: selectedService.maxPrice,
      image: img,
    };
    const id = getId(selectedService);
    const response = await updateService(id, payload);
    if (!response.success) {
      toast.error("Failed to update service");
      return;
    }
    const updated = {
      ...response.service,
      _id: getId(response.service) || id,
    };
    toast.success("Service updated successfully!");
    setServices((prev) =>
      prev.map((s) => (getId(s) === id ? updated : s))
    );
    closeEditModal();
  };

  /* ------------------------------------------------------------------ */
  /* Delete service                                                     */
  /* ------------------------------------------------------------------ */
  const openDeleteModal = (service) => {
    setSelectedService({ ...service, _id: getId(service) });
    setDeleteModalIsOpen(true);
  };
  const closeDeleteModal = () => {
    setSelectedService(null);
    setDeleteModalIsOpen(false);
  };
  const handleDelete = async () => {
    const id = getId(selectedService);
    const response = await removeServiceFromTailor(id);
    if (!response.success) {
      toast.error("Failed to delete service");
      return;
    }
    toast.success("Service deleted successfully!");
    setServices((prev) => prev.filter((s) => getId(s) !== id));
    closeDeleteModal();
  };

  /* ------------------------------------------------------------------ */
  /* Add service                                                        */
  /* ------------------------------------------------------------------ */
  const openAddModal = () => setModalAddOpen(true);
  const closeAddModal = () => {
    setNewService({
      type: "",
      description: "",
      minPrice: "",
      maxPrice: "",
      image: null,
    });
    setModalAddOpen(false);
  };
  const handleNewServiceChange = (field, value) =>
    setNewService((prev) => ({ ...prev, [field]: value }));
  const handleNewImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewService((prev) => ({ ...prev, image: file }));
  };
  const handleAddService = async () => {
    const { type, description, minPrice, maxPrice } = newService;
    if (!type || !description || !minPrice || !maxPrice) {
      toast.error("All fields are required");
      return;
    }
    if (Number(maxPrice) < Number(minPrice)) {
      toast.error("Maximum price cannot be less than minimum price");
      return;
    }

    let image64 = null;
    if (newService.image) {
      const reader = new FileReader();
      reader.readAsDataURL(newService.image);
      reader.onloadend = async () => {
        image64 = reader.result;
        await finalizeAdd({ ...newService, image: image64 });
      };
    } else {
      await finalizeAdd(newService);
    }
  };
  const finalizeAdd = async (payload) => {
    const response = await addServiceToTailor(payload);
    if (!response.success) {
      toast.error("Failed to add service");
      return;
    }
    const added = { ...response.service, _id: getId(response.service) };
    toast.success("Service added successfully!");
    setServices((prev) => [added, ...prev]);
    closeAddModal();
  };

  /* ------------------------------------------------------------------ */
  /* UI                                                                  */
  /* ------------------------------------------------------------------ */
  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="p-4">
      {message && message !== "Tailor profile not found." && (
        <p className="text-red-500 text-center mb-4">{message}</p>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Services</h1>
        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900"
        >
          Add Service
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={getId(service)}
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

      {/* Edit Modal */}
      <EditServiceModal
        isOpen={editModalIsOpen}
        service={selectedService}
        onClose={closeEditModal}
        onChange={handleChange}
        onUpdate={handleUpdate}
      />

      {/* Tailor profile not found */}
      {message === "Tailor profile not found." && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-600 text-xl w-[400px] mb-4">
              We couldn&apos;t find your tailor profile. Please add your shop
              details to get started.
            </p>
            <button
              onClick={() => navigate("/add-shop-details")}
              className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900"
            >
              Add Shop Details
            </button>
          </div>
        </div>
      )}

      {/* No services */}
      {!loading && services.length === 0 && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-gray-600 text-xl w-[400px] mb-4">
              It seems like you haven&apos;t added any services yet.
            </p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900"
            >
              Add Services
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
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
              Are you sure you want to delete the service &quot;
              {selectedService.type}&quot;?
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

      {/* Add Modal */}
      <Modal
        isOpen={modalAddOpen}
        onRequestClose={closeAddModal}
        contentLabel="Add Service"
        className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
      >
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Add New Service
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-semibold text-gray-700">
                Service Type
              </label>
              <input
                type="text"
                value={newService.type}
                onChange={(e) => handleNewServiceChange("type", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700">
                Description
              </label>
              <textarea
                value={newService.description}
                onChange={(e) =>
                  handleNewServiceChange("description", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                rows="3"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-semibold text-gray-700">
                  Minimum Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newService.minPrice}
                  onChange={(e) =>
                    handleNewServiceChange("minPrice", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700">
                  Maximum Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newService.maxPrice}
                  onChange={(e) =>
                    handleNewServiceChange("maxPrice", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700">
                Service Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleNewImageChange}
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={closeAddModal}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleAddService}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Add Service
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
