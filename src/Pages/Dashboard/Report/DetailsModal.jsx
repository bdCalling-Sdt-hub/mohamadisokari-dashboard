import { Modal } from "antd";
import { baseURL } from "../../../utils/BaseURL";

function DetailsModal({ isModalOpen, setIsModalOpen, data }) {
  // Check if data is available
  if (!data) {
    return null;
  }

  // Extract relevant information from the data object
  const {
    _id: reportId, // Use `_id` as Report ID
    status,
    type,
    reason,
    location,
    image,
    createdAt,
    updatedAt,
  } = data;

  // Format dates for display
  const createdDate = new Date(createdAt).toLocaleDateString();
  const updatedDate = new Date(updatedAt).toLocaleDateString();

  return (
    <Modal
      centered
      width={700}
      title="Report Details"
      visible={isModalOpen}
      footer={null}
      onCancel={() => setIsModalOpen(false)}
    >
      <div className="space-y-3">
        {/* Basic Information Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Report ID:</strong> {reportId || "N/A"}</p>
            <p><strong>Type:</strong> {type ? type.charAt(0).toUpperCase() + type.slice(1) : "N/A"}</p>
          </div>
          <div>
            <p><strong>Status:</strong> <span className="capitalize">{status || "N/A"}</span></p>
            <p><strong>Location:</strong> {location ? location.charAt(0).toUpperCase() + location.slice(1) : "N/A"}</p>
          </div>
        </div>

        {/* Dates Section */}
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Created:</strong> {createdDate || "N/A"}</p>
          <p><strong>Last Updated:</strong> {updatedDate || "N/A"}</p>
        </div>

        {/* Description Section */}
        <div className="mt-3">
          <p className="mb-2 font-medium">Reason for Report:</p>
          <div className="border rounded-md p-3 bg-gray-50">
            <p>{reason || "No reason provided"}</p>
          </div>
        </div>

        {/* Product Image Section */}
        <div className="mt-3">
          <p className="mb-2 font-medium">Product Image:</p>
          <div className="border rounded-md p-2 flex justify-center">
            {image ? (
              <img
                src={`${baseURL}${image}`}
                alt="Reported product"
                className="max-h-60 object-contain"
              />
            ) : (
              <p>No image available</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default DetailsModal;