import { useState } from 'react';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import ConfirmationModal from './ConfirmationModal';

const MenuCard = ({ menu, onEdit, onDelete }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDelete = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    onDelete(menu.id); // Pass menu id to delete handler
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="relative bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{menu.name}</h2>
          <p className="text-sm text-gray-600">{menu.category}</p>
        </div>
        <div className="flex flex-col gap-1">
          <button
            className="bg-red-500 text-white hover:bg-red-600 rounded-md p-1"
            onClick={handleDelete} // Open confirmation modal on delete click
          >
            <HiOutlineTrash />
          </button>
          <button
            className="bg-secondary-300 text-white hover:bg-secondary-500 rounded-md p-1"
            onClick={() => onEdit(menu)} // Open edit form modal on delete click
          >
            <HiOutlinePencil />
          </button>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-700">
          <span className="font-medium">{formatPrice(menu.price)}</span>
        </p>
        <p className="text-sm text-gray-700">
          Stock: <span className="font-medium">{menu.stock}</span>
        </p>
      </div>
      {/* Confirmation modal for delete */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${menu.name}?`}
      />
    </div>
  );
};

export default MenuCard;
