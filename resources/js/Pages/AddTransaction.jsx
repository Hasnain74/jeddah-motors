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
    CBreadcrumbItem
} from "@coreui/react";
import {IMaskInput} from "react-imask";
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
        }
    }, [flash]);

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

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 space-y-8">
                            {errors.error && (
                                <div className="text-danger mt-1">{errors.error}</div>
                            )}
                            {flash?.success && (
                                <CAlert color="success" dismissible>{flash.success}</CAlert>
                            )}
                            <form onSubmit={handleSubmit}>
                                {/* Customer Info */}
                                <div className="mb-4">
                                    <h5 className="mb-2 font-semibold text-lg">Customer Info</h5>
                                    <CButton
                                        color={data.isNewCustomer ? 'primary' : 'warning'}
                                        size="sm"
                                        onClick={() => setData('isNewCustomer', !data.isNewCustomer)}
                                        className="mb-3"
                                    >
                                        {data.isNewCustomer ? 'Select Existing Customer' : 'Add New Customer'}
                                    </CButton>

                                    <CRow className="g-4">
                                        {data.isNewCustomer ? (
                                            <>
                                                <CCol md={6}>
                                                    <CFormInput
                                                        name="customer_name"
                                                        placeholder="Customer Name"
                                                        value={data.customer_name}
                                                        onChange={(e) => setData('customer_name', e.target.value)}
                                                        invalid={!!errors.customer_name}
                                                    />
                                                    {errors.customer_name && (
                                                        <div className="text-danger mt-1">{errors.customer_name}</div>
                                                    )}
                                                </CCol>
                                                <CCol md={6}>
                                                    <PatternFormat
                                                        format="#####-#######-#"
                                                        mask="_"
                                                        placeholder="CNIC"
                                                        className="form-control"
                                                        value={data.cnic}
                                                        onValueChange={({ formattedValue }) => setData("cnic", formattedValue)}
                                                    />
                                                    {errors.cnic && (
                                                        <div className="text-danger mt-1">{errors.cnic}</div>
                                                    )}
                                                </CCol>
                                                <CCol md={6}>
                                                    <CFormInput
                                                        name="phone_no"
                                                        placeholder="Phone Number"
                                                        value={data.phone_no}
                                                        onChange={(e) => setData('phone_no', e.target.value)}
                                                        invalid={!!errors.phone_no}
                                                    />
                                                    {errors.phone_no && (
                                                        <div className="text-danger mt-1">{errors.phone_no}</div>
                                                    )}
                                                </CCol>
                                            </>
                                        ) : (
                                            <CCol md={6}>
                                                <Select
                                                    name="customer_id"
                                                    value={customerOptions.find((opt) => opt.value === data.customer_id) || null}
                                                    onChange={(selectedOption) => setData('customer_id', selectedOption ? selectedOption.value : '')}
                                                    options={customerOptions}
                                                    placeholder="Select Customer"
                                                    isClearable={true}
                                                    classNamePrefix="react-select"
                                                    className={errors.customer_id ? 'is-invalid' : ''}
                                                    components={animatedComponents}
                                                />
                                                {errors.customer_id && (
                                                    <div className="text-danger mt-1">{errors.customer_id}</div>
                                                )}
                                            </CCol>
                                        )}
                                    </CRow>
                                </div>

                                {/* Vehicle Info */}
                                <div className="mb-4">
                                    <h5 className="mb-2 font-semibold text-lg">Vehicle Info</h5>
                                    <CRow className="g-4">
                                        <CCol md={6}>
                                            <CFormInput
                                                name="vehicle_name"
                                                placeholder="Vehicle Name"
                                                value={data.vehicle_name}
                                                onChange={(e) => setData('vehicle_name', e.target.value)}
                                                invalid={!!errors.vehicle_name}
                                            />
                                            {errors.vehicle_name && (
                                                <div className="text-danger mt-1">{errors.vehicle_name}</div>
                                            )}
                                        </CCol>
                                        <CCol md={6}>
                                            <CFormInput
                                                name="company"
                                                placeholder="Company"
                                                value={data.company}
                                                onChange={(e) => setData('company', e.target.value)}
                                                invalid={!!errors.company}
                                            />
                                            {errors.company && (
                                                <div className="text-danger mt-1">{errors.company}</div>
                                            )}
                                        </CCol>
                                        <CCol md={6}>
                                            <CFormInput
                                                name="model"
                                                placeholder="Model"
                                                value={data.model}
                                                onChange={(e) => setData('model', e.target.value)}
                                                invalid={!!errors.model}
                                            />
                                            {errors.model && (
                                                <div className="text-danger mt-1">{errors.model}</div>
                                            )}
                                        </CCol>
                                    </CRow>
                                </div>

                                {/* Payment Info */}
                                <div className="mb-4">
                                    <h5 className="mb-2 font-semibold text-lg">Payment Info</h5>
                                    <CRow className="g-4">
                                        <CCol md={6}>
                                            <CFormInput
                                                name="paid_on"
                                                type="date"
                                                value={data.paid_on}
                                                onChange={(e) => setData('paid_on', e.target.value)}
                                                invalid={!!errors.paid_on}
                                            />
                                            {errors.paid_on && (
                                                <div className="text-danger mt-1">{errors.paid_on}</div>
                                            )}
                                        </CCol>
                                        <CCol md={6}>
                                            <NumericFormat
                                                thousandSeparator=","
                                                value={data.total_amount}
                                                onValueChange={({ value }) => setData('total_amount', value)}
                                                placeholder="Total Amount"
                                                className={`form-control ${errors.total_amount ? 'is-invalid' : ''}`}
                                            />
                                            {errors.total_amount && (
                                                <div className="text-danger mt-1">{errors.total_amount}</div>
                                            )}
                                        </CCol>
                                        <CCol md={6}>
                                            <NumericFormat
                                                thousandSeparator=","
                                                value={data.paid_amount}
                                                onValueChange={({ value }) => setData('paid_amount', value)}
                                                placeholder="Paid Amount"
                                                className={`form-control ${errors.paid_amount ? 'is-invalid' : ''}`}
                                            />
                                            {errors.paid_amount && (
                                                <div className="text-danger mt-1">{errors.paid_amount}</div>
                                            )}
                                        </CCol>

                                        <CCol md={6}>
                                            <NumericFormat
                                                thousandSeparator=","
                                                name="remaining_amount"
                                                placeholder="Remaining Amount"
                                                value={data.remaining_amount}
                                                disabled
                                                className={`form-control`}
                                            />
                                        </CCol>

                                        <CCol md={6}>
                                            <CFormSelect
                                                name="bank_id"
                                                value={data.bank_id}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setData('bank_id', value === '' ? null : parseInt(value));
                                                }}
                                                invalid={!!errors.bank_id}
                                            >
                                                <option value="">Select Bank</option>
                                                {Object.entries(banks).map(([id, name]) => (
                                                    <option key={id} value={id}>{name}</option>
                                                ))}
                                            </CFormSelect>
                                            {errors.bank_id && (
                                                <div className="text-danger mt-1">{errors.bank_id}</div>
                                            )}
                                        </CCol>
                                        <CCol md={6}>
                                            <CFormSelect
                                                name="transfer_type"
                                                value={data.transfer_type}
                                                onChange={(e) => setData('transfer_type', e.target.value)}
                                                invalid={!!errors.transfer_type}
                                            >
                                                <option value="">Select Transfer Type</option>
                                                <option value="cash">Cash</option>
                                                <option value="cheque">Cheque</option>
                                                <option value="online_transfer">Online Transfer</option>
                                            </CFormSelect>
                                            {errors.transfer_type && (
                                                <div className="text-danger mt-1">{errors.transfer_type}</div>
                                            )}
                                        </CCol>
                                        <CCol md={6} className="mt-3">
                                            <div className="d-flex gap-4 mt-3">
                                                <CFormCheck
                                                    type="radio"
                                                    name="transaction_type"
                                                    id="credit"
                                                    value="credit"
                                                    label="Credit"
                                                    checked={data.transaction_type === 'credit'}
                                                    onChange={(e) => setData('transaction_type', e.target.value)}
                                                    className="text-success"
                                                />
                                                <CFormCheck
                                                    type="radio"
                                                    name="transaction_type"
                                                    id="debit"
                                                    value="debit"
                                                    label="Debit"
                                                    checked={data.transaction_type === 'debit'}
                                                    onChange={(e) => setData('transaction_type', e.target.value)}
                                                    className="text-danger"
                                                />
                                            </div>
                                            {errors.transaction_type && (
                                                <div className="text-danger mt-1">{errors.transaction_type}</div>
                                            )}
                                        </CCol>
                                    </CRow>
                                </div>

                                <CCol md={12} className="mt-5 d-flex justify-content-center">
                                    <CButton
                                        type="submit"
                                        color="success"
                                        disabled={processing}
                                        style={{ minWidth: '200px' }}
                                    >
                                        Submit
                                    </CButton>
                                </CCol>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
