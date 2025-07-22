"use client";

import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  isConfirming?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  isConfirming = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    // ✨ FIX: Changed bg-opacity-60 to bg-opacity-50 for more transparency.
    // You can use other values like bg-opacity-40 or bg-opacity-75 to adjust it.
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 backdrop-blur-sm"
    >
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        <div className="mb-6 text-gray-600">{children}</div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={isConfirming}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirming}
            className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-yellow-800 disabled:bg-yellow-400 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isConfirming ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Confirming...
              </>
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}