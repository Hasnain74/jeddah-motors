import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import {
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CPagination,
    CPaginationItem,
    CButton,
    CFormInput,
    CFormSelect,
    CBadge, CAlert, CCol, CRow,
} from '@coreui/react';
import {cilPlus, cilPencil, cilTrash, cilPrint} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React, { useState } from 'react';
import { capitalize } from "lodash";

export default function Dashboard() {
    const { props } = usePage();
    const { data, meta, links } = props.transactions || {};
    const filters = props.filters || {};
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.perPage || 10);
    const { flash, credit, debit } = usePage().props || {};

    const creditAmount = Number(credit) || 0;
    const debitAmount = Number(debit) || 0;
    const netCredit = creditAmount - debitAmount;
    const netDebit = debitAmount - creditAmount;

    const finalCredit = netCredit > 0 ? netCredit : 0;
    const finalDebit = netDebit > 0 ? netDebit : 0;

    const calculatePaidAmount = (payments) => {
        return payments.reduce((total, payment) => total + parseFloat(payment.paid_amount), 0);
    };

    const formatAmount = (value) => {
        if (!value) return '0';
        return parseFloat(value).toLocaleString();
    };

    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handlePageChange = (url) => {
        if (url) {
            router.visit(url, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/dashboard', { search, perPage }, { preserveState: true });
    };

    const handlePerPageChange = (e) => {
        const value = e.target.value;
        setPerPage(value);
        router.get('/dashboard', { search, perPage: value }, { preserveState: true });
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ['#', 'Customer', 'Total', 'Paid', 'Remaining', 'Type', 'Date'];
        const tableRows = data.map((t, index) => {
            const paid = calculatePaidAmount(t.payments);
            const remaining = t.total_amount - paid;
            return [
                index + 1,
                t.customer?.customer_name || '-',
                t.total_amount,
                paid,
                remaining,
                t.transaction_type,
                formatDate(t.created_at),
            ];
        });
        autoTable(doc, { head: [tableColumn], body: tableRows });
        doc.save('transactions.pdf');
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            router.delete(`/transactions/${id}/delete`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Transactions" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <CRow className="mb-3 text-center">
                        <CCol md={6} className="text-success fw-bold fs-5">
                            Credit: PKR {finalCredit.toLocaleString()}
                        </CCol>
                        <CCol md={6} className="text-danger fw-bold fs-5">
                            Debit: PKR {finalDebit.toLocaleString()}
                        </CCol>
                    </CRow>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        {flash?.success && (
                            <CAlert color="success" dismissible>{flash.success}</CAlert>
                        )}
                        <div className="flex justify-between mb-4 gap-2 flex-wrap">
                            <CButton color="primary" onClick={() => router.visit('/add-transaction')}>
                                <CIcon icon={cilPlus} size="lg" /> Add Transaction
                            </CButton>
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <CFormInput
                                    type="text"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <CButton type="submit" color="secondary">Search</CButton>
                            </form>
                            <CFormSelect
                                value={perPage}
                                onChange={handlePerPageChange}
                                className="w-auto"
                            >
                                {[10, 25, 50, 100].map(size => (
                                    <option key={size} value={size}>{size} per page</option>
                                ))}
                            </CFormSelect>
                            <CButton color="info" onClick={exportPDF}>Export PDF</CButton>
                        </div>

                        <CTable striped hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>Customer</CTableHeaderCell>
                                    <CTableHeaderCell>Total</CTableHeaderCell>
                                    <CTableHeaderCell>Paid</CTableHeaderCell>
                                    <CTableHeaderCell>Remaining</CTableHeaderCell>
                                    <CTableHeaderCell>Type</CTableHeaderCell>
                                    <CTableHeaderCell>Date</CTableHeaderCell>
                                    <CTableHeaderCell>Action</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {data?.map((transaction, index) => {
                                    const paid = calculatePaidAmount(transaction.payments);
                                    const remaining = transaction.total_amount - paid;
                                    const formattedDate = formatDate(transaction.created_at);

                                    return (
                                        <CTableRow key={transaction.id}>
                                            <CTableDataCell>{capitalize(transaction.customer?.customer_name) || '-'}</CTableDataCell>
                                            <CTableDataCell>
                                                <CBadge color={'info'} className="me-2">RS</CBadge>
                                                {formatAmount(transaction.total_amount)}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CBadge color={'info'} className="me-2">RS</CBadge>
                                                {formatAmount(paid)}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CBadge color={'info'} className="me-2">RS</CBadge>
                                                {formatAmount(remaining)}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CBadge color={transaction.transaction_type === 'credit' ? 'success' : 'danger'}>
                                                    {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                                                </CBadge>
                                            </CTableDataCell>
                                            <CTableDataCell>{formattedDate}</CTableDataCell>
                                            <CTableDataCell>
                                                <CButton title="Edit Record" color="warning" size="sm" onClick={() => router.visit(`/transaction/${transaction.id}/edit`)}>
                                                    <CIcon icon={cilPencil} />
                                                </CButton>
                                                <CButton title="Delete Record" color="danger" size="sm" className="mx-2" onClick={() => handleDelete(transaction.id)}>
                                                    <CIcon icon={cilTrash} />
                                                </CButton>
                                                <CButton
                                                    title="Print Invoice"
                                                    color="secondary"
                                                    size="sm"
                                                    onClick={() => {
                                                        window.open(route('transactions.print', { transaction: transaction.id }), '_blank');
                                                    }}
                                                >
                                                    <CIcon icon={cilPrint} />
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    );
                                })}
                            </CTableBody>
                        </CTable>

                        <div className="flex justify-center mt-4">
                            <CPagination align="center">
                                {links?.map((link, index) => (
                                    <CPaginationItem
                                        key={index}
                                        active={link.active}
                                        disabled={!link.url}
                                        onClick={() => handlePageChange(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </CPagination>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
