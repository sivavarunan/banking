const Loading = ({ message }: { message?: string }) => {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="loader"></div>
          <p className="mt-2 text-gray-500">{message || "Loading..."}</p>
        </div>
      </div>
    );
  };
  
  export default Loading;
  