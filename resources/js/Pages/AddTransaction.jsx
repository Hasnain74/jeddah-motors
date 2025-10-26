import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, Link, useForm, usePage} from "@inertiajs/react";
import {
    CRow,
    CCol,
    CFormInput,
    CButton,
    CFormSelect,
    CFormCheck,
    CAlert,
    CBreadcrumb,
    CBreadcrumbItem,
    CCard,
    CCardBody,
    CCardHeader
} from "@coreui/react";
import {useEffect, useState} from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {NumericFormat, PatternFormat} from "react-number-format";

export default function AddTransaction() {
    const { customers, banks } = usePage().props;
    const { flash } = usePage().props || {};
    const animatedComponents = makeAnimated();

    const getInitialState = () => ({
        customer_id: '',
        customer_name: '',
        cnic: '',
        phone_no: '',
        vehicle_name: '',
        company: '',
        model: '',
        paid_on: '',
        total_amount: '',
        paid_amount: '',
        remaining_amount: '',
        bank_id: '',
        transfer_type: '',
        transaction_type: '',
        isNewCustomer: false,
    });

    const [initialState] = useState(getInitialState());
    const { data, setData, post, processing, errors, reset } = useForm({ ...initialState });

    const manualReset = () => {
        setData({ ...initialState });
    };

    useEffect(() => {
        if (flash?.success) {
            manualReset();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        if (Object.keys(errors).length > 0) {
            const firstErrorField = document.querySelector('.is-invalid, .text-danger');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [flash, errors]);

    useEffect(() => {
        const total = parseFloat(data.total_amount.toString().replace(/,/g, '')) || 0;
        const paid = parseFloat(data.paid_amount.toString().replace(/,/g, '')) || 0;
        const remaining = total - paid;
        setData('remaining_amount', remaining.toFixed(2));
    }, [data.total_amount, data.paid_amount]);

    function handleSubmit(e) {
        e.preventDefault();

        const cleanedData = {
            ...data,
            total_amount: data.total_amount.toString().replace(/,/g, ''),
            paid_amount: data.paid_amount.toString().replace(/,/g, ''),
            remaining_amount: data.remaining_amount.toString().replace(/,/g, ''),
        };

        post(route('store.transaction'), {
            data: cleanedData,
            preserveScroll: true,
            onSuccess: () => {
                setData({
                    ...initialState,
                    isNewCustomer: data.isNewCustomer
                });
            },
        });
    }

    const customerOptions = customers.map((c) => ({
        value: c.id,
        label: `${c.customer_name} — ${c.cnic}`,
    }));

    const handleBack = () => {
        window.history.back();
    };

    return (
        <AuthenticatedLayout
            header={
                <CBreadcrumb>
                    <CBreadcrumbItem><Link href={route('dashboard')}>Transactions</Link></CBreadcrumbItem>
                    <CBreadcrumbItem active>Add New Transaction</CBreadcrumbItem>
                </CBreadcrumb>
            }
        >
            <Head title="Add Transaction" />

            <div className="py-4 md:py-8">
                <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="mb-4 lg:mb-0">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add New Transaction</h1>
                                <p className="mt-1 md:mt-2 text-sm text-gray-600">
                                    Create a new transaction record with customer and payment details
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

                    {/* Main Form Card */}
                    <CCard className="border-0 shadow-lg rounded-2xl overflow-hidden">
                        <CCardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-0 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div
                                        className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
                                        <p className="text-sm text-gray-600">Fill in all the required information</p>
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
                            {errors.error && (
                                <CAlert color="danger" dismissible className="rounded-xl border-l-4 border-red-500 mb-6">
                                    <strong>Error!</strong> {errors.error}
                                </CAlert>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Customer Info Section */}
                                <div className="mb-8">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                        <h5 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Customer Information</h5>
                                        <CButton
                                            color={data.isNewCustomer ? 'primary' : 'warning'}
                                            size="sm"
                                            onClick={() => setData('isNewCustomer', !data.isNewCustomer)}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 px-4 py-2 rounded-xl font-semibold text-white w-full sm:w-auto"
                                        >
                                            {data.isNewCustomer ? 'Select Existing Customer' : 'Add New Customer'}
                                        </CButton>
                                    </div>

                                    <CRow className="g-4">
                                        {data.isNewCustomer ? (
                                            <>
                                                <CCol md={6}>
                                                    <div className="space-y-1">
                                                        <label className="text-sm font-medium text-gray-700">Customer Name</label>
                                                        <CFormInput
                                                            name="customer_name"
                                                            placeholder="Enter customer name"
                                                            value={data.customer_name}
                                                            onChange={(e) => setData('customer_name', e.target.value)}
                                                            className="border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                            invalid={!!errors.customer_name}
                                                        />
                                                        {errors.customer_name && (
                                                            <div className="text-danger text-sm mt-1">{errors.customer_name}</div>
                                                        )}
                                                    </div>
                                                </CCol>
                                                <CCol md={6}>
                                                    <div className="space-y-1">
                                                        <label className="text-sm font-medium text-gray-700">CNIC</label>
                                                        <PatternFormat
                                                            format="#####-#######-#"
                                                            mask="_"
                                                            placeholder="Enter CNIC"
                                                            className="form-control border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                            value={data.cnic}
                                                            onValueChange={({ formattedValue }) => setData("cnic", formattedValue)}
                                                        />
                                                        {errors.cnic && (
                                                            <div className="text-danger text-sm mt-1">{errors.cnic}</div>
                                                        )}
                                                    </div>
                                                </CCol>
                                                <CCol md={6}>
                                                    <div className="space-y-1">
                                                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                                        <CFormInput
                                                            name="phone_no"
                                                            placeholder="Enter phone number"
                                                            value={data.phone_no}
                                                            onChange={(e) => setData('phone_no', e.target.value)}
                                                            className="border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                            invalid={!!errors.phone_no}
                                                        />
                                                        {errors.phone_no && (
                                                            <div className="text-danger text-sm mt-1">{errors.phone_no}</div>
                                                        )}
                                                    </div>
                                                </CCol>
                                            </>
                                        ) : (
                                            <CCol md={6}>
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-gray-700">Select Customer</label>
                                                    <Select
                                                        name="customer_id"
                                                        value={customerOptions.find((opt) => opt.value === data.customer_id) || null}
                                                        onChange={(selectedOption) => setData('customer_id', selectedOption ? selectedOption.value : '')}
                                                        options={customerOptions}
                                                        placeholder="Search and select customer..."
                                                        isClearable={true}
                                                        classNamePrefix="react-select"
                                                        className={errors.customer_id ? 'is-invalid' : ''}
                                                        components={animatedComponents}
                                                        styles={{
                                                            control: (base) => ({
                                                                ...base,
                                                                borderRadius: '12px',
                                                                borderColor: '#d1d5db',
                                                                padding: '4px 8px',
                                                                minHeight: '52px',
                                                                '&:hover': {
                                                                    borderColor: '#3b82f6'
                                                                }
                                                            })
                                                        }}
                                                    />
                                                    {errors.customer_id && (
                                                        <div className="text-danger text-sm mt-1">{errors.customer_id}</div>
                                                    )}
                                                </div>
                                            </CCol>
                                        )}
                                    </CRow>
                                </div>

                                {/* Vehicle Info Section */}
                                <div className="mb-8">
                                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h5>
                                    <CRow className="g-4">
                                        <CCol md={6}>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700">Vehicle Name</label>
                                                <CFormInput
                                                    name="vehicle_name"
                                                    placeholder="Enter vehicle name"
                                                    value={data.vehicle_name}
                                                    onChange={(e) => setData('vehicle_name', e.target.value)}
                                                    className="border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                    invalid={!!errors.vehicle_name}
                                                />
                                                {errors.vehicle_name && (
                                                    <div className="text-danger text-sm mt-1">{errors.vehicle_name}</div>
                                                )}
                                            </div>
                                        </CCol>
                                        <CCol md={6}>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700">Company</label>
                                                <CFormInput
                                                    name="company"
                                                    placeholder="Enter company name"
                                                    value={data.company}
                                                    onChange={(e) => setData('company', e.target.value)}
                                                    className="border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                    invalid={!!errors.company}
                                                />
                                                {errors.company && (
                                                    <div className="text-danger text-sm mt-1">{errors.company}</div>
                                                )}
                                            </div>
                                        </CCol>
                                        <CCol md={6}>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700">Model</label>
                                                <CFormInput
                                                    name="model"
                                                    placeholder="Enter model"
                                                    value={data.model}
                                                    onChange={(e) => setData('model', e.target.value)}
                                                    className="border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                    invalid={!!errors.model}
                                                />
                                                {errors.model && (
                                                    <div className="text-danger text-sm mt-1">{errors.model}</div>
                                                )}
                                            </div>
                                        </CCol>
                                    </CRow>
                                </div>

                                {/* Payment Info Section */}
                                <div className="mb-8">
                                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h5>
                                    <CRow className="g-4">
                                        <CCol md={6}>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700">Payment Date</label>
                                                <CFormInput
                                                    name="paid_on"
                                                    type="date"
                                                    value={data.paid_on}
                                                    onChange={(e) => setData('paid_on', e.target.value)}
                                                    className="border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                    invalid={!!errors.paid_on}
                                                />
                                                {errors.paid_on && (
                                                    <div className="text-danger text-sm mt-1">{errors.paid_on}</div>
                                                )}
                                            </div>
                                        </CCol>
                                        <CCol md={6}>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700">Total Amount</label>
                                                <NumericFormat
                                                    thousandSeparator=","
                                                    value={data.total_amount}
                                                    onValueChange={({ value }) => setData('total_amount', value)}
                                                    placeholder="Enter total amount"
                                                    className={`form-control border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4 ${errors.total_amount ? 'is-invalid' : ''}`}
                                                />
                                                {errors.total_amount && (
                                                    <div className="text-danger text-sm mt-1">{errors.total_amount}</div>
                                                )}
                                            </div>
                                        </CCol>
                                        <CCol md={6}>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700">Paid Amount</label>
                                                <NumericFormat
                                                    thousandSeparator=","
                                                    value={data.paid_amount}
                                                    onValueChange={({ value }) => setData('paid_amount', value)}
                                                    placeholder="Enter paid amount"
                                                    className={`form-control border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4 ${errors.paid_amount ? 'is-invalid' : ''}`}
                                                />
                                                {errors.paid_amount && (
                                                    <div className="text-danger text-sm mt-1">{errors.paid_amount}</div>
                                                )}
                                            </div>
                                        </CCol>
                                        <CCol md={6}>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700">Remaining Amount</label>
                                                <NumericFormat
                                                    thousandSeparator=","
                                                    name="remaining_amount"
                                                    placeholder="Remaining amount"
                                                    value={data.remaining_amount}
                                                    disabled
                                                    className="form-control border-gray-300 rounded-xl bg-gray-50 py-3 px-4"
                                                />
                                            </div>
                                        </CCol>
                                        <CCol md={6}>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700">Bank</label>
                                                <CFormSelect
                                                    name="bank_id"
                                                    value={data.bank_id}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setData('bank_id', value === '' ? null : parseInt(value));
                                                    }}
                                                    className="border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                    invalid={!!errors.bank_id}
                                                >
                                                    <option value="">Select Bank</option>
                                                    {Object.entries(banks).map(([id, name]) => (
                                                        <option key={id} value={id}>{name}</option>
                                                    ))}
                                                </CFormSelect>
                                                {errors.bank_id && (
                                                    <div className="text-danger text-sm mt-1">{errors.bank_id}</div>
                                                )}
                                            </div>
                                        </CCol>
                                        <CCol md={6}>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700">Transfer Type</label>
                                                <CFormSelect
                                                    name="transfer_type"
                                                    value={data.transfer_type}
                                                    onChange={(e) => setData('transfer_type', e.target.value)}
                                                    className="border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                    invalid={!!errors.transfer_type}
                                                >
                                                    <option value="">Select Transfer Type</option>
                                                    <option value="cash">Cash</option>
                                                    <option value="cheque">Cheque</option>
                                                    <option value="online_transfer">Online Transfer</option>
                                                </CFormSelect>
                                                {errors.transfer_type && (
                                                    <div className="text-danger text-sm mt-1">{errors.transfer_type}</div>
                                                )}
                                            </div>
                                        </CCol>
                                        <CCol md={12}>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700 mb-3 block">Transaction Type</label>
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
                                                        checked={data.transaction_type === 'credit'}
                                                        onChange={(e) => setData('transaction_type', e.target.value)}
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
                                                        checked={data.transaction_type === 'debit'}
                                                        onChange={(e) => setData('transaction_type', e.target.value)}
                                                        className="text-danger"
                                                    />
                                                </div>
                                                {errors.transaction_type && (
                                                    <div className="text-danger text-sm mt-1">{errors.transaction_type}</div>
                                                )}
                                            </div>
                                        </CCol>
                                    </CRow>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center pt-6 border-t border-gray-200">
                                    <CButton
                                        type="submit"
                                        color="primary"
                                        disabled={processing}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 rounded-xl font-semibold text-white w-full sm:w-auto min-w-[200px]"
                                    >
                                        {processing ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Create Transaction
                                            </div>
                                        )}
                                    </CButton>
                                </div>
                            </form>
                        </CCardBody>
                    </CCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
