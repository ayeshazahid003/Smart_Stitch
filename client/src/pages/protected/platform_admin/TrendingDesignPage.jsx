import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  addTrendingDesign,
  getAllTrendingDesigns,
  updateTrendingDesign,
  deleteTrendingDesign,
} from "../../../hooks/TrendingDesignHooks";
import { toast } from "react-toastify";

export default function TrendingDesignPage() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDesign, setCurrentDesign] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    popularityScore: 0,
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [designToDelete, setDesignToDelete] = useState(null);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    setLoading(true);
    try {
      const data = await getAllTrendingDesigns();
      if (Array.isArray(data)) {
        setDesigns(data);
      } else {
        toast.error("Failed to load trending designs");
      }
    } catch (error) {
      console.error("Error fetching designs:", error);
      toast.error("An error occurred while loading designs");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // For preview
        setImagePreview(URL.createObjectURL(file));

        // Convert image to base64
        const base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });

        // Update form data with base64 image
        setFormData({
          ...formData,
          image: base64Image,
        });
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Failed to process image");
      }
    }
  };

  const openAddModal = () => {
    setCurrentDesign(null);
    setFormData({
      description: "",
      popularityScore: 0,
      image: null,
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (design) => {
    setCurrentDesign(design);
    setFormData({
      description: design.description || "",
      popularityScore: design.popularityScore || 0,
      image: null,
    });
    // Set image preview from the first image in the designImage array
    setImagePreview(
      design.designImage && design.designImage.length > 0
        ? design.designImage[0]
        : null
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDesign(null);
    setFormData({
      description: "",
      popularityScore: 0,
      image: null,
    });
    setImagePreview(null);
  };

  const confirmDelete = (design) => {
    setDesignToDelete(design);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!designToDelete) return;

    try {
      const result = await deleteTrendingDesign(designToDelete._id);
      if (result && result.message) {
        toast.success("Design deleted successfully");
        fetchDesigns();
      } else {
        toast.error("Failed to delete design");
      }
    } catch (error) {
      console.error("Error deleting design:", error);
      toast.error("An error occurred while deleting the design");
    } finally {
      setDeleteConfirmOpen(false);
      setDesignToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description) {
      toast.error("Please provide a description");
      return;
    }

    if (!currentDesign && !formData.image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      setLoading(true);
      let result;

      if (currentDesign) {
        // Update existing design
        result = await updateTrendingDesign(currentDesign._id, formData);
        if (result) {
          toast.success("Design updated successfully");
        }
      } else {
        // Add new design
        result = await addTrendingDesign(formData);
        if (result) {
          toast.success("Design added successfully");
        }
      }

      closeModal();
      fetchDesigns();
    } catch (error) {
      console.error("Error saving design:", error);
      toast.error("An error occurred while saving the design");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Trending Designs</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Design
        </button>
      </div>

      {loading && designs.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : designs.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-md">
          <p className="text-gray-500 text-lg">No trending designs found.</p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Your First Design
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => (
            <div
              key={design._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-transform hover:shadow-lg"
            >
              <div className="h-48 overflow-hidden bg-gray-200">
                {design.designImage && design.designImage.length > 0 ? (
                  <img
                    src={design.designImage[0]}
                    alt="Trending Design"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
                    No image available
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Popularity: {design.popularityScore || 0}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {design.description}
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => openEditModal(design)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => confirmDelete(design)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {currentDesign ? "Edit Design" : "Add New Design"}
                    </Dialog.Title>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Popularity Score *
                      </label>
                      <input
                        type="number"
                        name="popularityScore"
                        value={formData.popularityScore}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Design Image {!currentDesign && "*"}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 mb-1">Preview:</p>
                          <div className="relative h-40 w-full overflow-hidden rounded-md">
                            <img
                              src={imagePreview}
                              alt="Design preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </span>
                        ) : currentDesign ? (
                          "Update Design"
                        ) : (
                          "Add Design"
                        )}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition appear show={deleteConfirmOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Delete Design
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this design? This action
                      cannot be undone.
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="mr-3 inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                      onClick={() => setDeleteConfirmOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
