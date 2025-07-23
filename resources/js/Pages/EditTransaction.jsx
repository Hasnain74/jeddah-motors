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
    CFormLabel, CTableFoot,
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

    console.log(data)

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
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        {flash?.success && <CAlert color="success">{flash.success}</CAlert>}

                        <form onSubmit={handleTransactionSubmit} className="space-y-6">
                            <h5 className="text-lg font-semibold mb-2">Customer Info</h5>
                            <CRow className="mt-3">
                                <CCol md={4}>
                                    <CFormLabel>Customer Name</CFormLabel>
                                    <CFormInput
                                        placeholder="Customer Name"
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        invalid={!!errors?.['data.customer_name']}
                                    />
                                    {errors?.['data.customer_name'] && (
                                        <div className="text-danger mt-1">{errors['data.customer_name']}</div>
                                    )}
                                </CCol>

                                <CCol md={4}>
                                <CFormLabel>CNIC</CFormLabel>
                                    <PatternFormat
                                        format="#####-#######-#"
                                        mask="_"
                                        placeholder="CNIC"
                                        className="form-control"
                                        value={data.cnic}
                                        onValueChange={({ value }) => setData("cnic", value)}
                                    />
                                    {errors?.['data.cnic'] && (
                                        <div className="text-danger mt-1">{errors['data.cnic']}</div>
                                    )}
                                </CCol>

                                <CCol md={4}>
                                    <CFormLabel>Phone No</CFormLabel>
                                    <CFormInput
                                        placeholder="Phone No"
                                        value={data.phone_no}
                                        onChange={(e) => setData('phone_no', e.target.value)}
                                        invalid={!!errors?.['data.phone_no']}
                                    />
                                    {errors?.['data.phone_no'] && (
                                        <div className="text-danger mt-1">{errors['data.phone_no']}</div>
                                    )}
                                </CCol>
                            </CRow>

                            <h5 className="text-lg font-semibold mt-4">Vehicle Info</h5>
                            <CRow>
                                <CCol md={4}>
                                    <CFormInput
                                        placeholder="Vehicle Name"
                                        value={data.vehicle_name}
                                        onChange={(e) => setData("vehicle_name", e.target.value)}
                                    />
                                </CCol>
                                <CCol md={4}>
                                    <CFormInput
                                        placeholder="Company"
                                        value={data.company}
                                        onChange={(e) => setData("company", e.target.value)}
                                    />
                                </CCol>
                                <CCol md={4}>
                                    <CFormInput
                                        placeholder="Model"
                                        value={data.model}
                                        onChange={(e) => setData("model", e.target.value)}
                                    />
                                </CCol>
                            </CRow>

                            <CButton color={showPaymentFields ? "danger" : "info"} onClick={() => {
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
                            }}>
                                {showPaymentFields ? "Cancel" : (editingPayment ? "Cancel Editing" : "Add Payment")}
                            </CButton>

                            {showPaymentFields && (
                                <div className="mt-4">
                                    <CRow className="g-4">
                                        <CCol md={4}>
                                            <CFormInput
                                                label="Paid on"
                                                type="date"
                                                value={data.paid_on}
                                                onChange={(e) => setData("paid_on", e.target.value)}
                                            />
                                        </CCol>
                                        <CCol md={4}>
                                            <CFormLabel>Paid Amount</CFormLabel>
                                            <NumericFormat
                                                thousandSeparator=","
                                                value={data.paid_amount}
                                                onValueChange={({ value }) => setData("paid_amount", value)}
                                                placeholder="Paid Amount"
                                                className="form-control"
                                            />
                                        </CCol>
                                        <CCol md={4}>
                                            <CFormSelect
                                                label="Bank"
                                                value={data.bank_name}
                                                onChange={(e) => setData("bank_name", e.target.value)}
                                            >
                                                <option value="">Select Bank</option>
                                                {Object.entries(banks).map(([id, name]) => (
                                                    <option key={id} value={id}>{name}</option>
                                                ))}
                                            </CFormSelect>
                                        </CCol>
                                        <CCol md={4}>
                                            <CFormSelect
                                                label="Transfer Type"
                                                value={data.transfer_type}
                                                onChange={(e) => setData("transfer_type", e.target.value)}
                                            >
                                                <option value="">Select Type</option>
                                                <option value="cash">Cash</option>
                                                <option value="cheque">Cheque</option>
                                                <option value="online_transfer">Online Transfer</option>
                                            </CFormSelect>
                                        </CCol>
                                    </CRow>
                                    <CButton
                                        type="submit"
                                        color="success"
                                        className="mt-4"
                                        onClick={handlePaymentSubmit}
                                    >
                                        {editingPayment ? "Update Payment" : "Save Payment"}
                                    </CButton>
                                </div>
                            )}

                            <div className="mt-4">
                                <h5 className="text-lg font-semibold">Payment Details</h5>
                                <CRow className="g-4">
                                    <CCol md={4}>
                                        <CFormLabel>Total Amount</CFormLabel>
                                        <NumericFormat
                                            thousandSeparator=","
                                            value={data.total_amount}
                                            onValueChange={({ value }) => setData("total_amount", value)}
                                            placeholder="Total Amount"
                                            className="form-control"
                                        />
                                        {errors?.['data.total_amount'] && (
                                            <div className="text-danger mt-1">{errors['data.total_amount']}</div>
                                        )}
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormLabel>Remaining Amount</CFormLabel>
                                        <NumericFormat
                                            value={remainingAmount}
                                            displayType="text"
                                            thousandSeparator=","
                                            className="form-control"
                                            readOnly
                                        />
                                    </CCol>
                                    <CCol md={4} className="align-self-center pt-4">
                                        <div className="d-flex gap-3">
                                            <CFormCheck
                                                type="radio"
                                                name="transaction_type"
                                                id="credit"
                                                value="credit"
                                                label="Credit"
                                                checked={data.transaction_type === "credit"}
                                                onChange={(e) => setData("transaction_type", e.target.value)}
                                                className="text-success"
                                            />
                                            <CFormCheck
                                                type="radio"
                                                name="transaction_type"
                                                id="debit"
                                                value="debit"
                                                label="Debit"
                                                checked={data.transaction_type === "debit"}
                                                onChange={(e) => setData("transaction_type", e.target.value)}
                                                className="text-danger"
                                            />
                                        </div>
                                        {errors?.['data.transaction_type'] && (
                                            <div className="text-danger mt-1">{errors['data.transaction_type']}</div>
                                        )}
                                    </CCol>
                                </CRow>
                            </div>
                            <CButton type="submit" color="success" className="mt-4">
                                Update Transaction
                            </CButton>
                        </form>

                        <div className="mt-5">
                            <h5 className="text-lg font-semibold mb-3">Payment History</h5>
                            <CTable bordered>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>#</CTableHeaderCell>
                                        <CTableHeaderCell>Date</CTableHeaderCell>
                                        <CTableHeaderCell>Paid Amount</CTableHeaderCell>
                                        <CTableHeaderCell>Transfer Type</CTableHeaderCell>
                                        <CTableHeaderCell>Bank</CTableHeaderCell>
                                        <CTableHeaderCell>Actions</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {payments.length === 0 ? (
                                        <CTableRow>
                                            <CTableDataCell colSpan={6} className="text-center text-muted">
                                                No payment records found
                                            </CTableDataCell>
                                        </CTableRow>
                                    ) : (
                                        payments.map((payment, index) => (
                                            <CTableRow key={payment.id}>
                                                <CTableDataCell>{index + 1}</CTableDataCell>
                                                <CTableDataCell>{payment.paid_on}</CTableDataCell>
                                                <CTableDataCell>
                                                    <NumericFormat value={payment.paid_amount} displayType="text" thousandSeparator="," />
                                                </CTableDataCell>
                                                <CTableDataCell>{capitalize(payment.transfer_type.replace(/_/g, ' '))}</CTableDataCell>
                                                <CTableDataCell>{payment?.bank?.bank_name ?? '-'}</CTableDataCell>
                                                <CTableDataCell>
                                                    <CButton size="sm" color="warning" onClick={() => handlePaymentEdit(payment)}>
                                                        <CIcon icon={cilPencil} />
                                                    </CButton>
                                                    <CButton className="ms-2" size="sm" color="danger" onClick={() => handleDeletePayment(payment.id)}>
                                                        <CIcon icon={cilTrash} />
                                                    </CButton>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))
                                    )}
                                </CTableBody>
                                <CTableFoot>
                                    <CTableRow>
                                        <CTableDataCell colSpan={2}><strong>Total Paid:</strong></CTableDataCell>
                                        <CTableDataCell>
                                            <strong>PKR {totalPaidAmount.toLocaleString()}</strong>
                                        </CTableDataCell>
                                        <CTableDataCell colSpan={3}></CTableDataCell>
                                    </CTableRow>
                                </CTableFoot>
                            </CTable>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
