import React from "react";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-lg w-full relative border border-white/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-lg"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default EditModal;
