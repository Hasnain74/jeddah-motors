// resources/js/Pages/BankIndex.jsx
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
    CBadge,
} from '@coreui/react';
import { cilPlus, cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useState } from 'react';
import { capitalize } from 'lodash';
import BankModal from '../Components/BankModal';

export default function BankIndex() {
    const { props } = usePage();
    const { data, meta, links } = props.banks || {};
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedBank, setSelectedBank] = useState(null);
    const flash = props.flash || {};

    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatAmount = (amount) => {
        return parseFloat(amount).toLocaleString();
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
        router.get('/banks', { search }, { preserveState: true });
    };

    const handleEdit = (bank) => {
        setSelectedBank(bank);
        setModalMode('edit');
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this bank?')) {
            router.delete(`/banks/delete/${id}`, {
                preserveScroll: true
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Banks" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        {flash.success && (
                            <div className="alert alert-success text-green-700 mb-4">
                                {flash.success}
                            </div>
                        )}

                        <div className="flex justify-between mb-4 gap-2 flex-wrap">
                            <CButton color="primary" onClick={() => {
                                setModalMode('add');
                                setSelectedBank(null);
                                setShowModal(true);
                            }}>
                                <CIcon icon={cilPlus} size="lg" /> Add Bank
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
                        </div>

                        <CTable striped hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>Bank Name</CTableHeaderCell>
                                    <CTableHeaderCell>Balance (PKR)</CTableHeaderCell>
                                    <CTableHeaderCell>Created At</CTableHeaderCell>
                                    <CTableHeaderCell>Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {data?.map((bank) => (
                                    <CTableRow key={bank.id}>
                                        <CTableDataCell>{capitalize(bank.bank_name)}</CTableDataCell>
                                        <CTableDataCell><CBadge color={'info'} className="me-2">RS</CBadge>{formatAmount(bank.balance)}</CTableDataCell>
                                        <CTableDataCell>{formatDate(bank.created_at)}</CTableDataCell>
                                        <CTableDataCell>
                                            <CButton size="sm" color="warning" className="me-2" onClick={() => handleEdit(bank)}>
                                                <CIcon icon={cilPencil} />
                                            </CButton>
                                            <CButton size="sm" color="danger" onClick={() => handleDelete(bank.id)}>
                                                <CIcon icon={cilTrash} />
                                            </CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
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

            <BankModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                mode={modalMode}
                bank={selectedBank}
            />
        </AuthenticatedLayout>
    );
}
