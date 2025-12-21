export default function Footer() {
    return (
        <div className="w-full mt-20">

            {/* ================= CTA SECTION ================= */}
            <section className="w-full bg-[#0D161D] py-24 text-center text-white relative overflow-hidden">

                <h2 className="text-3xl md:text-4xl font-bold mb-8">
                    Get your FREE account now, 50 monitors included!
                </h2>

                <button className="bg-green-500 text-black font-semibold px-8 py-3 rounded-full text-lg shadow-lg hover:bg-green-400 transition">
                    Start monitoring in 30 seconds
                </button>

                <p className="text-gray-400 mt-6 text-lg">No credit card required!</p>
            </section>

            {/* ================= FOOTER SECTION ================= */}
            <footer className="bg-[#0B0F17] text-white py-20 px-6 lg:px-20">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* BRAND SECTION */}
                    <div>
                        <div className="flex items-center gap-2 mb-3 font-semibold text-lg">
                            <span className="text-green-500 text-xl">⬤</span>
                            PulseCheck
                        </div>

                        <p className="text-gray-300 text-sm mb-4">
                            Downtime happens. Get notified!
                        </p>

                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Join more than 2,700,000+ happy users!
                            PulseCheck is one of the most popular
                            website monitoring services in the world.
                        </p>

                        {/* SOCIAL ICONS */}
                        <div className="flex gap-4 text-gray-400 text-xl">
                            <button className="hover:text-white transition">✕</button>
                            <button className="hover:text-white transition">🐦</button>
                            <button className="hover:text-white transition">in</button>
                            <button className="hover:text-white transition">👾</button>
                        </div>
                    </div>

                    {/* MONITORING COLUMN */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Monitoring<span className="text-green-500">.</span>
                        </h3>

                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li>Website monitoring</li>
                            <li>SSL monitoring</li>
                            <li>Domain monitoring</li>
                            <li>Ping monitoring</li>
                            <li>Port monitoring</li>
                            <li>TCP monitoring</li>
                            <li>Cron job monitoring</li>
                        </ul>
                    </div>

                    {/* COMPANY COLUMN */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Company<span className="text-green-500">.</span>
                        </h3>

                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li>Pricing</li>
                            <li>Blog</li>
                            <li>Affiliate program</li>
                            <li>Referral program</li>
                            <li>Non profit & charities 🤝</li>
                            <li>Terms / Privacy</li>
                            <li>Contact us</li>
                        </ul>
                    </div>

                    {/* RESOURCES COLUMN */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Resources<span className="text-green-500">.</span>
                        </h3>

                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li>Integrations</li>
                            <li>API</li>
                            <li>FAQs</li>
                            <li>Help center</li>
                            <li>Locations & IPs</li>
                            <li>Comparisons</li>
                            <li>Case studies</li>
                        </ul>
                    </div>

                </div>
            </footer>
        </div>
    );
}
