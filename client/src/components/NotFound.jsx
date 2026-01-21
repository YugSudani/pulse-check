import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F17] px-6">
      <div className="w-full max-w-lg text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-300">
            404
          </h1>
        </div>

        {/* Error Card */}
        <div className="bg-[#0D121C] p-8 rounded-2xl shadow-xl border border-gray-800">
          <h2 className="text-3xl font-bold text-white mb-4">
            Page Not Found<span className="text-green-500">.</span>
          </h2>
          
          <p className="text-gray-400 mb-8 text-lg">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1 , {replace: true})}
              className="px-6 py-3 bg-[#121A28] border border-gray-700 rounded-lg text-gray-300 font-semibold hover:bg-[#1a2332] transition"
            >
              Go Back
            </button>
            
            <button
              onClick={() => navigate("/", { replace: true })}
              className="px-6 py-3 bg-green-500 rounded-lg text-black font-semibold hover:bg-green-400 transition"
            >
              Go to Home
            </button>
          </div>
        </div>

        {/* Optional: Fun illustration or icon */}
        <div className="mt-8 text-gray-600">
          <svg
            className="w-24 h-24 mx-auto opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}