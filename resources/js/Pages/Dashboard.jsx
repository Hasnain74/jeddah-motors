import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, usePage, router, Link} from '@inertiajs/react';
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
    CBadge,
    CAlert,
    CCol,
    CRow,
    CCard,
    CCardBody,
    CInputGroup,
    CInputGroupText,
} from '@coreui/react';
import {
    cilPlus,
    cilPencil,
    cilTrash,
    cilPrint,
    cilSearch,
    cilCalendar,
    cilDollar,
    cilArrowTop,
    cilArrowBottom
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React, { useState } from 'react';
import { capitalize } from "lodash";

export default function Dashboard() {
    const { props } = usePage();
    const { data, links, from, to, total } = props.transactions || {};
    const filters = props.filters || {};
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.perPage || 10);
    const { flash, credit, debit } = usePage().props || {};
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
            month: 'short',
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
        router.get('/transactions', { search, perPage }, { preserveState: true });
    };

    const handleClearSearch = () => {
        setSearch('');
        router.get('/transactions', { perPage }, { preserveState: true });
    };

    const handlePerPageChange = (e) => {
        const value = e.target.value;
        setPerPage(value);
        router.get('/transactions', { search, perPage: value }, { preserveState: true });
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
            <Head title="Transaction Dashboard" />

            <div className="py-4 md:py-8">
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="mb-4 lg:mb-0">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Transaction Dashboard</h1>
                                <p className="mt-1 md:mt-2 text-sm text-gray-600">
                                    Manage and monitor all financial transactions
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <CButton
                                    color="primary"
                                    onClick={() => router.get(route('transactions.add'))}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base w-full sm:w-auto"
                                >
                                    <CIcon icon={cilPlus} className="me-1 md:me-2" />
                                    Add Transaction
                                </CButton>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <CRow className="mb-6">
                        <CCol xs={12} md={4} className="mb-4 md:mb-0">
                            <CCard className="border-0 shadow-lg rounded-2xl bg-gradient-to-r from-green-50 to-green-100">
                                <CCardBody className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-green-600 mb-1">Total Credit</p>
                                            <p className="text-xl md:text-2xl font-bold text-gray-900">
                                                PKR {credit.toLocaleString()}
                                            </p>
                                        </div>
                                        <div
                                            className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-xl flex items-center justify-center">
                                            <CIcon icon={cilArrowTop} className="text-white text-lg md:text-xl"/>
                                        </div>
                                    </div>
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol xs={12} md={4} className="mb-4 md:mb-0">
                            <CCard className="border-0 shadow-lg rounded-2xl bg-gradient-to-r from-red-50 to-red-100">
                                <CCardBody className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-red-600 mb-1">Total Debit</p>
                                            <p className="text-xl md:text-2xl font-bold text-gray-900">
                                                PKR {debit.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-red-500 rounded-xl flex items-center justify-center">
                                            <CIcon icon={cilArrowBottom} className="text-white text-lg md:text-xl"/>
                                        </div>
                                    </div>
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol xs={12} md={4}>
                            <CCard className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-sm rounded-2xl">
                                <CCardBody className="p-4 md:p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-blue-600 mb-1">Net Balance</p>
                                            <p className="text-xl md:text-2xl font-bold text-gray-900">
                                                PKR {(credit - debit).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                                            <CIcon icon={cilDollar} className="text-white text-lg md:text-xl" />
                                        </div>
                                    </div>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>

                    {/* Main Content Card */}
                    <CCard className="border-0 shadow-lg rounded-2xl overflow-hidden">
                        <CCardBody className="p-0">
                            {/* Filters Section */}
                            <div className="p-4 md:p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                                <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
                                    <form onSubmit={handleSearch} className="w-full md:w-auto">
                                        <CInputGroup className="w-full md:w-96">
                                            <CInputGroupText>
                                                <CIcon icon={cilSearch} />
                                            </CInputGroupText>
                                            <CFormInput
                                                type="text"
                                                placeholder="Search transactions..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="border-start-0"
                                            />
                                            <CButton
                                                type="submit"
                                                color="primary"
                                                className="px-3 md:px-4"
                                            >
                                                Search
                                            </CButton>
                                            {search && (
                                                <CButton
                                                    color="secondary"
                                                    variant="outline"
                                                    onClick={handleClearSearch}
                                                    className="px-2 md:px-3"
                                                >
                                                    Clear
                                                </CButton>
                                            )}
                                        </CInputGroup>
                                    </form>

                                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Show:</span>
                                            <CFormSelect
                                                value={perPage}
                                                onChange={handlePerPageChange}
                                                className="w-full sm:w-auto border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                            >
                                                {[10, 25, 50, 100].map(size => (
                                                    <option key={size} value={size}>{size}</option>
                                                ))}
                                            </CFormSelect>
                                        </div>
                                        <CButton
                                            color="info"
                                            onClick={exportPDF}
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 px-3 md:px-4 py-2 rounded-xl font-semibold text-sm w-full sm:w-auto"
                                        >
                                            <CIcon icon={cilPrint} className="me-1 md:me-2" />
                                            <span className="hidden sm:inline">Export PDF</span>
                                            <span className="sm:hidden">PDF</span>
                                        </CButton>
                                    </div>
                                </div>
                            </div>

                            {/* Flash Messages */}
                            {flash?.success && (
                                <div className="m-4 md:m-6 mb-0">
                                    <CAlert color="success" dismissible className="rounded-xl border-l-4 border-green-500 text-sm">
                                        <strong>Success!</strong> {flash.success}
                                    </CAlert>
                                </div>
                            )}

                            {/* Transactions - Desktop Table */}
                            {/* Transactions Table */}
                            <div className="p-4 md:p-6">
                                <div className="overflow-x-auto">
                                    <CTable striped hover responsive className="min-w-full">
                                        <CTableHead className="bg-gray-50">
                                            <CTableRow>
                                                <CTableHeaderCell className="text-sm font-semibold text-gray-700 py-3 whitespace-nowrap">
                                                    Customer
                                                </CTableHeaderCell>
                                                <CTableHeaderCell className="text-sm font-semibold text-gray-700 py-3 whitespace-nowrap">
                                                    Total Amount
                                                </CTableHeaderCell>
                                                <CTableHeaderCell className="text-sm font-semibold text-gray-700 py-3 whitespace-nowrap">
                                                    Paid Amount
                                                </CTableHeaderCell>
                                                <CTableHeaderCell className="text-sm font-semibold text-gray-700 py-3 whitespace-nowrap">
                                                    Remaining
                                                </CTableHeaderCell>
                                                <CTableHeaderCell className="text-sm font-semibold text-gray-700 py-3 whitespace-nowrap">
                                                    Type
                                                </CTableHeaderCell>
                                                <CTableHeaderCell className="text-sm font-semibold text-gray-700 py-3 whitespace-nowrap">
                                                    Date
                                                </CTableHeaderCell>
                                                <CTableHeaderCell className="text-sm font-semibold text-gray-700 py-3 whitespace-nowrap text-center">
                                                    Actions
                                                </CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {data?.length > 0 ? data.map((transaction) => {
                                                const paid = calculatePaidAmount(transaction.payments);
                                                const remaining = transaction.total_amount - paid;
                                                const formattedDate = formatDate(transaction.created_at);

                                                return (
                                                    <CTableRow key={transaction.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                        <CTableDataCell className="py-3 whitespace-nowrap">
                                                            <div className="font-medium text-gray-900">
                                                                {capitalize(transaction.customer?.customer_name) || '-'}
                                                            </div>
                                                        </CTableDataCell>
                                                        <CTableDataCell className="py-3 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <CBadge color="info" className="me-2 text-xs">PKR</CBadge>
                                                                <span className="font-semibold">{formatAmount(transaction.total_amount)}</span>
                                                            </div>
                                                        </CTableDataCell>
                                                        <CTableDataCell className="py-3 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <CBadge color="info" className="me-2 text-xs">PKR</CBadge>
                                                                <span className="font-semibold text-green-600">{formatAmount(paid)}</span>
                                                            </div>
                                                        </CTableDataCell>
                                                        <CTableDataCell className="py-3 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <CBadge color="info" className="me-2 text-xs">PKR</CBadge>
                                                                <span className={`font-semibold ${remaining > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                        {formatAmount(remaining)}
                                    </span>
                                                            </div>
                                                        </CTableDataCell>
                                                        <CTableDataCell className="py-3 whitespace-nowrap">
                                                            <CBadge
                                                                color={transaction.transaction_type === 'credit' ? 'success' : 'danger'}
                                                                className="text-xs font-semibold px-3 py-2"
                                                            >
                                    <span className="hidden lg:inline">
                                        {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                                    </span>
                                                                <span className="lg:hidden">
                                        {transaction.transaction_type.charAt(0).toUpperCase()}
                                    </span>
                                                            </CBadge>
                                                        </CTableDataCell>
                                                        <CTableDataCell className="py-3 whitespace-nowrap">
                                                            <div className="flex items-center text-gray-600">
                                                                <CIcon icon={cilCalendar} className="me-1 md:me-2 text-gray-400 hidden md:block" />
                                                                <span className="text-sm md:text-base">
                                                                {formattedDate}
                                                            </span>
                                                            </div>
                                                        </CTableDataCell>
                                                        <CTableDataCell className="py-3 whitespace-nowrap">
                                                            <div className="flex justify-center space-x-1 lg:space-x-2">
                                                                <CButton
                                                                    size="sm"
                                                                    color="outline-warning"
                                                                    onClick={() => router.get(route('transactions.edit', transaction.id), {}, {
                                                                        preserveState: true,
                                                                        preserveScroll: true
                                                                    })}
                                                                    className="d-flex align-items-center gap-1 px-2 lg:px-3 text-xs"
                                                                >
                                                                    <CIcon icon={cilPencil} />
                                                                    <span className="hidden sm:inline">Edit</span>
                                                                </CButton>
                                                                <CButton
                                                                    size="sm"
                                                                    color="outline-danger"
                                                                    onClick={() => handleDelete(transaction.id)}
                                                                    className="d-flex align-items-center gap-1 px-2 lg:px-3 text-xs"
                                                                >
                                                                    <CIcon icon={cilTrash} />
                                                                    <span className="hidden sm:inline">Delete</span>
                                                                </CButton>
                                                                <CButton
                                                                    size="sm"
                                                                    color="outline-info"
                                                                    onClick={() => window.open(route('transactions.print', { transaction: transaction.id }), '_blank')}
                                                                    className="d-flex align-items-center gap-1 px-2 lg:px-3 text-xs"
                                                                >
                                                                    <CIcon icon={cilPrint} />
                                                                    <span className="hidden sm:inline">Print</span>
                                                                </CButton>
                                                            </div>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                );
                                            }) : (
                                                <CTableRow>
                                                    <CTableDataCell colSpan="7" className="text-center py-8">
                                                        <div className="text-gray-500">
                                                            <p className="text-lg font-medium">No transactions found</p>
                                                            <p className="text-sm">Try adjusting your search criteria or add a new transaction.</p>
                                                        </div>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            )}
                                        </CTableBody>
                                    </CTable>
                                </div>
                            </div>

                            {/* Pagination and Results Info */}
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 md:p-6 border-t border-gray-200">
                                <div className="text-sm text-gray-600 mb-4 lg:mb-0 text-center lg:text-left">
                                    Showing <span className="font-semibold">{from}</span> to <span className="font-semibold">{to}</span> of{' '}
                                    <span className="font-semibold">{total}</span> results
                                </div>

                                <CPagination align="center" aria-label="Page navigation" className="flex-wrap">
                                    {links?.map((link, index) => (
                                        <CPaginationItem
                                            key={index}
                                            active={link.active}
                                            disabled={!link.url}
                                            onClick={() => handlePageChange(link.url)}
                                            className={`mx-1 my-1 rounded-lg ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : link.url
                                                        ? 'text-gray-700 hover:bg-gray-100'
                                                        : 'text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            <span
                                                className="px-2 md:px-3 py-2 block text-sm"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        </CPaginationItem>
                                    ))}
                                </CPagination>
                            </div>
                        </CCardBody>
                    </CCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
