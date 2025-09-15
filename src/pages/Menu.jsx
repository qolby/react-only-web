import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import MenuCard from '../components/MenuCard';
import MenuFormModal from '../components/MenuFormModal';
import { toast } from 'react-toastify';

const Menu = () => {
  const categories = ['all', 'makanan', 'minuman'];

  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const [isUpdate, setIsUpdate] = useState(false);
  const [editMenu, setEditMenu] = useState(null);

  const url =
    activeCategory === 'all'
      ? 'http://localhost:8000/menus?_sort=name'
      : `http://localhost:8000/menus?_sort=name&category=${activeCategory}`;

  const { data: menus, isPending, error, refetch } = useFetch(url);

  useEffect(() => {
    if (isUpdate) {
      refetch(); // Trigger refetch when isUpdate is true
      setIsUpdate(false); // Reset isUpdate after refetching
      setEditMenu(null);
    }
  }, [isUpdate, refetch]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setIsUpdate(true);
  };

  const handleEditMenu = (menu) => {
    setEditMenu(menu);
    setIsModalOpen(true);
  };

  const handleDeleteMenu = (menuId) => {
    // Implement delete logic here
    fetch(`http://localhost:8000/menus/${menuId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete menu item');
        }
        console.log('Menu item deleted successfully');
        toast.success('Menu item has been deleted');
        refetch(); // Refresh menu list after deletion
      })
      .catch((error) => {
        console.error('Error deleting menu item:', error);
        // Handle error state or display error message to the user
      });
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between mb-6">
        <div className="grid grid-flow-col gap-3">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategoryChange(category)}
              className={`${
                activeCategory === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-white hover:bg-neutral-100'
              } py-1.5 px-3.5 rounded-md shadow-sm cursor-pointer capitalize`}
            >
              {category}
            </button>
          ))}
        </div>
        <div
          onClick={() => setIsModalOpen(true)}
          className={`${
            isModalOpen
              ? 'bg-primary-500 text-white'
              : 'bg-white hover:bg-neutral-100'
          } active:bg-primary-500 active:text-white py-1.5 px-3.5 rounded-md shadow-sm cursor-pointer`}
        >
          Add Menu
        </div>
      </div>
      <div className="my-4">
        {menus && menus.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4">
            {menus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                onEdit={handleEditMenu}
                onDelete={handleDeleteMenu}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No menus available</p>
        )}
      </div>
      {isOpen && <MenuFormModal setIsOpen={setIsOpen} />}
      <MenuFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={() => setIsUpdate(true)}
        editMenu={editMenu}
      />{' '}
      {/* Add the modal */}
      {/* Confirmation modal for delete */}
      {/* <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {
          handleDeleteMenu(selectedMenu.id); // Pass selected menu id to delete handler
          setIsConfirmModalOpen(false);
        }}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${
          selectedMenu?.name || 'this menu'
        }?`} */}
      {/* /> */}
    </div>
  );
};

export default Menu;
