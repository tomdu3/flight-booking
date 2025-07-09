import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <div className="flex justify-center mb-4">
        <FaExclamationTriangle className="text-6xl text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 mb-6">
        {message || 'An unexpected error occurred. Please try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary flex items-center mx-auto"
        >
          <FaRedo className="mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};