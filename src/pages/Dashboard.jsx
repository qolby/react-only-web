import React, { useEffect, useState } from 'react';
import {
  FaDollarSign,
  FaClipboardList,
  FaUtensils,
  FaQuoteLeft,
} from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [report, setReport] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    inProgress: 0,
    ready: 0,
    completed: 0,
  });
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('http://localhost:8000/orders');
      const data = await response.json();
      setOrders(data);

      // Calculate report data
      const totalOrders = data.length;
      const inProgress = data.filter((order) => order.status === 1).length;
      const ready = data.filter((order) => order.status === 2).length;
      const completed = data.filter((order) => order.status === 3).length;
      const totalRevenue = data.reduce((sum, order) => sum + order.total, 0);

      setReport({
        totalOrders,
        inProgress,
        ready,
        completed,
        totalRevenue,
      });

      // Calculate monthly revenue
      const revenueByMonth = Array(12).fill(0);
      data.forEach((order) => {
        const orderDate = new Date(order.date);
        const month = orderDate.getMonth();
        revenueByMonth[month] += order.total;
      });
      setMonthlyRevenue(revenueByMonth);
    };

    const fetchMenuItems = async () => {
      const response = await fetch('http://localhost:8000/menus');
      const data = await response.json();
      setMenuItems(data);
    };

    fetchOrders();
    fetchMenuItems();
  }, []);

  const revenueChartData = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        label: 'Revenue',
        data: monthlyRevenue,
        backgroundColor: '#36A2EB',
        hoverBackgroundColor: '#36A2EB',
      },
    ],
  };

  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-bold mb-4">Dashboard</h1> */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md flex items-center">
          <FaDollarSign size={40} className="mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Total Revenue</h2>
            <p className="text-2xl">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(report.totalRevenue)}
            </p>
          </div>
        </div>
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex items-center">
          <FaClipboardList size={40} className="mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Order Status</h2>
            <p className="text-sm">In Progress: {report.inProgress}</p>
            <p className="text-sm">Ready: {report.ready}</p>
            <p className="text-sm">Completed: {report.completed}</p>
          </div>
        </div>
        <div className="bg-orange-500 text-white p-6 rounded-lg shadow-md flex items-center">
          <FaUtensils size={40} className="mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Menu Available</h2>
            <p className="text-2xl">{menuItems.length}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Bar data={revenueChartData} />
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md flex items-center">
          <FaQuoteLeft size={30} className="mr-4 text-gray-500" />
          <div>
            <h2 className="text-xl font-semibold">Quote of the Day</h2>
            <p className="text-lg italic">
              "The only way to do great work is to love what you do." - Steve
              Jobs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
