export default function CookingLoader() {
    return (
        <div className="flex items-center justify-center h-screen bg-[#101724]">
            <div className="flex flex-col items-center gap-6">
                {/* Cooking pot animation */}
                <div className="relative">
                    {/* Steam bubbles */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-bounce [animation-delay:0s]"></div>
                        <div className="w-2 h-2 bg-blue-300 rounded-full opacity-60 animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                    
                    {/* Pot */}
                    <div className="relative w-20 h-16 bg-gradient-to-b from-gray-600 to-gray-700 rounded-b-2xl border-4 border-gray-500">
                        {/* Pot lid */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-gradient-to-b from-gray-500 to-gray-600 rounded-full border-2 border-gray-400 animate-pulse"></div>
                        
                        {/* Pot handle - left */}
                        <div className="absolute left-0 top-1/2 -translate-x-3 -translate-y-1/2 w-3 h-8 border-l-4 border-t-4 border-b-4 border-gray-500 rounded-l-full"></div>
                        
                        {/* Pot handle - right */}
                        <div className="absolute right-0 top-1/2 translate-x-3 -translate-y-1/2 w-3 h-8 border-r-4 border-t-4 border-b-4 border-gray-500 rounded-r-full"></div>
                        
                        {/* Bubbling content inside */}
                        <div className="absolute inset-2 bg-blue-500 bg-opacity-20 rounded-b-xl overflow-hidden">
                            <div className="w-full h-full relative">
                                <div className="absolute bottom-0 w-2 h-2 bg-blue-400 rounded-full opacity-70 animate-ping"></div>
                                <div className="absolute bottom-0 right-2 w-2 h-2 bg-blue-300 rounded-full opacity-70 animate-ping [animation-delay:0.3s]"></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Heat waves under pot */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                        <div className="w-1 h-4 bg-orange-500 rounded-full opacity-60 animate-pulse"></div>
                        <div className="w-1 h-5 bg-red-500 rounded-full opacity-60 animate-pulse [animation-delay:0.1s]"></div>
                        <div className="w-1 h-4 bg-orange-500 rounded-full opacity-60 animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-1 h-5 bg-red-500 rounded-full opacity-60 animate-pulse [animation-delay:0.3s]"></div>
                        <div className="w-1 h-4 bg-orange-500 rounded-full opacity-60 animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                </div>
                
                {/* Text */}
                <div className="flex flex-col items-center gap-2 mt-8">
                    <p className="text-white text-xl font-semibold">Cooking your Auth...</p>
                    <p className="text-gray-400 text-sm">The Server Chef is Preparing Something Special</p>
                </div>
                
                {/* Loading bar */}
                <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}