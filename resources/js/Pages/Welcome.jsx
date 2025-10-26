import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="relative min-h-screen bg-gray-900 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/bg-hero.jpg"
                        alt="Luxury Car Background"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-gray-900/40"></div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6">
                    <div className="w-full max-w-2xl lg:max-w-7xl">
                        {/* Header */}
                        <header className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 items-center gap-4">
                            {/* Logo - Centered on mobile, positioned properly on larger screens */}
                            <div className="order-1 sm:order-none flex justify-center sm:justify-start lg:col-start-2 lg:justify-center w-full sm:w-auto">
                                <img
                                    src="/images/JM-Logo-transparent.PNG"
                                    alt="New Jeddah Motors Logo"
                                    className="w-auto"
                                />
                            </div>

                            {/* Navigation - Stack on mobile, row on larger screens */}
                            <nav className="order-2 sm:order-none -mx-3 flex flex-col sm:flex-row gap-3 sm:gap-2 w-full sm:w-auto sm:justify-end mb-4">
                                {auth.user && (
                                    <>
                                        <Link
                                            href={route('dashboard')}
                                            className="no-underline rounded-lg px-4 py-3 sm:py-2 bg-white/10 backdrop-blur-sm text-amber-300 font-semibold text-sm tracking-wide shadow-lg transition hover:bg-amber-500 hover:text-white hover:ring-2 hover:ring-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 border border-amber-500/30 text-center"
                                        >
                                            Transactions
                                        </Link>
                                        <Link
                                            href={route('bank.index')}
                                            className="no-underline rounded-lg px-4 py-3 sm:py-2 bg-white/10 backdrop-blur-sm text-amber-300 font-semibold text-sm tracking-wide shadow-lg transition hover:bg-amber-500 hover:text-white hover:ring-2 hover:ring-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 border border-amber-500/30 text-center"
                                        >
                                            Banks
                                        </Link>
                                        <Link
                                            href={route('transactions.chart')}
                                            className="no-underline rounded-lg px-4 py-3 sm:py-2 bg-white/10 backdrop-blur-sm text-amber-300 font-semibold text-sm tracking-wide shadow-lg transition hover:bg-amber-500 hover:text-white hover:ring-2 hover:ring-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 border border-amber-500/30 text-center"
                                        >
                                            Chart
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        {/* Welcome Message Section */}
                        <div className="text-center px-2">
                            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                                Welcome to <span className="block sm:inline text-amber-400 mt-1 sm:mt-0">NEW JEDDAH MOTORS</span>
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                                Experience luxury automotive excellence with our premium collection
                                of activities and entertainment
                            </p>
                        </div>

                        {/* Add a call-to-action button for mobile */}
                        <div className="mt-2 sm:mt-12 flex justify-center">
                            {!auth.user && (
                                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                                    <Link
                                        href={route('login')}
                                        className="no-underline rounded-full px-6 py-3 bg-amber-500 text-white font-bold text-sm sm:text-base tracking-wide shadow-lg transition hover:bg-amber-600 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 text-center"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="no-underline rounded-full px-6 py-3 bg-transparent text-amber-300 font-bold text-sm sm:text-base tracking-wide shadow-lg transition hover:bg-white/10 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 border border-amber-500/50 text-center"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
