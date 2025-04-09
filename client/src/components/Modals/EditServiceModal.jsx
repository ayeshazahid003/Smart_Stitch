import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function EditServiceModal({ isOpen, service, onClose, onChange, onUpdate }) {
  // Helper to get a preview URL from the image field (either a URL string or a File)
  const getImagePreview = () => {
    if (!service.image) return null;
    if (typeof service.image === "string") return service.image;
    return URL.createObjectURL(service.image);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Service"
      className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
    >
      {service && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Service</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-semibold text-gray-700">
                Service Type
              </label>
              <input
                type="text"
                value={service.type}
                onChange={(e) => onChange("type", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700">
                Description
              </label>
              <textarea
                value={service.description}
                onChange={(e) => onChange("description", e.target.value)}
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
                  value={service.minPrice}
                  onChange={(e) => onChange("minPrice", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700">
                  Maximum Price ($)
                </label>
                <input
                  type="number"
                  value={service.maxPrice}
                  onChange={(e) => onChange("maxPrice", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700">
                Service Image
              </label>
              <div className="mt-1 flex items-center">
                {service.image && (
                  <img
                    src={getImagePreview()}
                    alt="Service"
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <input
                  type="file"
                  accept=".jpeg, .png, .mp4"
                  onChange={(e) => onChange("image", e.target.files[0])}
                  className="ml-4"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onUpdate}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
