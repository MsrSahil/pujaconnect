import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

export const Alert = ({ type = 'info', message, onClose }) => {
  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />,
    error: <XCircle className="w-5 h-5 mr-2 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />,
    info: <Info className="w-5 h-5 mr-2 text-blue-500" />,
  };

  if (!message) return null;

  return (
    <div className={`flex items-start p-4 border rounded-lg shadow-sm mb-4 ${styles[type]}`}>
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 ml-3 text-sm font-medium">{message}</div>
      {onClose && (
        <button onClick={onClose} className="ml-auto pl-3 text-gray-400 hover:text-gray-600 focus:outline-none">
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
