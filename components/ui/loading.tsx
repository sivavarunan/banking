const Loading = ({ message }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div className="w-64 h-2 bg-blue-200 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-blue-500 animate-progress-bar"></div>
      </div>
      <p className="mt-2 text-lg font-medium text-blue-700">
        {message || "Loading..."}
      </p>
    </div>
  );
};

export default Loading;
