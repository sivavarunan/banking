const Loading = ({ message }: { message?: string }) => {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
        {/* Spinner */}
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-blue-300 rounded-full border-t-transparent animate-spin"></div>
        </div>
  
        {/* Progress Bar */}
        <div className="w-64 h-2 bg-blue-200 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-blue-500 animate-progress-bar"></div>
        </div>
  
        {/* Loading Message */}
        <p className="mt-2 text-lg font-medium text-blue-700">
          {message || "Loading..."}
        </p>
      </div>
    );
  };
  
  export default Loading;
  