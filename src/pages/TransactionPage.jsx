import React, { useEffect, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ConfirmationModal = ({ show, onClose, onConfirm, total }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-md shadow-md w-96">
        <h2 className="text-lg font-bold mb-4">Confirm Order</h2>
        <p className="mb-4">Are you sure you want to place this order?</p>
        <div className="font-semibold text-xl mb-4 flex justify-between">
          Total: <span>{total}</span>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="bg-primary-500 text-white p-2 rounded"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="bg-gray-500 text-white p-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const TransactionPage = () => {
  const [menus, setMenus] = useState([]);
  const [order, setOrder] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState('Dine In');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [total, setTotal] = useState(0);
  const [menuStocks, setMenuStocks] = useState({});
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const categories = ['all', 'makanan', 'minuman'];

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const url =
    selectedCategory === 'all'
      ? 'http://localhost:8000/menus?_sort=name'
      : `http://localhost:8000/menus?_sort=name&category=${selectedCategory}`;

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setMenus(data);
        const stockMap = {};
        data.forEach((menu) => {
          stockMap[menu.id] = menu.stock;
        });
        setMenuStocks(stockMap);
      })
      .catch((error) => console.error('Error fetching menus:', error));
  }, [url]);

  const addItemToOrder = (menuItem) => {
    if (menuStocks[menuItem.id] === 0) {
      return;
    }

    const existingItem = order.find((item) => item.id === menuItem.id);
    if (existingItem) {
      setOrder(
        order.map((item) =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrder([...order, { ...menuItem, quantity: 1 }]);
    }
    setTotal((prevTotal) => prevTotal + Number(menuItem.price));
    setMenuStocks((prevStocks) => ({
      ...prevStocks,
      [menuItem.id]: prevStocks[menuItem.id] - 1,
    }));
  };

  const removeItemFromOrder = (menuItem) => {
    const existingItem = order.find((item) => item.id === menuItem.id);
    if (!existingItem) {
      return;
    }

    if (existingItem.quantity === 1) {
      setOrder(order.filter((item) => item.id !== menuItem.id));
    } else {
      setOrder(
        order.map((item) =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    }

    setTotal((prevTotal) => prevTotal - menuItem.price);
    setMenuStocks((prevStocks) => ({
      ...prevStocks,
      [menuItem.id]: prevStocks[menuItem.id] + 1,
    }));
  };

  const handleQuantityChange = (menuItem, increment) => {
    const currentStock = menuStocks[menuItem.id];

    if (increment > 0 && menuItem.quantity >= currentStock) {
      return;
    }

    const updatedOrder = order.map((item) =>
      item.id === menuItem.id
        ? {
            ...item,
            quantity: Math.max(0, item.quantity + increment),
          }
        : item
    );

    setOrder(updatedOrder.filter((item) => item.quantity > 0));

    const newTotal = updatedOrder.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(newTotal);

    const stockChange = increment > 0 ? -1 : 1;
    setMenuStocks((prevStocks) => ({
      ...prevStocks,
      [menuItem.id]: prevStocks[menuItem.id] + stockChange,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!customerName) newErrors.customerName = 'Customer name is required';
    if (order.length === 0)
      newErrors.order = 'At least one item must be added to the order';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const confirmOrder = () => {
    const newOrder = {
      customerName,
      orderNumber: Math.floor(Math.random() * 100000).toString(),
      orderType,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      items: order,
      total,
      status: 1,
      payment: 1,
    };

    const promises = order.map((item) => {
      const updatedStock = menuStocks[item.id];
      return fetch(`http://localhost:8000/menus/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: updatedStock }),
      });
    });

    Promise.all(promises)
      .then(() => {
        return fetch('http://localhost:8000/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newOrder),
        });
      })
      .then((response) => response.json())
      .then((data) => {
        navigate('/orders');
        toast.success(`New Order#${newOrder.orderNumber} has been placed`);
      })
      .catch((error) => console.error('Error placing order:', error));
  };

  const placeOrder = () => {
    if (!validateForm()) return;
    setShowModal(true);
  };

  return (
    <div className="flex flex-row gap-6 justify-center">
      <div className="flex-1">
        <div className="mb-4">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="p-2 rounded-md shadow-sm capitalize"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className={`border p-4 rounded-md cursor-pointer bg-white shadow-sm hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 ${
                menuStocks[menu.id] === 0
                  ? 'opacity-50 pointer-events-none'
                  : ''
              }`}
              onClick={() => menuStocks[menu.id] > 0 && addItemToOrder(menu)}
            >
              <h3 className="font-bold text-lg mb-2">{menu.name}</h3>
              <p className="text-gray-600 mb-2">{formatPrice(menu.price)}</p>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{menu.category}</p>
                <p className="text-sm text-gray-500">
                  {menuStocks[menu.id]} left
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-md shadow-md w-96 h-fit">
        <h2 className="text-lg font-bold mb-4">Order</h2>
        {errors.order && (
          <div className="mb-4 text-red-500">{errors.order}</div>
        )}
        <div className="mb-4">
          <label className="block mb-2">Customer Name:</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className={`border p-2 w-full rounded-md ${
              errors.customerName ? 'border-red-500' : ''
            }`}
            required
          />
          {errors.customerName && (
            <div className="text-red-500">{errors.customerName}</div>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2">Order Type:</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="border p-2 w-full rounded-md"
          >
            <option value="Dine In">Dine In</option>
            <option value="Take Away">Take Away</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Order List:</label>
          <div className="border p-4 rounded">
            {order.length > 0 ? (
              <div>
                {order.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center mb-4"
                  >
                    <div className="flex flex-col justify-start">
                      <span className="font-bold">{item.name}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                    <div className="flex justify-center items-center">
                      <span
                        onClick={() => handleQuantityChange(item, -1)}
                        className="bg-red-500 p-1 text-white hover:bg-red-600 active:bg-red-700 rounded-full cursor-pointer"
                      >
                        <FaMinus size={12} />
                      </span>

                      <span className="mx-2">{item.quantity}</span>

                      <span
                        onClick={() => handleQuantityChange(item, 1)}
                        className="bg-green-500 p-1 text-white hover:bg-green-600 active:bg-green-700 rounded-full cursor-pointer"
                      >
                        <FaPlus size={12} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No items in order</p>
            )}
          </div>
        </div>

        <div className="font-semibold text-xl mt-4 flex justify-between">
          Total: <span>{formatPrice(total)}</span>
        </div>
        <button
          className="bg-primary-500 text-white p-2 rounded mt-4 w-full"
          onClick={placeOrder}
        >
          Place Order
        </button>
      </div>

      <ConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmOrder}
        total={formatPrice(total)}
      />
    </div>
  );
};

export default TransactionPage;
