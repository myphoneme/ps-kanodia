import { useEffect } from 'react';
import { CheckCircle, X, AlertCircle, Info, Trash2 } from 'lucide-react';

interface FlashMessageProps {
  message: string;
  type: 'add' | 'update' | 'delete' | 'error' | 'info' | '';
  onClose: () => void;
}

export function FlashMessage({ message, type, onClose }: FlashMessageProps) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'add':
      case 'update':
        return <CheckCircle className="w-5 h-5" />;
      case 'delete':
        return <Trash2 className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'add':
      case 'update':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'delete':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 border rounded-lg shadow-lg animate-in slide-in-from-right ${getStyles()}`}
      style={{ minWidth: '300px', maxWidth: '500px' }}
    >
      {getIcon()}
      <p className="flex-1 font-medium">{message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
