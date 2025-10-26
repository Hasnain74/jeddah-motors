import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, router, useForm, usePage} from "@inertiajs/react";
import {
    CRow,
    CCol,
    CFormInput,
    CButton,
    CFormSelect,
    CAlert,
    CBreadcrumb,
    CBreadcrumbItem,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CFormCheck,
    CFormLabel,
    CTableFoot,
    CCard,
    CCardBody,
    CCardHeader
} from "@coreui/react";
import CIcon from '@coreui/icons-react';
import {cilPencil, cilTrash} from '@coreui/icons';
import { NumericFormat, PatternFormat } from "react-number-format";
import { useEffect, useState } from "react";
import { capitalize } from "lodash";

export default function EditTransaction() {
    const { customer, banks, transaction, payments, vehicle } = usePage().props;
    const { flash, errors } = usePage().props || {};
    const [showPaymentFields, setShowPaymentFields] = useState(false);
    const [editingPayment, setEditingPayment] = useState(null);
    const [remainingAmount, setRemainingAmount] = useState(0);
    const totalPaidAmount = payments.reduce((sum, p) => sum + Number(p.paid_amount), 0);

    const { data, setData, post } = useForm({
        ...transaction,
        total_amount: transaction.total_amount.toString(),
        paid_amount: "",
        paid_on: "",
        bank_name: "",
        transfer_type: transaction.transfer_type || "",
        transaction_type: transaction.transaction_type || "",
        customer_name: customer.customer_name,
        cnic: customer.cnic,
        phone_no: customer.phone_no,
        vehicle_name: vehicle?.vehicle_name,
        company: vehicle?.company,
        model: vehicle?.model
    });

    useEffect(() => {
        calculateRemainingAmount();
    }, [payments]);

    useEffect(() => {
        if (flash?.success) {
            setShowPaymentFields(false);
            setEditingPayment(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [flash]);

    const calculateRemainingAmount = () => {
        const paid = payments.reduce((sum, p) => sum + parseFloat(p.paid_amount), 0);
        const remaining = parseFloat(transaction.total_amount) - paid;
        setRemainingAmount(remaining);
    };

    const handleTransactionSubmit = (e) => {
        e.preventDefault();
        router["put"](`/transactions/${transaction.id}/update`, {
            data,
        }, {
            preserveScroll: true,
        });
    };

    const handlePaymentEdit = (payment) => {
        setEditingPayment(payment);
        setShowPaymentFields(true);
        setData({
            ...data,
            paid_amount: payment.paid_amount.toString(),
            paid_on: payment.paid_on,
            bank_name: payment?.bank_id,
            transfer_type: payment.transfer_type || "",
        });
    };

    const handleDeletePayment = (id) => {
        if (confirm('Are you sure you want to delete this payment?')) {
            router.delete(`/payments/${id}/delete`, {
                preserveScroll: true,
            });
        }
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        const url = editingPayment
            ? route("transactions.payment.update", [transaction.id, editingPayment.id])
            : route("transactions.payment.store", transaction.id);
        post(url, { data, preserveScroll: true });
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <AuthenticatedLayout
            header={
                <CBreadcrumb>
                    <CBreadcrumbItem><Link href={route('dashboard')}>Transactions</Link></CBreadcrumbItem>
                    <CBreadcrumbItem active>Edit Transaction</CBreadcrumbItem>
                </CBreadcrumb>
            }
        >
            <Head title="Edit Transaction" />

            <div className="py-4 md:py-8">
                <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="mb-4 lg:mb-0">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Transaction</h1>
                                <p className="mt-1 md:mt-2 text-sm text-gray-600">
                                    Update transaction details and manage payments
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 w-full sm:w-auto"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                                    </svg>
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Card */}
                    <CCard className="border-0 shadow-lg rounded-2xl overflow-hidden">
                        <CCardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-0 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
                                        <p className="text-sm text-gray-600">Update customer, vehicle, and payment information</p>
                                    </div>
                                </div>
                            </div>
                        </CCardHeader>

                        <CCardBody className="p-4 md:p-6">
                            {/* Flash Messages */}
                            {flash?.success && (
                                <CAlert color="success" dismissible className="rounded-xl border-l-4 border-green-500 mb-6">
                                    <strong>Success!</strong> {flash.success}
                                </CAlert>
                            )}

                            <form onSubmit={handleTransactionSubmit}>
                                {/* Customer Information Section */}
                                <div className="mb-8">
                                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h5>
                                    <CRow className="g-4">
                                        <CCol md={6}>
                                            <div className="space-y-1">
                                                <CFormLabel className="text-sm font-medium text-gray-700">Customer Name</CFormLabel>
                                                <CFormInput
                                                    placeholder="Enter customer name"
                                                    value={data.customer_name}
                                                    onChange={(e) => setData('customer_name', e.target.value)}
                                                    className="border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                    invalid={!!errors?.['data.customer_name']}
                                                />
                                                {errors?.['data.customer_name'] && (
                                                    <div className="text-danger text-sm mt-1">{errors['data.customer_name']}</div>
                                                )}
                                            </div>
                                        </CCol>

                                        <CCol md={6}>
                                            <div className="space-y-1">
                                                <CFormLabel className="text-sm font-medium text-gray-700">CNIC</CFormLabel>
                                                <PatternFormat
                                                    format="#####-#######-#"
                                                    mask="_"
                                                    placeholder="Enter CNIC"
                                                    className="form-control border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                    value={data.cnic}
                                                    onValueChange={({ value }) => setData("cnic", value)}
                                                />
                                                {errors?.['data.cnic'] && (
                                                    <div className="text-danger text-sm mt-1">{errors['data.cnic']}</div>
                                                )}
                                            </div>
                                        </CCol>

                                        <CCol md={6}>
                                            <div className="space-y-1">
                                                <CFormLabel className="text-sm font-medium text-gray-700">Phone Number</CFormLabel>
                                                <CFormInput
                                                    placeholder="Enter phone number"
                                                    value={data.phone_no}
                                                    onChange={(e) => setData('phone_no', e.target.value)}
                                                    className="border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                    invalid={!!errors?.['data.phone_no']}
                                                />
                                                {errors?.['data.phone_no'] && (
                                                    <div className="text-danger text-sm mt-1">{errors['data.phone_no']}</div>
                                                )}
                                            </div>
                                        </CCol>
                                    </CRow>
                                </div>

                                {/* Vehicle Information Section */}
                                <div className="mb-8">
                                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h5>
                                    <CRow className="g-4">
                                        <CCol md={6}>
                                            <div className="space-y-1">
                                                <CFormLabel className="text-sm font-medium text-gray-700">Vehicle Name</CFormLabel>
                                                <CFormInput
                                                    placeholder="Enter vehicle name"
                                                    value={data.vehicle_name}
                                                    onChange={(e) => setData("vehicle_name", e.target.value)}
                                                    className="border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                />
                                            </div>
                                        </CCol>
                                        <CCol md={6}>
                                            <div className="space-y-1">
                                                <CFormLabel className="text-sm font-medium text-gray-700">Company</CFormLabel>
                                                <CFormInput
                                                    placeholder="Enter company"
                                                    value={data.company}
                                                    onChange={(e) => setData("company", e.target.value)}
                                                    className="border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                />
                                            </div>
                                        </CCol>
                                        <CCol md={6}>
                                            <div className="space-y-1">
                                                <CFormLabel className="text-sm font-medium text-gray-700">Model</CFormLabel>
                                                <CFormInput
                                                    placeholder="Enter model"
                                                    value={data.model}
                                                    onChange={(e) => setData("model", e.target.value)}
                                                    className="border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                />
                                            </div>
                                        </CCol>
                                    </CRow>
                                </div>

                                {/* Payment Management Section */}
                                <div className="mb-8">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                        <h5 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Payment Management</h5>
                                        <CButton
                                            color={showPaymentFields ? "danger" : "primary"}
                                            onClick={() => {
                                                setShowPaymentFields(!showPaymentFields);
                                                if (showPaymentFields) {
                                                    setEditingPayment(null);
                                                    setData({
                                                        ...data,
                                                        paid_amount: "",
                                                        paid_on: "",
                                                        bank_name: "",
                                                        transfer_type: ""
                                                    });
                                                }
                                            }}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 px-4 py-2 rounded-xl font-semibold text-white w-full sm:w-auto"
                                        >
                                            {showPaymentFields ? "Cancel" : (editingPayment ? "Cancel Editing" : "Add Payment")}
                                        </CButton>
                                    </div>

                                    {showPaymentFields && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6 mb-6">
                                            <h6 className="text-md font-semibold text-blue-800 mb-4">
                                                {editingPayment ? "Edit Payment" : "Add New Payment"}
                                            </h6>
                                            <CRow className="g-4">
                                                <CCol md={6}>
                                                    <div className="space-y-1">
                                                        <CFormLabel className="text-sm font-medium text-gray-700">Payment Date</CFormLabel>
                                                        <CFormInput
                                                            type="date"
                                                            value={data.paid_on}
                                                            onChange={(e) => setData("paid_on", e.target.value)}
                                                            className="border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                        />
                                                    </div>
                                                </CCol>
                                                <CCol md={6}>
                                                    <div className="space-y-1">
                                                        <CFormLabel className="text-sm font-medium text-gray-700">Paid Amount</CFormLabel>
                                                        <NumericFormat
                                                            thousandSeparator=","
                                                            value={data.paid_amount}
                                                            onValueChange={({ value }) => setData("paid_amount", value)}
                                                            placeholder="Enter paid amount"
                                                            className="form-control border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                        />
                                                    </div>
                                                </CCol>
                                                <CCol md={6}>
                                                    <div className="space-y-1">
                                                        <CFormLabel className="text-sm font-medium text-gray-700">Bank</CFormLabel>
                                                        <CFormSelect
                                                            value={data.bank_name}
                                                            onChange={(e) => setData("bank_name", e.target.value)}
                                                            className="border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                        >
                                                            <option value="">Select Bank</option>
                                                            {Object.entries(banks).map(([id, name]) => (
                                                                <option key={id} value={id}>{name}</option>
                                                            ))}
                                                        </CFormSelect>
                                                    </div>
                                                </CCol>
                                                <CCol md={6}>
                                                    <div className="space-y-1">
                                                        <CFormLabel className="text-sm font-medium text-gray-700">Transfer Type</CFormLabel>
                                                        <CFormSelect
                                                            value={data.transfer_type}
                                                            onChange={(e) => setData("transfer_type", e.target.value)}
                                                            className="border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                        >
                                                            <option value="">Select Type</option>
                                                            <option value="cash">Cash</option>
                                                            <option value="cheque">Cheque</option>
                                                            <option value="online_transfer">Online Transfer</option>
                                                        </CFormSelect>
                                                    </div>
                                                </CCol>
                                            </CRow>
                                            <CButton
                                                type="submit"
                                                color="success"
                                                className="mt-4 bg-gradient-to-r from-green-600 to-green-700 border-0 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2 rounded-xl font-semibold text-white"
                                                onClick={handlePaymentSubmit}
                                            >
                                                {editingPayment ? "Update Payment" : "Save Payment"}
                                            </CButton>
                                        </div>
                                    )}

                                    {/* Payment Details */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 md:p-6">
                                        <h6 className="text-md font-semibold text-gray-800 mb-4">Payment Summary</h6>
                                        <CRow className="g-4">
                                            <CCol md={6}>
                                                <div className="space-y-1">
                                                    <CFormLabel className="text-sm font-medium text-gray-700">Total Amount</CFormLabel>
                                                    <NumericFormat
                                                        thousandSeparator=","
                                                        value={data.total_amount}
                                                        onValueChange={({ value }) => setData("total_amount", value)}
                                                        placeholder="Total Amount"
                                                        className={`form-control border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4 ${errors?.['data.total_amount'] ? 'is-invalid' : ''}`}
                                                    />
                                                    {errors?.['data.total_amount'] && (
                                                        <div className="text-danger text-sm mt-1">{errors['data.total_amount']}</div>
                                                    )}
                                                </div>
                                            </CCol>
                                            <CCol md={6}>
                                                <div className="space-y-1">
                                                    <CFormLabel className="text-sm font-medium text-gray-700">Remaining Amount</CFormLabel>
                                                    <NumericFormat
                                                        value={remainingAmount}
                                                        displayType="text"
                                                        thousandSeparator=","
                                                        className="form-control border-gray-300 rounded-xl bg-gray-100 py-3 px-4"
                                                        readOnly
                                                    />
                                                </div>
                                            </CCol>
                                            <CCol md={12}>
                                                <div className="space-y-1">
                                                    <CFormLabel className="text-sm font-medium text-gray-700 mb-3 block">Transaction Type</CFormLabel>
                                                    <div className="flex flex-col sm:flex-row gap-4">
                                                        <CFormCheck
                                                            type="radio"
                                                            name="transaction_type"
                                                            id="credit"
                                                            value="credit"
                                                            label={
                                                                <span className="text-success font-medium">
                                                                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                                    </svg>
                                                                    Credit
                                                                </span>
                                                            }
                                                            checked={data.transaction_type === "credit"}
                                                            onChange={(e) => setData("transaction_type", e.target.value)}
                                                            className="text-success"
                                                        />
                                                        <CFormCheck
                                                            type="radio"
                                                            name="transaction_type"
                                                            id="debit"
                                                            value="debit"
                                                            label={
                                                                <span className="text-danger font-medium">
                                                                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                                    </svg>
                                                                    Debit
                                                                </span>
                                                            }
                                                            checked={data.transaction_type === "debit"}
                                                            onChange={(e) => setData("transaction_type", e.target.value)}
                                                            className="text-danger"
                                                        />
                                                    </div>
                                                    {errors?.['data.transaction_type'] && (
                                                        <div className="text-danger text-sm mt-1">{errors['data.transaction_type']}</div>
                                                    )}
                                                </div>
                                            </CCol>
                                        </CRow>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center pt-6 border-t border-gray-200">
                                    <CButton
                                        type="submit"
                                        color="primary"
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 rounded-xl font-semibold text-white w-full sm:w-auto min-w-[200px]"
                                    >
                                        Update Transaction
                                    </CButton>
                                </div>
                            </form>

                            {/* Payment History Section */}
                            <div className="mt-8">
                                <h5 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h5>
                                <div className="overflow-x-auto">
                                    <CTable bordered hover responsive className="min-w-full">
                                        <CTableHead className="bg-gray-50">
                                            <CTableRow>
                                                <CTableHeaderCell className="text-sm font-semibold text-gray-700 py-3 whitespace-nowrap">#</CTableHeaderCell>
                                                <CTableHeaderCell className="text-sm font-semibold text-gray-700 py-3 whitespace-nowrap">Date</CTableHeaderCell>
                                                <CTableHeaderCell className="text-sm font-semibold text-gray-700 py-3 whitespace-nowrap">Paid Amount</CTableHeaderCell>
                                                <CTableHeaderCell className="text-sm font-semibold text-gray-700 py-3 whitespace-nowrap">Transfer Type</CTableHeaderCell>
                                                <CTableHeaderCell className="text-sm font-semibold text-gray-700 py-3 whitespace-nowrap">Bank</CTableHeaderCell>
                                                <CTableHeaderCell className="text-sm font-semibold text-gray-700 py-3 whitespace-nowrap text-center">Actions</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {payments.length === 0 ? (
                                                <CTableRow>
                                                    <CTableDataCell colSpan={6} className="text-center text-muted py-8">
                                                        <div className="text-gray-500">
                                                            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                            </svg>
                                                            <p className="text-lg font-medium">No payment records found</p>
                                                        </div>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            ) : (
                                                payments.map((payment, index) => (
                                                    <CTableRow key={payment.id} className="hover:bg-gray-50">
                                                        <CTableDataCell className="py-3 whitespace-nowrap">{index + 1}</CTableDataCell>
                                                        <CTableDataCell className="py-3 whitespace-nowrap">{payment.paid_on}</CTableDataCell>
                                                        <CTableDataCell className="py-3 whitespace-nowrap">
                                                            <NumericFormat value={payment.paid_amount} displayType="text" thousandSeparator="," />
                                                        </CTableDataCell>
                                                        <CTableDataCell className="py-3 whitespace-nowrap">{capitalize(payment.transfer_type.replace(/_/g, ' '))}</CTableDataCell>
                                                        <CTableDataCell className="py-3 whitespace-nowrap">{payment?.bank?.bank_name ?? '-'}</CTableDataCell>
                                                        <CTableDataCell className="py-3 whitespace-nowrap">
                                                            <div className="flex justify-center space-x-2">
                                                                <CButton size="sm" color="outline-warning" onClick={() => handlePaymentEdit(payment)} className="d-flex align-items-center gap-1 px-3 text-xs">
                                                                    <CIcon icon={cilPencil} />
                                                                    <span className="hidden sm:inline">Edit</span>
                                                                </CButton>
                                                                <CButton size="sm" color="outline-danger" onClick={() => handleDeletePayment(payment.id)} className="d-flex align-items-center gap-1 px-3 text-xs">
                                                                    <CIcon icon={cilTrash} />
                                                                    <span className="hidden sm:inline">Delete</span>
                                                                </CButton>
                                                            </div>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                ))
                                            )}
                                        </CTableBody>
                                        <CTableFoot>
                                            <CTableRow>
                                                <CTableDataCell colSpan={2} className="py-3"><strong>Total Paid:</strong></CTableDataCell>
                                                <CTableDataCell className="py-3">
                                                    <strong>PKR {totalPaidAmount.toLocaleString()}</strong>
                                                </CTableDataCell>
                                                <CTableDataCell colSpan={3}></CTableDataCell>
                                            </CTableRow>
                                        </CTableFoot>
                                    </CTable>
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
