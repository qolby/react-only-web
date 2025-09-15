const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-700 mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            className="mr-4 py-2 px-4 bg-red-500 text-white rounded-md"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="py-2 px-4 bg-gray-500 text-white rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
