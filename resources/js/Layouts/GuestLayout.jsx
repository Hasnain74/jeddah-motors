import {useState} from "react";

export default function GuestLayout({ children }) {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className="relative min-h-screen bg-gray-900 overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/bg-hero.jpg"
                    alt="Luxury Car Background"
                    className="w-full h-full object-cover opacity-40"
                    onLoad={() => setImageLoaded(true)}
                    loading="lazy"
                />
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-gray-900/40"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0">
                <div className="mt-6 w-full overflow-hidden bg-white/95 backdrop-blur-sm px-6 py-4 shadow-xl sm:max-w-md sm:rounded-lg border border-white/20">
                    {children}
                </div>
            </div>
        </div>
    );
}
