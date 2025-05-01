import React from "react";
import ReactModal from "react-modal";

// Update standard measurement data to match the expected structure
const standardSizes = {
  XS: {
    height: 160,
    chest: 84,
    waist: 68,
    hips: 90,
    shoulder: 40,
    wrist: 16,
    sleeves: 56,
    neck: 36,
    lowerBody: {
      length: 98,
      waist: 68,
      inseam: 76,
      thigh: 54,
      ankle: 36,
    },
  },
  S: {
    height: 165,
    chest: 88,
    waist: 73,
    hips: 94,
    shoulder: 42,
    wrist: 16.5,
    sleeves: 58,
    neck: 37,
    lowerBody: {
      length: 100,
      waist: 73,
      inseam: 78,
      thigh: 56,
      ankle: 37,
    },
  },
  M: {
    height: 170,
    chest: 96,
    waist: 80,
    hips: 100,
    shoulder: 44,
    wrist: 17,
    sleeves: 60,
    neck: 38,
    lowerBody: {
      length: 102,
      waist: 80,
      inseam: 80,
      thigh: 58,
      ankle: 38,
    },
  },
  L: {
    height: 175,
    chest: 104,
    waist: 88,
    hips: 106,
    shoulder: 46,
    wrist: 17.5,
    sleeves: 62,
    neck: 39,
    lowerBody: {
      length: 104,
      waist: 88,
      inseam: 82,
      thigh: 60,
      ankle: 39,
    },
  },
  XL: {
    height: 180,
    chest: 112,
    waist: 96,
    hips: 112,
    shoulder: 48,
    wrist: 18,
    sleeves: 64,
    neck: 40,
    lowerBody: {
      length: 106,
      waist: 96,
      inseam: 84,
      thigh: 62,
      ankle: 40,
    },
  },
  XXL: {
    height: 185,
    chest: 120,
    waist: 104,
    hips: 118,
    shoulder: 50,
    wrist: 18.5,
    sleeves: 66,
    neck: 41,
    lowerBody: {
      length: 108,
      waist: 104,
      inseam: 86,
      thigh: 64,
      ankle: 41,
    },
  },
};

