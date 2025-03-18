import React from 'react';
import { ToastState } from '../types';

interface ToastProps {
  toast: ToastState;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast.visible) return null;

  return (
    <div
      className={`absolute top-4 right-4 rounded-md px-4 py-2 shadow-lg transition-all transform animate-fade-in ${
        toast.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
        toast.type === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
        'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
      }`}
    >
      <div className="flex items-center">
        {toast.type === 'success' && (
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {toast.type === 'error' && (
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {toast.message}
      </div>
    </div>
  );
};