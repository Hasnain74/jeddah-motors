import { Head, Link } from '@inertiajs/react';
import NavLink from "@/Components/NavLink.jsx";

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
            <div className="text-black/50 bg-gray-400 dark:text-white/50">
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                            <div className="flex lg:col-start-2 lg:justify-center">
                                <img
                                    src="/images/JM-Logo-transparent.PNG"
                                    alt="My Logo"
                                    className="block h-13 w-auto"
                                />
                            </div>
                            <nav className="-mx-3 flex flex-1 justify-end space-x-2">
                                {auth.user ? (
                                    <>
                                        <Link
                                            href={route('dashboard')}
                                            className="no-underline rounded-lg px-4 py-2 bg-gray-200 text-amber-700 font-semibold text-sm tracking-wide shadow-sm transition hover:bg-amber-50 hover:ring-amber-600 hover:ring focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                                        >
                                            Transactions
                                        </Link>
                                        <Link
                                            href={route('bank.index')}
                                            className="no-underline rounded-lg px-4 py-2 bg-gray-200 text-amber-700 font-semibold text-sm tracking-wide shadow-sm transition hover:bg-amber-50 hover:ring-amber-600 hover:ring focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                                        >
                                            Banks
                                        </Link>
                                        <Link
                                            href={route('transactions.chart')}
                                            className="no-underline rounded-lg px-4 py-2 bg-gray-200 text-amber-700 font-semibold text-sm tracking-wide shadow-sm transition hover:bg-amber-50 hover:ring-amber-600 hover:ring focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                                        >
                                            Chart
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="no-underline rounded-lg px-4 py-2 bg-gray-200 text-amber-700 font-semibold text-sm tracking-wide shadow-sm transition hover:bg-amber-50 hover:ring-amber-600 hover:ring focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="no-underline rounded-lg px-4 py-2 bg-gray-200 text-amber-700 font-semibold text-sm tracking-wide shadow-sm transition hover:bg-amber-50 hover:ring-amber-600 hover:ring focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>

                        </header>
                    </div>
                </div>
            </div>
        </>
    );
}
