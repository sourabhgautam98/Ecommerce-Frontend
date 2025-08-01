import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

const Popup = ({ onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const autoClose = setTimeout(() => {
      handleClose();
    }, 2000); 

    return () => clearTimeout(autoClose);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    visible && (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-300">
        <div className="relative bg-white shadow-xl rounded-xl p-6 w-80 border border-gray-200">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            aria-label="Close"
          >
            <FiX size={22} />
          </button>
          <h2 className="text-lg font-semibold text-yellow-600 mb-2">Server is Slow</h2>
          <p className="text-sm text-gray-700">
            This application uses a free server. Responses may take a few seconds.
          </p>
          <button
            onClick={handleClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition w-full"
          >
            Okay
          </button>
        </div>
      </div>
    )
  );
};

export default Popup;
