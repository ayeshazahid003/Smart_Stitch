import { useNavigate } from "react-router";

const MeasurementAlert = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          No Measurements Found
        </h3>
        <p className="text-gray-600 mb-6">
          You need to add your measurements before proceeding with the order.
          Would you like to add them now?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate("/measurements")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Measurements
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeasurementAlert;
