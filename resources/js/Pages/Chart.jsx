import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CBadge,
    CProgress
} from '@coreui/react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { cilChartPie, cilArrowTop, cilArrowBottom, cilDollar } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

// Enhanced color palette
const COLORS = ['#28a745', '#dc3545', '#007bff', '#ffc107', '#6f42c1'];
const GRADIENT_COLORS = [
    { start: '#28a745', end: '#20c997' },
    { start: '#dc3545', end: '#e83e8c' },
    { start: '#007bff', end: '#6f42c1' }
];

// Format number with commas
const formatNumber = (num) => {
    return Number(num || 0).toLocaleString('en-PK');
};

// Safe data extraction
const getSafeData = (props) => {
    return {
        credit: Number(props.credit) || 0,
        debit: Number(props.debit) || 0,
        monthly_data: Array.isArray(props.monthly_data) ? props.monthly_data : []
    };
};

export default function Chart({ auth }) {
    const { props } = usePage();
    const { credit, debit, monthly_data } = getSafeData(props);

    const pieData = [
        { name: 'Credit', value: credit, color: COLORS[0] },
        { name: 'Debit', value: debit, color: COLORS[1] },
    ];

    const total = pieData.reduce((sum, item) => sum + Number(item.value || 0), 0);
    // Ensure percentages are numbers (CProgress expects number)
    const creditPercentage = total > 0 ? parseFloat(((credit / total) * 100).toFixed(1)) : 0;
    const debitPercentage = total > 0 ? parseFloat(((debit / total) * 100).toFixed(1)) : 0;

    const hasData = pieData.some(item => Number(item.value) > 0);
    const hasMonthlyData = monthly_data.length > 0;

    console.log(monthly_data)

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Financial Analytics Dashboard" />

            <div className="py-4 md:py-8">
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="mb-4 lg:mb-0">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Financial Analytics</h1>
                                <p className="mt-1 md:mt-2 text-sm text-gray-600">
                                    Visualize your credit and debit transactions with interactive charts
                                </p>
                            </div>
                            <div className="mt-4 lg:mt-0 flex flex-wrap gap-2">
                                <CBadge color="success" shape="rounded" className="px-3 py-2 text-sm">
                                    <CIcon icon={cilArrowTop} className="me-1" />
                                    Credit: PKR {formatNumber(credit)}
                                </CBadge>
                                <CBadge color="danger" shape="rounded" className="px-3 py-2 text-sm">
                                    <CIcon icon={cilArrowBottom} className="me-1" />
                                    Debit: PKR {formatNumber(debit)}
                                </CBadge>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                        <CCard className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-sm rounded-2xl">
                            <CCardBody className="p-4 md:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600 mb-1">Total Credit</p>
                                        <p className="text-xl md:text-2xl font-bold text-gray-900">PKR {formatNumber(credit)}</p>
                                        <p className="text-xs text-green-600 mt-1">
                                            {creditPercentage}% of total
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-xl flex items-center justify-center">
                                        <CIcon icon={cilArrowTop} className="text-white text-lg md:text-xl" />
                                    </div>
                                </div>
                                <CProgress
                                    value={creditPercentage}
                                    color="success"
                                    className="mt-3"
                                    style={{ height: '6px' }}
                                />
                            </CCardBody>
                        </CCard>

                        <CCard className="bg-gradient-to-br from-red-50 to-red-100 border-0 shadow-sm rounded-2xl">
                            <CCardBody className="p-4 md:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-600 mb-1">Total Debit</p>
                                        <p className="text-xl md:text-2xl font-bold text-gray-900">PKR {formatNumber(debit)}</p>
                                        <p className="text-xs text-red-600 mt-1">
                                            {debitPercentage}% of total
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-red-500 rounded-xl flex items-center justify-center">
                                        <CIcon icon={cilArrowBottom} className="text-white text-lg md:text-xl" />
                                    </div>
                                </div>
                                <CProgress
                                    value={debitPercentage}
                                    color="danger"
                                    className="mt-3"
                                    style={{ height: '6px' }}
                                />
                            </CCardBody>
                        </CCard>

                        <CCard className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-sm rounded-2xl">
                            <CCardBody className="p-4 md:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600 mb-1">Net Balance</p>
                                        <p className="text-xl md:text-2xl font-bold text-gray-900">
                                            PKR {formatNumber(credit - debit)}
                                        </p>
                                        <p className="text-xs text-blue-600 mt-1">
                                            Credit - Debit
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                                        <CIcon icon={cilDollar} className="text-white text-lg md:text-xl" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <CBadge
                                        color={credit - debit >= 0 ? 'success' : 'danger'}
                                        className="text-xs"
                                    >
                                        {credit - debit >= 0 ? 'Positive' : 'Negative'} Balance
                                    </CBadge>
                                </div>
                            </CCardBody>
                        </CCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        {/* Pie Chart Card */}
                        <CCard className="border-0 shadow-lg rounded-2xl overflow-hidden">
                            <CCardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-0 py-3 md:py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center">
                                        <CIcon icon={cilChartPie} className="me-2 text-blue-500" />
                                        Credit vs Debit
                                    </h3>
                                </div>
                            </CCardHeader>
                            <CCardBody className="p-4 md:p-6" style={{ height: '300px', minHeight: '300px' }}>
                                {hasData ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <defs>
                                                {pieData.map((entry, index) => (
                                                    <linearGradient
                                                        key={`gradient-${index}`}
                                                        id={`colorGradient${index}`}
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop offset="0%" stopColor={GRADIENT_COLORS[index]?.start || entry.color} />
                                                        <stop offset="100%" stopColor={GRADIENT_COLORS[index]?.end || entry.color} />
                                                    </linearGradient>
                                                ))}
                                            </defs>
                                            <Pie
                                                data={pieData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                innerRadius={40}
                                                paddingAngle={2}
                                                label={({ name, percent }) =>
                                                    `${name}: ${(percent * 100).toFixed(1)}%`
                                                }
                                                labelLine={false}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={`url(#colorGradient${index})`}
                                                        stroke="#fff"
                                                        strokeWidth={2}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) => [`PKR ${formatNumber(value)}`, 'Amount']}
                                                contentStyle={{
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                                    fontSize: '12px'
                                                }}
                                            />
                                            <Legend
                                                verticalAlign="bottom"
                                                height={36}
                                                iconSize={8}
                                                formatter={(value) => <span className="text-xs md:text-sm font-medium">{value}</span>}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3 md:mb-4">
                                            <CIcon icon={cilChartPie} className="text-gray-400 text-xl md:text-2xl" />
                                        </div>
                                        <h4 className="text-base md:text-lg font-medium text-gray-900 mb-2">No Data Available</h4>
                                        <p className="text-gray-500 text-sm max-w-sm">
                                            There's no transaction data available to display the chart.
                                            Start adding transactions to see visual insights.
                                        </p>
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>

                        {/* Bar Chart Card */}
                        <CCard className="border-0 shadow-lg rounded-2xl overflow-hidden">
                            <CCardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-0 py-3 md:py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center">
                                        <CIcon icon={cilChartPie} className="me-2 text-purple-500" />
                                        Monthly Trends
                                    </h3>
                                    <CBadge color="secondary" shape="rounded" className="text-xs">
                                        Last 6 Months
                                    </CBadge>
                                </div>
                            </CCardHeader>
                            <CCardBody className="p-4 md:p-6" style={{ height: '300px', minHeight: '300px' }}>
                                {hasMonthlyData ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={monthly_data}
                                            margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                                axisLine={false}
                                                tickFormatter={(value) => `PKR ${formatNumber(value)}`}
                                            />
                                            <Tooltip
                                                content={({ active, payload, label }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-md text-sm">
                                                                <p className="font-semibold text-gray-800 mb-1">{label}</p>
                                                                <p className="text-green-600">💰 Credit: {payload[0]?.value ?? 0}</p>
                                                                <p className="text-red-600">💸 Debit: {payload[1]?.value ?? 0}</p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Legend
                                                verticalAlign="top"
                                                height={36}
                                                iconSize={8}
                                                formatter={(value) => <span className="text-xs md:text-sm font-medium">{value}</span>}
                                            />
                                            <Bar
                                                dataKey="credit"
                                                name="Credit"
                                                fill="url(#creditGradient)"
                                                radius={[4, 4, 0, 0]}
                                            />
                                            <Bar
                                                dataKey="debit"
                                                name="Debit"
                                                fill="url(#debitGradient)"
                                                radius={[4, 4, 0, 0]}
                                            />
                                            <defs>
                                                <linearGradient id="creditGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#28a745" />
                                                    <stop offset="100%" stopColor="#20c997" />
                                                </linearGradient>
                                                <linearGradient id="debitGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#dc3545" />
                                                    <stop offset="100%" stopColor="#e83e8c" />
                                                </linearGradient>
                                            </defs>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3 md:mb-4">
                                            <CIcon icon={cilChartPie} className="text-gray-400 text-xl md:text-2xl" />
                                        </div>
                                        <h4 className="text-base md:text-lg font-medium text-gray-900 mb-2">No Monthly Data</h4>
                                        <p className="text-gray-500 text-sm max-w-sm">
                                            No monthly transaction data available for the trend analysis.
                                        </p>
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>
                    </div>

                    {/* Insights Section */}
                    <CCard className="border-0 shadow-lg rounded-2xl overflow-hidden mt-6 md:mt-8">
                        <CCardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-0 py-3 md:py-4">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center">
                                Financial Insights
                            </h3>
                        </CCardHeader>
                        <CCardBody className="p-4 md:p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                <div className="text-center p-3 md:p-4 bg-blue-50 rounded-xl">
                                    <div className="text-xl md:text-2xl font-bold text-blue-600">{creditPercentage}%</div>
                                    <div className="text-xs md:text-sm text-gray-600 mt-1">Credit Ratio</div>
                                </div>
                                <div className="text-center p-3 md:p-4 bg-red-50 rounded-xl">
                                    <div className="text-xl md:text-2xl font-bold text-red-600">{debitPercentage}%</div>
                                    <div className="text-xs md:text-sm text-gray-600 mt-1">Debit Ratio</div>
                                </div>
                                <div className="text-center p-3 md:p-4 bg-green-50 rounded-xl">
                                    <div className="text-xl md:text-2xl font-bold text-green-600">
                                        PKR {total > 0 ? formatNumber(Math.abs(credit - debit)) : 0}
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-600 mt-1">
                                        Net Difference
                                    </div>
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
