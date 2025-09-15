import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReportPage = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [paidOrders, setPaidOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(
        `http://localhost:8000/orders?date=${
          startDate.toISOString().split('T')[0]
        }`
      );
      const data = await response.json();

      const paidOrders = data.filter((order) => order.payment === 2); // Assuming payment status 2 means paid
      const completedOrders = data.filter(
        (order) => order.status === 'Completed'
      );

      setPaidOrders(paidOrders);
      setCompletedOrders(completedOrders);
    };

    fetchOrders();
  }, [startDate]);

  return (
    <div className="">
      <div className="flex justify-end items-center mb-6">
        <label className="mr-4">Select Date:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="dd/MM/yyyy"
          className="p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-6">
        {paidOrders.length > 0 ? (
          <ul className="divide-y divide-gray-200 bg-white p-4 rounded-md shadow-sm">
            {paidOrders.map((order) => (
              <li key={order.id} className="py-4">
                <div className="flex justify-between hover:bg-neutral-50">
                  <div>
                    <p className="text-lg font-semibold">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-600">Date: {order.date}</p>
                    <p className="text-sm text-gray-600">Time: {order.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 text-right">Total</p>
                    <p className="text-lg font-semibold text-right">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            No reports found for selected date.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReportPage;

// Function to format price with currency
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
};
