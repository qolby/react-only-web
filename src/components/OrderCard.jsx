import { useState } from 'react';
import { IoMdStopwatch } from 'react-icons/io';
import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import PaymentModal from './PaymentModal';
import { LuClipboardCheck } from 'react-icons/lu';

const OrderCard = ({ order, onUpdateStatus, onPayBill }) => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState(order.status);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amountPaid, setAmountPaid] = useState('');

  const handleStatusChange = () => {
    onUpdateStatus(order.id, newStatus);
    setShowStatusModal(false); // Close modal after saving
  };

  const handlePayBill = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (amountToPay) => {
    onPayBill(order.id, amountToPay);
    setShowPaymentModal(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!order || !order.items) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white w-full p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="flex flex-row justify-between border-b pb-4 mb-4">
        <div>
          <h2 className="font-bold text-lg text-neutral-900">
            {order.customerName}
          </h2>
          <p className="text-sm text-neutral-600">
            Order #{order.orderNumber} / {order.orderType}
          </p>
          <p className="text-sm text-neutral-600">{order.date}</p>
        </div>
        <div className="flex flex-col items-end">
          <p
            className={`py-1 px-3 flex items-center gap-1 rounded-full text-xs font-medium ${
              order.status === 2
                ? 'bg-secondary-100 text-primary-900'
                : order.status === 1
                ? 'bg-yellow-300 text-secondary-900'
                : 'bg-blue-300 text-black'
            }`}
          >
            <span>
              {order.status === 2 ? (
                <IoCheckmarkDoneOutline size={16} />
              ) : order.status === 1 ? (
                <IoMdStopwatch size={16} />
              ) : (
                <LuClipboardCheck size={16} />
              )}
            </span>
            {order.status === 1
              ? 'In Progress'
              : order.status === 2
              ? 'Ready'
              : 'Completed'}
          </p>
          <p className="text-sm text-neutral-600 mt-1">{order.time}</p>
        </div>
      </div>
      <div className="flex flex-row justify-between mb-4 border-b pb-4 max-h-32 overflow-auto flex-grow flex-shrink-1">
        <div className="w-40">
          <h3 className="font-medium text-neutral-700 mb-1">Items</h3>
          {order.items.map((item, index) => (
            <p className="text-sm text-neutral-600 mb-1" key={index}>
              {item.name}
            </p>
          ))}
        </div>
        <div className="text-center">
          <h3 className="font-medium text-neutral-700 mb-1">Qty</h3>
          {order.items.map((item, index) => (
            <p className="text-sm text-neutral-600" key={index}>
              {item.quantity}
            </p>
          ))}
        </div>
        <div className="text-right">
          <h3 className="font-medium text-neutral-700 mb-1">Price</h3>
          {order.items.map((item, index) => (
            <p className="text-sm text-neutral-600" key={index}>
              {formatPrice(item.price)}
            </p>
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-between mb-4">
        <h2 className="font-semibold text-neutral-900">Total</h2>
        <h2 className="font-semibold text-neutral-900">
          {formatPrice(order.total)}
        </h2>
      </div>
      <div className="flex flex-row justify-between mt-4">
        <button
          onClick={() => setShowStatusModal(true)}
          className={`${
            order.status === 3
              ? 'bg-gray-300 text-black cursor-not-allowed'
              : 'bg-neutral-200 text-gray-800 hover:bg-neutral-300 transition-colors'
          }  py-2 px-4 rounded-md shadow-sm `}
          disabled={order.status === 3}
        >
          Change Status
        </button>
        <button
          onClick={handlePayBill}
          className={`${
            order.payment === 2
              ? 'bg-gray-300 text-black cursor-not-allowed'
              : 'bg-secondary-300 text-white hover:bg-secondary-500'
          }  py-2 px-4 rounded-md shadow-sm transition-colors`}
          disabled={order.payment === 2}
        >
          Pay Bills
        </button>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Change Order Status</h2>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(parseInt(e.target.value))}
              className="block w-full p-2 border border-gray-300 rounded mb-4"
            >
              <option value="1">In Progress</option>
              <option value="2">Ready</option>
              <option value="3">Completed</option>
            </select>
            <div className="flex justify-end">
              <button
                onClick={handleStatusChange}
                className="bg-primary-500 text-white py-2 px-4 rounded-md shadow-sm mr-2 hover:bg-primary-600"
              >
                Save
              </button>
              <button
                onClick={() => setShowStatusModal(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md shadow-sm hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          totalAmount={order.total}
          onClose={() => setShowPaymentModal(false)}
          onSubmit={handlePaymentSubmit}
        />
      )}
    </div>
  );
};

export default OrderCard;
