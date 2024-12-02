'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

const Error = ({ error, reset }: ErrorProps) => {
  const router = useRouter();

  useEffect(() => {
    console.error(error); // Log the error to the console for debugging
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-700">
      <h1 className="text-3xl font-semibold text-red-500">Something went wrong!</h1>
      <p className="mt-4 text-lg text-center">
        We encountered an unexpected error. Please try again or contact support if the problem persists.
      </p>
      <div className="mt-6 space-x-4">
        <button
          onClick={reset}
          className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-100"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Error;
