import { useEffect, useState } from 'react';
import { CheckCircle, X, AlertCircle, Info, Trash2, Send } from 'lucide-react';

interface FlashMessageProps {
  message: string;
  type: 'add' | 'update' | 'delete' | 'error' | 'info' | '';
  onClose: () => void;
}

export function FlashMessage({ message, type, onClose }: FlashMessageProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'add':
        return <Send className="w-5 h-5" />;
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
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-800';
      case 'update':
        return 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300 text-blue-800';
      case 'delete':
        return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300 text-red-800';
      case 'error':
        return 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300 text-red-800';
      case 'info':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'add':
        return 'Success!';
      case 'update':
        return 'Updated!';
      case 'delete':
        return 'Deleted!';
      case 'error':
        return 'Error!';
      case 'info':
        return 'Info';
      default:
        return '';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-start gap-3 p-4 border-2 rounded-xl shadow-2xl transition-all duration-300 ${getStyles()} ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
      style={{ minWidth: '320px', maxWidth: '500px' }}
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1">
        <h4 className="font-bold text-sm mb-1">{getTitle()}</h4>
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(), 300);
        }}
        className="flex-shrink-0 p-1.5 hover:bg-black hover:bg-opacity-10 rounded-lg transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
