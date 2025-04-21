import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  createVoucher,
  updateVoucher,
  deleteVoucher,
  getAllVouchers,
} from "../../../hooks/voucherHooks";

export default function Vouchers() {
  /* ------------------------------------------------------------------ */
  /* State                                                              */
  /* ------------------------------------------------------------------ */
  const [vouchers, setVouchers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: "",
    validFrom: "",
    validUntil: "",
  });
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ------------------------------------------------------------------ */
  /* Fetch on mount                                                     */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllVouchers();
        if (res.success) setVouchers(res.vouchers);
        else toast.error(res.message || "Failed to fetch vouchers");
      } catch {
        toast.error("Error fetching vouchers");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ------------------------------------------------------------------ */
  /* Helpers                                                            */
  /* ------------------------------------------------------------------ */
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discount: "",
      validFrom: "",
      validUntil: "",
    });
    setEditingVoucher(null);
  };

  /* ------------------------------------------------------------------ */
  /* CRUD handlers                                                      */
  /* ------------------------------------------------------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, discount: Number(formData.discount) };
    try {
      let res;
      if (editingVoucher) {
        res = await updateVoucher(editingVoucher._id, data);
        if (res.success) {
          setVouchers((v) =>
            v.map((x) => (x._id === editingVoucher._id ? res.voucher : x))
          );
          toast.success("Voucher updated!");
        }
      } else {
        res = await createVoucher(data);
        if (res.success) {
          setVouchers((v) => [...v, res.voucher]);
          toast.success("Voucher created!");
        }
      }
      if (res?.success) {
        setIsModalOpen(false);
        resetForm();
      } else toast.error(res.message || "Something went wrong");
    } catch {
      toast.error("Failed to save voucher");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this voucher?")) return;
    try {
      const res = await deleteVoucher(id);
      if (res.success) {
        setVouchers((v) => v.filter((x) => x._id !== id));
        toast.success("Voucher deleted!");
      } else toast.error(res.message || "Failed to delete voucher");
    } catch {
      toast.error("Error deleting voucher");
    }
  };

  const handleEdit = (v) => {
    setEditingVoucher(v);
    setFormData({
      title: v.title,
      description: v.description || "",
      discount: v.discount,
      validFrom: new Date(v.validFrom).toISOString().split("T")[0],
      validUntil: new Date(v.validUntil).toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  /* ------------------------------------------------------------------ */
  /* UI                                                                  */
  /* ------------------------------------------------------------------ */
  if (loading)
    return (
      <div className="py-10 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Vouchers</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your discount vouchers for customers.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Add Voucher
          </button>
        </div>
      </div>

      {/* List */}
      <div className="mt-8 overflow-x-auto shadow ring-1 ring-gray-300 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              {["Title", "Discount", "Valid From", "Valid Until", ""].map(
                (h, i) => (
                  <th
                    key={i}
                    className={`py-3 px-4 text-left text-sm font-semibold text-gray-900 ${
                      i === 0 ? "sm:pl-6" : ""
                    }`}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vouchers.map((v) => (
              <tr key={v._id}>
                <td className="py-4 px-4 text-sm font-medium text-gray-900 sm:pl-6">
                  {v.title}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {v.discount}%
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {new Date(v.validFrom).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {new Date(v.validUntil).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-right text-sm font-medium space-x-4">
                  <button
                    onClick={() => handleEdit(v)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(v._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- Modal ---------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-50"
            onClick={() => {
              setIsModalOpen(false);
              resetForm();
            }}
          />
          {/* Card */}
          <div className="relative z-50 w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingVoucher ? "Edit Voucher" : "Create Voucher"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Valid From
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) =>
                      setFormData({ ...formData, validFrom: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) =>
                      setFormData({ ...formData, validUntil: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  {editingVoucher ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
