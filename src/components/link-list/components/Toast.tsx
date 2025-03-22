import { ToastType } from '../hooks/useToast';

interface ToastProps {
  visible: boolean;
  message: string;
  type: ToastType;
}

export const Toast = ({ visible, message, type }: ToastProps) => {
  if (!visible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 rounded-md px-4 py-2 shadow-lg transform transition-all duration-300 ${
        type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
        type === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
        'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
      } animate-fade-in`}
    >
      <div className="flex items-center">
        {type === 'success' && (
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {type === 'error' && (
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {type === 'info' && (
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {message}
      </div>
    </div>
  );
};