import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const MenuFormModal = ({ isOpen, onClose, onAdd, editMenu }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editMenu) {
      setName(editMenu.name);
      setPrice(editMenu.price.toString());
      setStock(editMenu.stock.toString());
      setCategory(editMenu.category);
    } else {
      resetForm();
    }
  }, [editMenu]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setStock('');
    setCategory('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name) newErrors.name = 'Name is required';
    if (!price) newErrors.price = 'Price is required';
    if (!stock) newErrors.stock = 'Stock is required';
    if (!category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newMenu = { name, price, stock, category };

    fetch('http://localhost:8000/menus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMenu),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add new menu item');
        }
        return response.json();
      })
      .then((data) => {
        console.log('New menu added successfully:', data);
        toast.success('New menu is added');
        onAdd();
        onClose();
      })
      .catch((error) => {
        console.error('Error adding new menu item:', error);
        setErrors({ submit: 'Failed to add new menu item. Please try again.' });
      });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedMenu = {
      id: editMenu.id,
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
    };

    fetch(`http://localhost:8000/menus/${updatedMenu.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedMenu),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update menu item');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Menu updated successfully:', data);
        toast.success('Menu edited successfully');
        onAdd();
        onClose();
      })
      .catch((error) => {
        console.error('Error updating menu item:', error);
        setErrors({ submit: 'Failed to update menu item. Please try again.' });
      });
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
        <h2 className="text-xl font-semibold mb-4">
          {editMenu ? 'Edit' : 'Add New'} Menu
        </h2>
        {errors.submit && (
          <div className="mb-4 text-red-500">{errors.submit}</div>
        )}
        <form onSubmit={editMenu ? handleEdit : handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-md`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Price</label>
            <input
              type="number"
              className={`w-full px-3 py-2 border ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              } rounded-md`}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {errors.price && (
              <span className="text-red-500 text-sm">{errors.price}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Stock</label>
            <input
              type="number"
              className={`w-full px-3 py-2 border ${
                errors.stock ? 'border-red-500' : 'border-gray-300'
              } rounded-md`}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            {errors.stock && (
              <span className="text-red-500 text-sm">{errors.stock}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-3 py-2 border ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring focus:border-blue-500`}
            >
              <option value=""></option>
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
            </select>
            {errors.category && (
              <span className="text-red-500 text-sm">{errors.category}</span>
            )}
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="mr-4 py-2 px-4 bg-primary-500 text-white rounded-md"
            >
              {editMenu ? 'Edit' : 'Add'} Menu
            </button>
            <button
              type="button"
              className="py-2 px-4 bg-gray-500 text-white rounded-md"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuFormModal;
