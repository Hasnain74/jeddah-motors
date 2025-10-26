import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { CBreadcrumb, CBreadcrumbItem, CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";

export default function Edit({ user }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        put(route('users.update', user.id), {
            onFinish: () => reset('password', 'password_confirmation'),
            preserveScroll: true,
        });
    };

    const handleBack = () => {
        router.get(route('users.index'), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout header={
            <CBreadcrumb>
                <CBreadcrumbItem><Link href={route('users.index')}>Users</Link></CBreadcrumbItem>
                <CBreadcrumbItem active>Edit User</CBreadcrumbItem>
            </CBreadcrumb>
        }>
            <Head title={`Edit ${user?.name || 'User'}`} />

            <div className="py-4 md:py-8">
                <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="mb-4 lg:mb-0">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    Edit User
                                </h1>
                                <p className="mt-1 md:mt-2 text-sm text-gray-600">
                                    Update user information and permissions
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
                                    Back to Users
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form Card */}
                    <CCard className="border-0 shadow-lg rounded-2xl overflow-hidden">
                        <CCardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-0 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">User Information</h3>
                                        <p className="text-sm text-gray-600">Update user details and security settings</p>
                                    </div>
                                </div>
                            </div>
                        </CCardHeader>

                        <CCardBody className="p-6">
                            <form onSubmit={submit}>
                                <div className="space-y-6">
                                    <CRow>
                                        <CCol md={6}>
                                            <div className="space-y-1">
                                                <InputLabel htmlFor="name" value="Full Name" className="text-sm font-medium text-gray-700" />
                                                <TextInput
                                                    id="name"
                                                    name="name"
                                                    value={data.name}
                                                    className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                    autoComplete="name"
                                                    isFocused={true}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    required
                                                    placeholder="Enter full name"
                                                />
                                                <InputError message={errors.name} className="mt-1" />
                                            </div>
                                        </CCol>
                                        <CCol md={6}>
                                            <div className="space-y-1">
                                                <InputLabel htmlFor="email" value="Email Address" className="text-sm font-medium text-gray-700" />
                                                <TextInput
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={data.email}
                                                    className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                    autoComplete="email"
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    required
                                                    placeholder="Enter email address"
                                                />
                                                <InputError message={errors.email} className="mt-1" />
                                            </div>
                                        </CCol>
                                    </CRow>

                                    {/* Password Section */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6">
                                        <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Password Update (Optional)
                                        </h4>
                                        <p className="text-xs text-blue-600 mb-4">
                                            Leave password fields blank to keep the current password unchanged
                                        </p>

                                        <CRow>
                                            <CCol md={6}>
                                                <div className="space-y-1">
                                                    <InputLabel
                                                        htmlFor="password"
                                                        value="New Password"
                                                        className="text-sm font-medium text-gray-700"
                                                    />
                                                    <TextInput
                                                        id="password"
                                                        type="password"
                                                        name="password"
                                                        value={data.password}
                                                        className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                        autoComplete="new-password"
                                                        onChange={(e) => setData('password', e.target.value)}
                                                        placeholder="Enter new password"
                                                    />
                                                    <InputError message={errors.password} className="mt-1" />
                                                </div>
                                            </CCol>
                                            <CCol md={6}>
                                                <div className="space-y-1">
                                                    <InputLabel
                                                        htmlFor="password_confirmation"
                                                        value="Confirm New Password"
                                                        className="text-sm font-medium text-gray-700"
                                                    />
                                                    <TextInput
                                                        id="password_confirmation"
                                                        type="password"
                                                        name="password_confirmation"
                                                        value={data.password_confirmation}
                                                        className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                        autoComplete="new-password"
                                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                                        placeholder="Confirm new password"
                                                    />
                                                    <InputError
                                                        message={errors.password_confirmation}
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </CCol>
                                        </CRow>
                                    </div>

                                    {/* User Metadata */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 md:p-6">
                                        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            User Information
                                        </h4>
                                        <CRow className="text-sm text-gray-600">
                                            <CCol md={6} className="mb-3 md:mb-0">
                                                <div className="space-y-2">
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span><strong>Created:</strong> {formatDate(user?.created_at)}</span>
                                                    </div>
                                                </div>
                                            </CCol>
                                            <CCol md={6}>
                                                <div className="space-y-2">
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                        <span><strong>Last Updated:</strong> {formatDate(user?.updated_at)}</span>
                                                    </div>
                                                </div>
                                            </CCol>
                                        </CRow>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200">
                                        <PrimaryButton
                                            type="submit"
                                            disabled={processing}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 rounded-xl font-semibold text-white w-full sm:w-auto"
                                        >
                                            {processing ? (
                                                <div className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Updating...
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Update User
                                                </div>
                                            )}
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </CCardBody>
                    </CCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
