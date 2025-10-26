import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { CBreadcrumb, CBreadcrumbItem, CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const handleBack = () => {
        router.get(route('users.index'), {}, { preserveState: true, preserveScroll: true });
    };

    return (
        <AuthenticatedLayout header={
            <CBreadcrumb>
                <CBreadcrumbItem><Link href={route('users.index')}>Users</Link></CBreadcrumbItem>
                <CBreadcrumbItem active>Add User</CBreadcrumbItem>
            </CBreadcrumb>
        }>
            <Head title="Register New User" />

            <div className="py-4 md:py-8">
                <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="mb-4 lg:mb-0">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Register New User</h1>
                                <p className="mt-1 md:mt-2 text-sm text-gray-600">
                                    Create a new user account with secure credentials
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 w-full sm:w-auto"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                                    </svg>
                                    Back to Users
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Registration Form Card */}
                    <CCard className="border-0 shadow-lg rounded-2xl overflow-hidden">
                        <CCardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-0 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">User Information</h3>
                                        <p className="text-sm text-gray-600">Fill in the user details below</p>
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
                                                    autoComplete="username"
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    required
                                                    placeholder="Enter email address"
                                                />
                                                <InputError message={errors.email} className="mt-1" />
                                            </div>
                                        </CCol>
                                    </CRow>

                                    <CRow>
                                        <CCol md={6}>
                                            <div className="space-y-1">
                                                <InputLabel htmlFor="password" value="Password" className="text-sm font-medium text-gray-700" />
                                                <TextInput
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    value={data.password}
                                                    className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                    autoComplete="new-password"
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    required
                                                    placeholder="Enter password"
                                                />
                                                <InputError message={errors.password} className="mt-1" />
                                            </div>
                                        </CCol>
                                        <CCol md={6}>
                                            <div className="space-y-1">
                                                <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-sm font-medium text-gray-700" />
                                                <TextInput
                                                    id="password_confirmation"
                                                    type="password"
                                                    name="password_confirmation"
                                                    value={data.password_confirmation}
                                                    className="mt-1 block w-full border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 py-3 px-4"
                                                    autoComplete="new-password"
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    required
                                                    placeholder="Confirm password"
                                                />
                                                <InputError message={errors.password_confirmation} className="mt-1" />
                                            </div>
                                        </CCol>
                                    </CRow>

                                    {/* Form Actions */}
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
                                                    Creating User...
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    Create User
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
