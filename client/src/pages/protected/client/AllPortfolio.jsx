import React, { useState, useEffect, useCallback } from "react";
import {
  getListOfPortfolio,
  updatePortfolio,
  removePortfolioFromTailor,
} from "../../../hooks/TailorHooks";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import Slider from "react-slick";
import Modal from "react-modal";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

/* ------------------------------------------------------------------ */
/* Small helpers                                                      */
/* ------------------------------------------------------------------ */
const getId = (o) => o?._id || o?.id || o?.portfolioId || "";
const fileToBase64 = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

export default function AllPortfolio() {
  /* ------------------------------------------------------------------ */
  /* Stable userId (prevents re‑runs)                                   */
  /* ------------------------------------------------------------------ */
  const [userId] = useState(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    return u?._id || null;
  });

  /* ------------------------------------------------------------------ */
  /* State                                                              */
  /* ------------------------------------------------------------------ */
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editImages, setEditImages] = useState([]);

  /* ------------------------------------------------------------------ */
  /* Fetch portfolio (memoised)                                         */
  /* ------------------------------------------------------------------ */
  const fetchPortfolioData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const res = await getListOfPortfolio(userId);
    if (res.success) {
      setPortfolio(res.portfolio.map((p) => ({ ...p, _id: getId(p) })));
    } else {
      setMessage(res.message);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  /* ------------------------------------------------------------------ */
  /* Slider settings                                                    */
  /* ------------------------------------------------------------------ */
  const sliderSettings = {
    dots: true,
    arrows: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
  };

  /* ------------------------------------------------------------------ */
  /* Edit handlers                                                      */
  /* ------------------------------------------------------------------ */
  const openEditModal = (item) => {
    setSelectedItem({ ...item, _id: getId(item) });
    setEditImages([]);
    setModalEditOpen(true);
  };
  const closeEditModal = () => {
    setSelectedItem(null);
    setEditImages([]);
    setModalEditOpen(false);
  };
  const handleEditChange = (field, val) =>
    setSelectedItem((p) => ({ ...p, [field]: val }));
  const handleEditImageChange = (e) =>
    setEditImages(Array.from(e.target.files || []));

  const handleUpdate = async () => {
    if (!selectedItem) return;
    if (!selectedItem.name || !selectedItem.description) {
      toast.error("Name and description are required");
      return;
    }

    let images = selectedItem.images || [];
    if (editImages.length) {
      try {
        images = await Promise.all(editImages.map(fileToBase64));
      } catch {
        toast.error("Failed to read images");
        return;
      }
    }

    const res = await updatePortfolio(getId(selectedItem), {
      name: selectedItem.name,
      description: selectedItem.description,
      date: selectedItem.date,
      images,
    });

    if (!res.success) {
      toast.error(res.message || "Update failed");
      return;
    }

    toast.success("Portfolio updated");
    closeEditModal();
    fetchPortfolioData();
  };

  /* ------------------------------------------------------------------ */
  /* Delete handlers                                                    */
  /* ------------------------------------------------------------------ */
  const openDeleteModal = (item) => {
    setSelectedItem({ ...item, _id: getId(item) });
    setModalDeleteOpen(true);
  };
  const closeDeleteModal = () => {
    setSelectedItem(null);
    setModalDeleteOpen(false);
  };
  const handleDelete = async () => {
    const res = await removePortfolioFromTailor(getId(selectedItem));
    if (!res.success) {
      toast.error(res.message || "Delete failed");
      return;
    }
    toast.success("Portfolio deleted");
    closeDeleteModal();
    fetchPortfolioData();
  };

  /* ------------------------------------------------------------------ */
  /* Render                                                             */
  /* ------------------------------------------------------------------ */
  if (loading) return <div className="text-center py-8">Loading...</div>;

  if (message === "Tailor profile not found.")
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 text-xl w-[400px] mb-4">
            We couldn’t find your tailor profile. Please add your shop details
            to get started.
          </p>
          <button
            onClick={() => (window.location.href = "/add-shop-details")}
            className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900"
          >
            Add Shop Details
          </button>
        </div>
      </div>
    );

  return (
    <div className="p-4 relative">
      {portfolio.length === 0 ? (
        <div className="flex justify-center items-center flex-col h-screen text-center py-8">
          <p className="text-gray-600 text-xl mb-4">
            It seems like you haven&apos;t added a portfolio yet.
          </p>
          <button
            onClick={() => (window.location.href = "/add-portfolio")}
            className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900"
          >
            Add Portfolio
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => (window.location.href = "/add-portfolio")}
            className="absolute top-4 right-4 px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900"
          >
            Add Portfolio
          </button>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {portfolio.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 rounded-lg shadow p-4 flex flex-col"
              >
                {item.images?.length ? (
                  <Slider {...sliderSettings} className="mb-4">
                    {item.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Portfolio ${item.name} ${idx}`}
                        className="w-full h-48 object-cover rounded"
                      />
                    ))}
                  </Slider>
                ) : (
                  <div className="mb-4 h-48 flex items-center justify-center bg-gray-100 rounded text-gray-400">
                    No Images
                  </div>
                )}
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {item.name}
                </h2>
                <p className="text-gray-600 mb-2">
                  {item.description?.length > 100
                    ? `${item.description.slice(0, 100)}...`
                    : item.description}
                </p>
                <p className="text-gray-500 mb-4">
                  {item.date ? new Date(item.date).toLocaleDateString() : "-"}
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => openEditModal(item)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <PencilSquareIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(item)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ---------------- Edit Modal ---------------- */}
      <Modal
        isOpen={modalEditOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Portfolio"
        className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
      >
        {selectedItem && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Edit Portfolio
            </h2>
            <div>
              <label className="block font-semibold mb-1">Name</label>
              <input
                type="text"
                value={selectedItem.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                value={selectedItem.description}
                onChange={(e) =>
                  handleEditChange("description", e.target.value)
                }
                className="w-full border p-2 rounded"
                rows={3}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Date</label>
              <input
                type="date"
                value={selectedItem.date?.split("T")[0] || ""}
                onChange={(e) => handleEditChange("date", e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">
                Replace Images (optional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleEditImageChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
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

      {/* ---------------- Delete Modal ---------------- */}
      <Modal
        isOpen={modalDeleteOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Portfolio"
        className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
      >
        {selectedItem && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete “{selectedItem.name}”?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
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