const MeasurementModal = ({
  isOpen,
  onRequestClose,
  measurementTab,
  setMeasurementTab,
  existingMeasurements,
  tempSelectedMeasurementId,
  setTempSelectedMeasurementId,
  newMeasurement,
  setNewMeasurement,
  handleSaveMeasurement,
}) => {
  // Function to apply standard measurements
  const applyStandardSize = (size) => {
    setNewMeasurement({
      ...newMeasurement,
      ...standardSizes[size],
      name: newMeasurement.name || `Standard ${size}`,
    });
  };

  // Helper function to update nested lowerBody field
  const updateLowerBody = (field, value) => {
    setNewMeasurement({
      ...newMeasurement,
      lowerBody: {
        ...(newMeasurement.lowerBody || {}),
        [field]: value,
      },
    });
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Select or Add Measurement"
      overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center"
      className="relative w-full max-w-3xl mx-auto bg-white rounded-md shadow-lg p-6 outline-none max-h-[80vh] overflow-auto"
    >
      <h2 className="text-2xl font-bold text-[#111827] mb-6">Measurement</h2>

      {/* Tab Header */}
      <div className="flex space-x-4 mb-6">
        <button
          type="button"
          onClick={() => setMeasurementTab("new")}
          className={`px-4 py-2 rounded-md transition ${
            measurementTab === "new"
              ? "bg-[#111827] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Add New
        </button>
        <button
          type="button"
          onClick={() => setMeasurementTab("standard")}
          className={`px-4 py-2 rounded-md transition ${
            measurementTab === "standard"
              ? "bg-[#111827] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Standard Sizes
        </button>
      </div>

      {/* Modal Content */}
      {measurementTab === "select" && (
        <div className="mb-6">
          {/* Existing code for select tab */}
          {existingMeasurements.length > 0 ? (
            existingMeasurements.map((m) => (
              <label
                key={m.id}
                className="flex items-center space-x-3 mb-3 p-2 border rounded-md hover:bg-gray-50 transition"
              >
                <input
                  type="radio"
                  name="measurement"
                  checked={tempSelectedMeasurementId === m.id}
                  onChange={() => setTempSelectedMeasurementId(m.id)}
                  className="h-4 w-4 text-[#111827] focus:ring-[#111827]"
                />
                <span className="text-sm text-gray-800">
                  {m.name} (Height: {m.height} cm, Chest: {m.chest} cm, Waist:{" "}
                  {m.waist} cm, Hips: {m.hips} cm)
                </span>
              </label>
            ))
          ) : (
            <p className="text-gray-600">
              No existing measurements. Please add a new measurement.
            </p>
          )}
        </div>
      )}

      {measurementTab === "standard" && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">
            Select a standard size to automatically fill the measurement fields.
            You can adjust individual values after selecting.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Size</th>
                  <th className="border border-gray-300 px-4 py-2">Height</th>
                  <th className="border border-gray-300 px-4 py-2">Chest</th>
                  <th className="border border-gray-300 px-4 py-2">Waist</th>
                  <th className="border border-gray-300 px-4 py-2">Hips</th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(standardSizes).map(([size, measurements]) => (
                  <tr key={size} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">
                      {size}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {measurements.height} cm
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {measurements.chest} cm
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {measurements.waist} cm
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {measurements.hips} cm
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => {
                          applyStandardSize(size);
                          setMeasurementTab("new"); // Switch to the new tab to show filled values
                        }}
                        className="bg-[#111827] text-white px-3 py-1 rounded-md text-sm hover:bg-[#1f2937] transition"
                      >
                        Use This Size
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Note: These are standard measurements based on general sizing
            charts. Individual fit may vary.
          </p>
        </div>
      )}

      {measurementTab === "new" && (
        <div className="space-y-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Measurement Name
            </label>
            <input
              type="text"
              value={newMeasurement.name || ""}
              onChange={(e) =>
                setNewMeasurement({
                  ...newMeasurement,
                  name: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                value={newMeasurement.height || ""}
                onChange={(e) =>
                  setNewMeasurement({
                    ...newMeasurement,
                    height: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Chest (cm)
              </label>
              <input
                type="number"
                value={newMeasurement.chest || ""}
                onChange={(e) =>
                  setNewMeasurement({
                    ...newMeasurement,
                    chest: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Waist (cm)
              </label>
              <input
                type="number"
                value={newMeasurement.waist || ""}
                onChange={(e) =>
                  setNewMeasurement({
                    ...newMeasurement,
                    waist: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Hips (cm)
              </label>
              <input
                type="number"
                value={newMeasurement.hips || ""}
                onChange={(e) =>
                  setNewMeasurement({
                    ...newMeasurement,
                    hips: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Shoulder (cm)
              </label>
              <input
                type="number"
                value={newMeasurement.shoulder || ""}
                onChange={(e) =>
                  setNewMeasurement({
                    ...newMeasurement,
                    shoulder: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Wrist (cm)
              </label>
              <input
                type="number"
                value={newMeasurement.wrist || ""}
                onChange={(e) =>
                  setNewMeasurement({
                    ...newMeasurement,
                    wrist: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Sleeves (cm)
              </label>
              <input
                type="number"
                value={newMeasurement.sleeves || ""}
                onChange={(e) =>
                  setNewMeasurement({
                    ...newMeasurement,
                    sleeves: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Neck (cm)
              </label>
              <input
                type="number"
                value={newMeasurement.neck || ""}
                onChange={(e) =>
                  setNewMeasurement({
                    ...newMeasurement,
                    neck: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]"
              />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2 text-gray-800">
              Lower Body Measurements
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Length (cm)
                </label>
                <input
                  type="number"
                  value={newMeasurement.lowerBody?.length || ""}
                  onChange={(e) => updateLowerBody("length", e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Waist (cm)
                </label>
                <input
                  type="number"
                  value={newMeasurement.lowerBody?.waist || ""}
                  onChange={(e) => updateLowerBody("waist", e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Inseam (cm)
                </label>
                <input
                  type="number"
                  value={newMeasurement.lowerBody?.inseam || ""}
                  onChange={(e) => updateLowerBody("inseam", e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Thigh (cm)
                </label>
                <input
                  type="number"
                  value={newMeasurement.lowerBody?.thigh || ""}
                  onChange={(e) => updateLowerBody("thigh", e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ankle (cm)
                </label>
                <input
                  type="number"
                  value={newMeasurement.lowerBody?.ankle || ""}
                  onChange={(e) => updateLowerBody("ankle", e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleSaveMeasurement}
          className="bg-[#111827] text-white px-4 py-2 rounded-md hover:bg-[#1f2937] transition"
        >
          Save Measurement
        </button>
        <button
          type="button"
          onClick={onRequestClose}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </ReactModal>
  );
};
export default MeasurementModal;
