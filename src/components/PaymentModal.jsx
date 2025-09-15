import React, { useState } from 'react';
import { toast } from 'react-toastify';

const PaymentModal = ({ totalAmount, onClose, onSubmit }) => {
  const [amountToPay, setAmountToPay] = useState('');
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeAmount, setChangeAmount] = useState(0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePay = () => {
    const paid = parseFloat(amountToPay);
    if (paid >= totalAmount) {
      const change = paid - totalAmount;
      setChangeAmount(change);
      setShowChangeModal(true);
    } else {
      toast.error(
        'Please ensure the total payment meets or exceeds the due amount.'
      );
      // onSubmit(amountToPay);
      // onClose();
    }
  };

  const handleConfirmChange = () => {
    onSubmit(amountToPay);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Payment</h2>
        <p className="mb-2">
          Total Amount:{' '}
          <span className="text-lg font-bold">{formatPrice(totalAmount)}</span>
        </p>
        <input
          type="number"
          value={amountToPay}
          onChange={(e) => setAmountToPay(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter amount to pay"
        />
        <div className="flex justify-end">
          <button
            onClick={handlePay}
            className="bg-primary-500 text-white py-2 px-4 rounded-md shadow-sm mr-2 hover:bg-primary-600"
          >
            Pay
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md shadow-sm hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Change Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Change Amount</h2>
            <p>
              Change:{' '}
              <span className="text-lg font-bold">
                {formatPrice(changeAmount)}
              </span>
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleConfirmChange}
                className="bg-primary-500 text-white py-2 px-4 rounded-md shadow-sm mr-2 hover:bg-primary-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowChangeModal(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md shadow-sm hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentModal;
