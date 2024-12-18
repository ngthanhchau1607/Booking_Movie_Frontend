import {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useLocation} from 'react-router-dom';

const Container = styled.div`
    padding: 60px;
    text-align: center;
    min-height: 100vh;
    background-color: #ffffff;
    color: #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`;

const StatusMessage = styled.h2`
    color: ${(props) => (props.success ? '#28a745' : '#dc3545')};
    font-size: 32px;
    margin-bottom: 30px;
    font-weight: bold;
`;

const TransactionDetails = styled.div`
    background-color: #f8f9fa;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    max-width: 600px;
    width: 100%;
    text-align: left;
    margin-top: 30px;
    border: 2px solid #007bff;
`;

const DetailItem = styled.p`
    font-size: 20px;
    margin: 15px 0;

    strong {
        color: #007bff;
        font-weight: 600;
    }
`;

const Title = styled.h1`
    font-size: 36px;
    margin-bottom: 40px;
    font-weight: bold;
    color: #007bff;
`;

const Button = styled.button`
    background-color: #007bff;
    color: #ffffff;
    border: none;
    padding: 15px 30px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 18px;
    margin-top: 40px;
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
        background-color: #0056b3;
        transform: scale(1.05);
    }
`;

const TransactionStatus = () => {
    const location = useLocation();
    const [transactionStatus, setTransactionStatus] = useState({
        success: false,
        message: "",
        data: null,
    });

    useEffect(() => {
        const parseTransactionStatus = () => {
            try {
                const params = new URLSearchParams(location.search);

                const resultCode = params.get("resultCode");
                const message = params.get("message");
                const extraData = JSON.parse(decodeURIComponent(params.get("extraData")));
                if (resultCode === "0") {
                    setTransactionStatus({
                        success: true,
                        message: "Giao dịch thành công!",
                        data: extraData,
                    });
                } else {
                    setTransactionStatus({
                        success: false,
                        message: message || "Giao dịch thất bại!",
                        data: null,
                    });
                }
            } catch (error) {
                console.error("Lỗi khi phân tích URL callback:", error.message);
                setTransactionStatus({
                    success: false,
                    message: "Đã xảy ra lỗi khi xử lý giao dịch.",
                    data: null,
                });
            }
        };

        parseTransactionStatus();
    }, [location]);

    return (
        <Container>
            <Title>Trạng thái giao dịch</Title>
            <StatusMessage success={transactionStatus.success}>{transactionStatus.message}</StatusMessage>
            {transactionStatus.success && transactionStatus.data && (
                <TransactionDetails>
                    <DetailItem><strong>Show Time ID:</strong> {transactionStatus.data?.show_time_id}</DetailItem>
                    <DetailItem><strong>Danh sách ghế:</strong> {transactionStatus.data?.list_seat?.join(", ")}
                    </DetailItem>
                    <DetailItem><strong>Tổng giá:</strong> {transactionStatus.data?.total_price} VND</DetailItem>
                    <DetailItem><strong>Giảm giá:</strong> {transactionStatus.data?.discount}%</DetailItem>
                    <DetailItem><strong>Đã thanh toán:</strong> {transactionStatus.data?.paid_amount} VND</DetailItem>
                    <DetailItem><strong>User ID:</strong> {transactionStatus.data?.user_id}</DetailItem>
                </TransactionDetails>
            )}
            <Button onClick={() => window.location.href = '/'}>Quay lại trang chủ</Button>
        </Container>
    );
};

export default TransactionStatus;
