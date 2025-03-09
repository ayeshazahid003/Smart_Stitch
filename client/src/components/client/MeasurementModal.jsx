import React from "react";
import ReactModal from "react-modal";

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
          onClick={() => setMeasurementTab("select")}
          className={`px-4 py-2 rounded-md transition ${
            measurementTab === "select"
              ? "bg-[#111827] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Select Existing
        </button>
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
      </div>

      {/* Modal Content */}
      {measurementTab === "select" && (
        <div className="mb-6">
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

      {measurementTab === "new" && (
        <div className="space-y-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Measurement Name
            </label>
            <input
              type="text"
              value={newMeasurement.name}
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
                value={newMeasurement.height}
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
                value={newMeasurement.chest}
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
                value={newMeasurement.waist}
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
                value={newMeasurement.hips}
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
                  value={newMeasurement.lowerBodyLength || ""}
                  onChange={(e) =>
                    setNewMeasurement({
                      ...newMeasurement,
                      lowerBodyLength: e.target.value,
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
                  value={newMeasurement.lowerBodyWaist || ""}
                  onChange={(e) =>
                    setNewMeasurement({
                      ...newMeasurement,
                      lowerBodyWaist: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Inseam (cm)
                </label>
                <input
                  type="number"
                  value={newMeasurement.lowerBodyInseam || ""}
                  onChange={(e) =>
                    setNewMeasurement({
                      ...newMeasurement,
                      lowerBodyInseam: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Thigh (cm)
                </label>
                <input
                  type="number"
                  value={newMeasurement.lowerBodyThigh || ""}
                  onChange={(e) =>
                    setNewMeasurement({
                      ...newMeasurement,
                      lowerBodyThigh: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#111827]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ankle (cm)
                </label>
                <input
                  type="number"
                  value={newMeasurement.lowerBodyAnkle || ""}
                  onChange={(e) =>
                    setNewMeasurement({
                      ...newMeasurement,
                      lowerBodyAnkle: e.target.value,
                    })
                  }
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
