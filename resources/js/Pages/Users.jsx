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
    CBadge, CAlert, CCard, CCardBody, CInputGroup, CInputGroupText,
} from '@coreui/react';
import { cilPlus, cilPencil, cilTrash, cilSearch, cilUser, cilEnvelopeOpen, cilCalendar, cilUserFollow } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import React, { useState } from 'react';
import { capitalize } from "lodash";

export default function Users() {
    const { props } = usePage();
    const { data, links, from, to, total } = props.users || {};
    const filters = props.filters || {};
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.perPage || 10);
    const { flash } = usePage().props || {};

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
        router.get('users', { search }, { preserveState: true });
    };

    const handleClearSearch = () => {
        setSearch('');
        router.get('users', {}, { preserveState: true });
    };

    const handlePerPageChange = (e) => {
        const value = e.target.value;
        setPerPage(value);
        router.get('users', { search, perPage: value }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(`/users/${id}/delete`, {
                preserveScroll: true,
                onSuccess: () => {
                    // Success handled by flash message
                }
            });
        }
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <AuthenticatedLayout>
            <Head title="Users Management" />

            <div className="py-4 md:py-8">
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="mb-4 lg:mb-0">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Users Management</h1>
                                <p className="mt-1 md:mt-2 text-sm text-gray-600">
                                    Manage and monitor all user accounts in your system
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <CButton
                                    color="primary"
                                    onClick={() => router.get('register')}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base w-full sm:w-auto"
                                >
                                    <CIcon icon={cilPlus} className="me-1 md:me-2" />
                                    Add New User
                                </CButton>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Card */}
                    <CCard className="border-0 shadow-lg rounded-2xl overflow-hidden">
                        <CCardBody className="p-0">
                            {/* Filters Section */}
                            <div className="p-4 md:p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                                <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between gap-4">
                                    <form onSubmit={handleSearch} className="w-full md:w-auto">
                                        <CInputGroup className="w-full md:w-96">
                                            <CInputGroupText>
                                                <CIcon icon={cilSearch}/>
                                            </CInputGroupText>
                                            <CFormInput
                                                type="text"
                                                placeholder="Search users by name..."
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

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Show:</span>
                                            <CFormSelect
                                                value={perPage}
                                                onChange={handlePerPageChange}
                                                className="w-auto border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                            >
                                                {[10, 25, 50, 100].map(size => (
                                                    <option key={size} value={size}>{size}</option>
                                                ))}
                                            </CFormSelect>
                                        </div>
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

                            {flash?.error && (
                                <div className="m-4 md:m-6 mb-0">
                                    <CAlert color="danger" dismissible className="rounded-xl border-l-4 border-red-500 text-sm">
                                        <strong>Error!</strong> {flash.error}
                                    </CAlert>
                                </div>
                            )}

                            {/* Users Table */}
                            <div className="p-4 md:p-6">
                                <div className="overflow-x-auto">
                                    <CTable striped hover responsive className="min-w-full">
                                        <CTableHead className="bg-gray-50">
                                            <CTableRow>
                                                <CTableHeaderCell className="text-sm font-semibold text-gray-700 py-3 whitespace-nowrap">
                                                    User
                                                </CTableHeaderCell>
                                                <CTableHeaderCell className="text-sm font-semibold text-gray-700 py-3 whitespace-nowrap">
                                                    Email
                                                </CTableHeaderCell>
                                                <CTableHeaderCell className="text-sm font-semibold text-gray-700 py-3 whitespace-nowrap">
                                                    Created Date
                                                </CTableHeaderCell>
                                                <CTableHeaderCell className="text-sm font-semibold text-gray-700 py-3 whitespace-nowrap">
                                                    Created By
                                                </CTableHeaderCell>
                                                <CTableHeaderCell className="text-sm font-semibold text-gray-700 py-3 whitespace-nowrap text-center">
                                                    Actions
                                                </CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {data?.length > 0 ? data.map((user) => (
                                                <CTableRow key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                    <CTableDataCell className="py-3 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs md:text-sm me-2 md:me-3">
                                                                {getInitials(user.name)}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900 text-sm md:text-base">
                                                                    {capitalize(user.name) || '-'}
                                                                </div>
                                                                <CBadge color="success" shape="rounded" className="text-xs mt-1">
                                                                    Active
                                                                </CBadge>
                                                            </div>
                                                        </div>
                                                    </CTableDataCell>
                                                    <CTableDataCell className="py-3 whitespace-nowrap">
                                                        <div className="flex items-center text-gray-600">
                                                            <CIcon icon={cilEnvelopeOpen} className="me-1 md:me-2 text-gray-400 hidden md:block" />
                                                            <span className="text-sm md:text-base truncate max-w-[150px] md:max-w-none">
                                                                {user.email}
                                                            </span>
                                                        </div>
                                                    </CTableDataCell>
                                                    <CTableDataCell className="py-3 whitespace-nowrap">
                                                        <div className="flex items-center text-gray-600">
                                                            <CIcon icon={cilCalendar} className="me-1 md:me-2 text-gray-400 hidden md:block" />
                                                            <span className="text-sm md:text-base">
                                                                {formatDate(user.created_at)}
                                                            </span>
                                                        </div>
                                                    </CTableDataCell>
                                                    <CTableDataCell className="py-3 whitespace-nowrap">
                                                        {user.created_by ? (
                                                            <div className="flex items-center">
                                                                <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium me-1 md:me-2 hidden md:flex">
                                                                    {getInitials(user.created_by.name)}
                                                                </div>
                                                                <span className="text-gray-600 text-sm md:text-base">
                                                                    {capitalize(user.created_by.name)}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm md:text-base">--</span>
                                                        )}
                                                    </CTableDataCell>
                                                    <CTableDataCell className="py-3 whitespace-nowrap">
                                                        <div className="flex justify-center space-x-1 lg:space-x-2">
                                                            <CButton
                                                                size="sm"
                                                                color="outline-warning"
                                                                onClick={() => router.get(route('users.edit', user.id))}
                                                                className="d-flex align-items-center gap-1 px-2 lg:px-3 text-xs"
                                                            >
                                                                <CIcon icon={cilPencil} />
                                                                <span className="hidden sm:inline">Edit</span>
                                                            </CButton>
                                                            <CButton
                                                                size="sm"
                                                                color="outline-danger"
                                                                onClick={() => handleDelete(user.id)}
                                                                className="d-flex align-items-center gap-1 px-2 lg:px-3 text-xs"
                                                            >
                                                                <CIcon icon={cilTrash} />
                                                                <span className="hidden sm:inline">Delete</span>
                                                            </CButton>
                                                        </div>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            )) : (
                                                <CTableRow>
                                                    <CTableDataCell colSpan="5" className="text-center py-8">
                                                        <div className="text-gray-500">
                                                            <CIcon icon={cilUser} className="text-4xl mb-2 opacity-50" />
                                                            <p className="text-lg font-medium">No users found</p>
                                                            <p className="text-sm">Try adjusting your search criteria or add a new user.</p>
                                                        </div>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            )}
                                        </CTableBody>
                                    </CTable>
                                </div>

                                {/* Pagination and Results Info */}
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-6 pt-6 border-t border-gray-200">
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
                            </div>
                        </CCardBody>
                    </CCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
