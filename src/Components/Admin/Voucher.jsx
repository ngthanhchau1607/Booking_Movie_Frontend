import {useState, useEffect} from "react";
import styled from "styled-components";
import axios from "axios";
import VoucherModal from "../../modal/VoucherModal.jsx";
import ConfirmationModal from "../../modal/ConfirmationModal.jsx";
import Loading from "../../utils/Loading.jsx";

const apiDiscountUrl = import.meta.env.VITE_API_VOUCHER_URL;

function Voucher() {
    const [showModal, setShowModal] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [vouchers, setVouchers] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [voucherToToggle, setVoucherToToggle] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                setIsLoading(true)
                const response = await axios.get(apiDiscountUrl);
                setVouchers(response.data);
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching vouchers", error);
                setIsLoading(false)
            }
        };

        fetchVouchers();
    }, []);

    const handleCreateClick = () => {
        setSelectedVoucher(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedVoucher(null);
    };

    const handleEdit = (voucherItem) => {
        setSelectedVoucher(voucherItem);
        console.log("Selected Voucher", voucherItem);
        setShowModal(true);
    };

    const handleConfirmToggle = async () => {
        if (voucherToToggle) {
            try {
                setIsLoading(true)
                const updatedVoucher = {
                    is_active: isActivating,
                };
                const response = await axios.put(
                    `${apiDiscountUrl}${voucherToToggle._id}`,
                    updatedVoucher
                );
                setVouchers((prevVouchers) =>
                    prevVouchers.map((v) => (v._id === voucherToToggle._id ? response.data : v))
                );
                setIsLoading(false)
            } catch (error) {
                console.error("Error toggling voucher active state", error);
                setIsLoading(false)
            } finally {
                setShowConfirmModal(false);
                setVoucherToToggle(null);
                setIsLoading(false)
            }
        }
    };

    const handleCloseConfirmModal = () => {
        setShowConfirmModal(false);
        setVoucherToToggle(null);
    };


    const handleToggleActive = (voucherItem) => {
        setVoucherToToggle(voucherItem);
        setIsActivating(!voucherItem.is_active);
        setShowConfirmModal(true);
    };

    return (
        <>
            {isLoading && <Loading/>}
            <Container>
                <CreateButton onClick={handleCreateClick}>Create Voucher</CreateButton>
                <h2>Voucher List</h2>
                <VouchersTable>
                    <thead>
                    <tr>
                        <th>Voucher Name</th>
                        <th>Voucher Code</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Quantity</th>
                        <th>Percent Discount</th>
                        <th>Status</th>
                        <th>Created Date</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {vouchers.length > 0 ? (
                        vouchers.map((voucherItem, index) => (
                            <tr key={index}>
                                <td>{voucherItem.discount_name}</td>
                                <td>{voucherItem.discount_code}</td>
                                <td>{new Date(voucherItem.start_date).toLocaleDateString()}</td>
                                <td>{new Date(voucherItem.end_date).toLocaleDateString()}</td>
                                <td>{voucherItem.quantity}</td>
                                <td>{voucherItem.percent}%</td>
                                <td>{voucherItem.is_active ? "Active" : "Inactive"}</td>
                                <td>{new Date(voucherItem.created_at).toLocaleDateString()}</td>
                                <td>
                                    <ActionButton onClick={() => handleEdit(voucherItem)}>
                                        Edit
                                    </ActionButton>
                                    <ActionButton
                                        delete
                                        onClick={() => handleToggleActive(voucherItem)}
                                    >
                                        {voucherItem.is_active ? "Deactivate" : "Activate"}
                                    </ActionButton>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10">No vouchers available.</td>
                        </tr>
                    )}
                    </tbody>
                </VouchersTable>

                {showModal && (
                    <VoucherModal
                        onClose={handleCloseModal}
                        voucherData={selectedVoucher}
                        onSave={(updatedVoucher) => {
                            if (selectedVoucher && selectedVoucher._id) {
                                setVouchers((prevVouchers) =>
                                    prevVouchers.map((v) =>
                                        v._id === selectedVoucher._id ? updatedVoucher : v
                                    )
                                );
                            } else {
                                setVouchers((prevVouchers) => [...prevVouchers, updatedVoucher]);
                            }
                        }}
                    />
                )}

                {showConfirmModal && (
                    <ConfirmationModal
                        isActive={isActivating}
                        onClose={handleCloseConfirmModal}
                        onSubmit={handleConfirmToggle}
                    />
                )}
            </Container>
        </>
    );
}

export default Voucher;

const Container = styled.div`
    position: absolute;
    top: 10%;
    left: 18%;
    width: 78%;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
`;

const VouchersTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;

    th,
    td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    th {
        background-color: #f2f2f2;
    }
`;

const ActionButton = styled.button`
    background-color: ${(props) => (props.delete ? "#f44336" : "#4CAF50")};
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    margin-right: 16px;

    &:hover {
        background-color: ${(props) => (props.delete ? "#d32f2f" : "#45a049")};
    }
`;

const CreateButton = styled.button`
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #45a049;
    }
`;