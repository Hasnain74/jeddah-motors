import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CContainer,
    CRow,
    CCol
} from '@coreui/react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#28a745', '#dc3545'];

export default function Chart({ auth }) {
    const { credit, debit } = usePage().props;

    const data = [
        { name: 'Credit', value: Number(credit) || 0 },
        { name: 'Debit', value: Number(debit) || 0 },
    ];

    const hasData = data.some(item => item.value > 0);

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Credit vs Debit Chart" />
            <CContainer className="mt-4">
                <CRow>
                    <CCol md={12}>
                        <CCard>
                            <CCardHeader>Credit vs Debit</CCardHeader>
                            <CCardBody style={{ height: 400 }}>
                                {hasData ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={120}
                                                label
                                            >
                                                {data.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="text-center text-muted mt-5">
                                        No data available to display the chart.
                                    </div>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </AuthenticatedLayout>
    );
}
