import React, { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import OrderCard from '../components/OrderCard';
import { toast } from 'react-toastify';

const OrderPage = () => {
  const categories = ['all', 'on process', 'completed'];
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [orders, setOrders] = useState([]);
  const dateToday = new Date();
  console.log(dateToday.toISOString().split('T')[0]);

  useEffect(() => {
    const fetchOrders = async () => {
      const url =
        activeCategory === 'all'
          ? `http://localhost:8000/orders?_sort=status,payment&_order=desc,asc&date=${
              dateToday.toISOString().split('T')[0]
            }`
          : activeCategory === 'completed'
          ? `http://localhost:8000/orders?status=3&date=${
              dateToday.toISOString().split('T')[0]
            }`
          : `http://localhost:8000/orders?status=1,2&date=${
              dateToday.toISOString().split('T')[0]
            }`;

      const response = await fetch(url);
      const data = await response.json();
      setOrders(data);
    };

    fetchOrders();
  }, [activeCategory]);

  const handleUpdateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    // console.log(orderId);
    // Assuming you have an API or method to update db.json
    fetch(`http://localhost:8000/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to change order status');
        }
      })
      .then((data) => {
        if (newStatus === 3) {
          toast.success(`Order completed successfully!`);
        } else if (newStatus === 2) {
          toast.success('Order is ready!');
        }
      })
      .catch((error) => console.error('Error updating order status:', error));

    // For demonstration purpose, simulate updating state
    setOrders(updatedOrders);
  };

  const handlePayBill = (orderId, amountToPay) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, payment: 2 } : order
    );

    // Update state with new orders array
    setOrders(updatedOrders);

    // For demonstration purpose, you would typically send an API request to update db.json
    fetch(`http://localhost:8000/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payment: 2 }),
    }).then((data) => {
      toast.success('Payment processed successfully!');
    });
  };

  // const url =
  //   activeCategory === 'all'
  //     ? 'http://localhost:8000/orders'
  //     : `http://localhost:8000/orders?status=${activeCategory}`;

  // const { data: orders, isPending, error, refetch } = useFetch(url);

  // useEffect(() => {
  //   refetch(); // Trigger refetch when activeCategory changes
  // }, [activeCategory, refetch]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between mb-6">
        <div className="grid grid-flow-col gap-3">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(category)}
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
      </div>
      <div className="my-4">
        {orders && orders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
                onPayBill={handlePayBill}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No orders available</p>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
