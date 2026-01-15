import { useNavigate } from "react-router-dom";

export default function Footer() {
      const navigate = useNavigate();

    return (
        <div className="w-full mt-10">

            {/* ================= CTA SECTION ================= */}
            <section className="w-full backdrop-blur-sm bg-[#0D121C]/60 border-y border-gray-800/50 py-5 text-center text-white relative overflow-hidden">
                
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="inline-block backdrop-blur-sm bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-full mb-6">
                        <p className="text-green-400 text-xs sm:text-sm font-medium flex items-center gap-2 justify-center">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Limited Time Offer
                        </p>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 px-4">
                        Get your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">FREE</span> account now
                    </h2>
                    
                    <p className="text-gray-400 text-lg sm:text-xl mb-8">50 monitors included!</p>

                    <button onClick={() => navigate("/register")} className="bg-green-500 text-black font-semibold px-8 py-4 rounded-xl text-base sm:text-lg shadow-lg shadow-green-500/20 hover:bg-green-400 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        Start monitoring in 30 seconds
                    </button>

                    <p className="text-gray-400 mt-6 text-sm sm:text-base flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        No credit card required!
                    </p>
                </div>
            </section>

            {/* ================= FOOTER SECTION ================= */}
            <footer className="bg-[#0B0F17] text-white py-9 px-6 lg:px-20">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">

                    {/* BRAND SECTION */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 font-bold text-xl">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                            PulseCheck
                        </div>

                        <p className="text-gray-300 text-sm sm:text-base font-medium mb-4">
                            Downtime happens. Get notified!
                        </p>

                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Join more than 2,700,000+ happy users!
                            PulseCheck is one of the most popular
                            website monitoring services in the world.
                        </p>

                        {/* SOCIAL ICONS */}
                        <div className="flex gap-3">
                            {[
                                { icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                                { icon: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" },
                                { icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                                { icon: "M20.317 4.3698a1.53 1.53 0 00-1.08-1.084c-.95-.256-4.76-.256-4.76-.256s-3.81 0-4.76.256a1.53 1.53 0 00-1.08 1.084c-.256.954-.256 2.95-.256 2.95s0 1.996.256 2.95a1.53 1.53 0 001.08 1.084c.95.256 4.76.256 4.76.256s3.81 0 4.76-.256a1.53 1.53 0 001.08-1.084c.256-.954.256-2.95.256-2.95s0-1.996-.256-2.95zM11.999 9.8698l3.556-2 3.556 2-3.556 2-3.556-2z" }
                            ].map((social, index) => (
                                <button 
                                    key={index}
                                    className="w-10 h-10 rounded-lg backdrop-blur-sm bg-white/5 border border-gray-700/50 flex items-center justify-center hover:bg-white/10 hover:border-gray-600 transition-all group"
                                >
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d={social.icon} />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* PAGES COLUMN */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-green-500"></div>
                            Pages
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { name: "Features", path: "/features", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
                                { name: "Solutions", path: "/solutions", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
                                { name: "Resources", path: "/resources", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
                                { name: "Pricing", path: "/pricing", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" }
                            ].map((item, index) => (
                                <button 
                                    key={index}
                                    onClick={() => navigate(item.path)}
                                    className="backdrop-blur-sm bg-white/5 border border-gray-700/50 rounded-lg p-4 hover:bg-white/10 hover:border-gray-600 transition-all group text-left"
                                >
                                    <svg className="w-6 h-6 text-gray-400 group-hover:text-green-400 transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                    </svg>
                                    <p className="text-gray-400 group-hover:text-green-400 transition-colors font-medium">
                                        {item.name}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Copyright Section */}
                <div className="mt-12 pt-8 border-t border-gray-800/50 text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} PulseCheck. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}