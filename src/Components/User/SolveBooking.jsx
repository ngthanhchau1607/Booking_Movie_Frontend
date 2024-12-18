import {useEffect, useState} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {useLocation} from "react-router-dom";
import Loading from "../../utils/Loading.jsx";
import Footer from "../../utils/User/Footer.jsx";
import Header from "../../utils/User/Header.jsx";

const Container = styled.div`
    padding: 100px 20px;
    text-align: center;
    background-color: #1c1c1e;
    min-height: 100vh;
    position: relative;
`;
const BackButton = styled.button`
    position: fixed;
    top: 80px;
    left: 20px;
    padding: 10px 20px;
    background-color: #349e5d;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);

    &:hover {
        background-color: #0056b3;
    }
`;

const BodyWrapper = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    background-color: #2c2c2e;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    overflow: hidden;
    padding: 20px;
`;
const SeatMapContainer = styled.div`
    width: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    background-color: #2c2c2e;
    border-radius: 15px;
`;
const Screen = styled.div`
    width: 80%;
    height: 40px;
    background-color: #757575;
    border-radius: 15px;
    text-align: center;
    line-height: 40px;
    margin-bottom: 20px;
    font-weight: bold;
    color: #ffffff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
`;
const SeatMap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const Row = styled.div`
    display: flex;
    justify-content: center;
    margin: 5px 0;
`;
const Seat = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background-color: ${({status, type}) => {
        if (status === 'booked') return '#4a4a4a';
        if (status === 'selected') return '#42e0f5';
        if (type === 'vip') return '#f1c40f';
        return '#bdc3c7';
    }};
    color: ${({status}) => (status === 'booked' ? '#ffffff' : '#000000')};
    margin: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: ${({status}) => (status === 'booked' ? 'not-allowed' : 'pointer')};
    user-select: none;
    transition: background-color 0.3s ease, color 0.3s ease;

    &:hover {
        background-color: ${({status}) =>
                status === 'available' ? '#4caf50' : ''};
        transform: ${({status}) => (status === 'available' ? 'scale(1.1)' : 'none')};
    }
`;
const DetailsContainer = styled.div`
    width: 30%;
    padding: 20px;
    background-color: #3a3a3c;
    border-left: 1px solid #494949;
    border-radius: 15px;
    color: #ffffff;
`;
const MovieDetails = styled.div`
    width: 100%;
    text-align: left;
    margin-bottom: 20px;
`;
const TitleContentWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;
const MovieThumbnail = styled.img`
    height: 150px;
    width: 150px;
    border-radius: 10px;
    margin-bottom: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
`;
const MovieInfo = styled.div`
    margin-bottom: 20px;
    border-top: 1px solid #565656;
    padding-top: 10px;
    width: 100%;
`;
const MovieAttribute = styled.p`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 8px 0;
    font-size: 16px;
    line-height: 1.5;
    padding: 0 10%;

    & > strong {
        margin-right: 5px;
    }
`;
const DiscountWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 11px;
    margin-top: 20px;
    padding: 10px;
    background-color: #494949;
    border-radius: 10px;
    width: 93%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
`;
const VoucherCustom = styled.span`
    font-weight: bold;
    color: #ffffff;
    font-size: 16px;
`;
const InputCustom = styled.input`
    width: 40%;
    padding: 8px;
    border-radius: 6px;
    border: none;
    background-color: #3a3a3c;
    color: #ffffff;
    font-size: 14px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
`;
const ButtonVoucherCustom = styled.button`
    padding: 8px;
    width: auto;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);

    &:hover {
        background-color: #0056b3;
    }
`;

const NotificationModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1000;
`;

const NotificationContent = styled.div`
    background-color: #ffffff;
    padding: 20px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    width: 400px;
`;

const NotificationTitle = styled.h4`
    margin-bottom: 10px;
    font-size: 18px;
    color: #000000;
`;

const NotificationText = styled.p`
    font-size: 16px;
    color: #333333;
    margin-bottom: 20px;
`;

const CloseButton = styled.button`
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0056b3;
    }
`;

const PaymentButton = styled.button`
    width: 100%;
    padding: 15px;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;
    margin-top: 20px;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
`;
const MoMoButton = styled(PaymentButton)`
    background-color: #ff4081;

    &:hover {
        background-color: #e91e63;
    }
`;
const ZaloButton = styled(PaymentButton)`
    background-color: #007BFF;

    &:hover {
        background-color: #0056b3;
    }
`;
const Legend = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-top: 20px;
    color: #ffffff;
`;
const LegendItem = styled.div`
    display: flex;
    align-items: center;
    font-size: 14px;
`;
const LegendColor = styled.div`
    width: 20px;
    height: 20px;
    background-color: ${({color}) => color};
    margin-right: 5px;
    border-radius: 5px;
`;

const TotalPriceContainer = styled.div`
    text-align: left;
    margin: 10px 0;
    padding: 15px;
    width: 90%;
    background-color: #3a3a3c;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
    color: #ffffff;
    font-size: 18px;
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: all 0.3s ease;

    strong {
        color: #f1c40f;
    }

    .selected-seats {
        color: #42e0f5;
        font-weight: bold;
    }

    .total-amount {
        color: #4caf50;
        font-weight: bold;
        font-size: 18px;
    }
`;

<LegendItem>
    <LegendColor color="#f39c12"/> Ghế đã giữ
</LegendItem>

const generateSeats = (bookedSeats, vipPrice, normalPrice) => {
    const rows = 'ABCDEFGHIJ'.split('');
    const seatsPerRow = 12;
    const seats = [];

    rows.forEach((row) => {
        const rowSeats = [];
        for (let i = 1; i <= seatsPerRow; i++) {
            const seatId = `${row}${i}`;
            rowSeats.push({
                seatId,
                status: bookedSeats.includes(seatId) ? 'booked' : 'available',
                price: row >= 'D' && row <= 'G' ? vipPrice : normalPrice,
                type: row >= 'D' && row <= 'G' ? 'vip' : 'regular',
            });
        }
        seats.push(rowSeats);
    });

    return seats;
};

const apiPaymentUrl = import.meta.env.VITE_API_PAYMENT_URL
const apiDiscountUrl = import.meta.env.VITE_API_DISCOUNT_URL
const apiCreateOrderUrl = import.meta.env.VITE_API_CREATE_ORDER_URL
const apiMomoPayUrl = import.meta.env.VITE_API_MOMO_PAY_URL

// eslint-disable-next-line react/prop-types
function SolveBooking({onLogout}) {
    const location = useLocation();
    const navigate = useNavigate();
    const {showTimeDetails, filmDetails} = location.state || {};
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [voucherCode, setVoucherCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [voucherError, setVoucherError] = useState('');
    const [voucherSuccess, setVoucherSuccess] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    console.log("showTimeDetails", showTimeDetails);

    const [reservedSeats, setReservedSeats] = useState([]); // Giữ ghế đã chọn

    // Hàm xử lý khi người dùng nhấn giữ ghế
    const handleReserveSeat = (rowIndex, seatIndex) => {
        const seatId = seats[rowIndex][seatIndex].seatId;
    
        if (seats[rowIndex][seatIndex].status === 'booked') {
            return; // Không thể giữ ghế đã được đặt
        }
    
        // Đánh dấu ghế là đã giữ và lưu thời gian giữ
        setSeats((prevSeats) =>
            prevSeats.map((row, i) =>
                i === rowIndex
                    ? row.map((seat, j) =>
                        j === seatIndex
                            ? {
                                ...seat,
                                status: 'reserved', // Đánh dấu ghế là đã giữ
                                reservedAt: Date.now() // Lưu thời gian giữ ghế
                            }
                            : seat
                    )
                    : row
            )
        );
    
        setReservedSeats((prevReservedSeats) => [...prevReservedSeats, seatId]);
    
        // Tạo một timeout để giải phóng ghế nếu quá 10 phút
        setTimeout(() => {
            setSeats((prevSeats) =>
                prevSeats.map((row) =>
                    row.map((seat) =>
                        seat.seatId === seatId && seat.status === 'reserved'
                            ? { ...seat, status: 'available' } // Giải phóng ghế nếu đã quá thời gian
                            : seat
                    )
                )
            );
            // Nếu ghế đã bị giải phóng, cần xóa khỏi reservedSeats
            setReservedSeats((prevReservedSeats) =>
                prevReservedSeats.filter((id) => id !== seatId)
            );
        }, 10 * 60 * 1000); // 10 phút = 10 * 60 * 1000 ms
    };
    

    useEffect(() => {
        const fetchSeatsAndDetails = async () => {
            if (showTimeDetails) {
                try {
                    setIsLoading(true)
                    const response = await axios.get(
                        `${apiPaymentUrl}${showTimeDetails._id}/showtime`
                    );

                    const bookedSeats = response.data.flatMap((payment) => payment.list_seat);

                    setSeats(generateSeats(bookedSeats, showTimeDetails.vip_price, showTimeDetails.normal_price));
                    setIsLoading(false);
                } catch (error) {
                    console.error("Error fetching payment details:", error);
                    setIsLoading(false);
                }
            }
        };

        fetchSeatsAndDetails();
    }, [showTimeDetails]);

    const totalPrice = selectedSeats.reduce((total, seatId) => {
        const seat = seats.flat().find((s) => s.seatId === seatId);
        const seatPrice = seat ? seat.price : 0;
        const discountedPrice = discount ? seatPrice * (1 - discount / 100) : seatPrice;
        return total + discountedPrice;
    }, 0);


    const handleSeatClick = (rowIndex, seatIndex) => {
        const seatId = seats[rowIndex][seatIndex].seatId;

        if (seats[rowIndex][seatIndex].status === 'booked') {
            return;
        }

        setSeats((prevSeats) =>
            prevSeats.map((row, i) =>
                i === rowIndex
                    ? row.map((seat, j) =>
                        j === seatIndex
                            ? {
                                ...seat,
                                status: seat.status === 'available' ? 'selected' : 'available',
                            }
                            : seat
                    )
                    : row
            )
        );

        setSelectedSeats((prevSelectedSeats) => {
            if (prevSelectedSeats.includes(seatId)) {
                return prevSelectedSeats.filter((s) => s !== seatId);
            } else {
                return [...prevSelectedSeats, seatId];
            }
        });
    };

    const applyVoucher = async () => {
        setIsLoading(true);
        setVoucherSuccess('');
        setVoucherError('');
        try {
            const response = await axios.post(apiDiscountUrl, {
                code: voucherCode,
            });

            const {discountPercent} = response.data;
            setDiscount(discountPercent);
            setVoucherSuccess(`Áp dụng mã giảm giá thành công! Bạn được giảm ${discountPercent}%`);
            setShowNotification(true);
        } catch (error) {
            console.error('Error applying voucher:', error);
            setVoucherError(error.response?.data?.message || 'Có lỗi xảy ra');
            setShowNotification(true);
        } finally {
            setIsLoading(false);
        }
    };
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);

    const handlePayment = async () => {
        if (selectedSeats.length === 0 && reservedSeats.length === 0) {
            alert("Vui lòng chọn hoặc giữ ít nhất một ghế!");
            return;
        }
        setIsPaymentLoading(true);
        try {
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                alert("Bạn chưa đăng nhập. Vui lòng đăng nhập để thanh toán!");
                setIsPaymentLoading(false);
                return;
            }
            const parsedToken = JSON.parse(tokenString);
            const token = parsedToken?.token;
    
            if (!token) {
                alert("Token không hợp lệ. Vui lòng đăng nhập lại!");
                setIsPaymentLoading(false);
                return;
            }
    
            const totalAmount = [...selectedSeats, ...reservedSeats].reduce((total, seatId) => {
                const seat = seats.flat().find((s) => s.seatId === seatId);
                return total + (seat ? seat.price : 0);
            }, 0);
    
            console.log("Tổng số tiền thanh toán:", totalAmount);
    
            const createOrderResponse = await axios.post(
                apiCreateOrderUrl,
                {
                    show_time_id: showTimeDetails?._id,
                    list_seat: [...selectedSeats, ...reservedSeats],
                    total_price: totalAmount,
                    discount: discount,
                    paid_amount: totalAmount - (totalAmount * discount) / 100,
                },
                {
                    headers: {Authorization: `Bearer ${token}`},
                }
            );
            console.log("Kết quả từ API create-order:", createOrderResponse.data);
            const {order_url} = createOrderResponse.data;
            window.location.href = order_url;
        } catch (error) {
            console.error("Lỗi trong quá trình thanh toán:", error.response?.data || error.message);
            if (error.response?.data?.EM === "Invalid token.") {
                alert("Token không hợp lệ. Vui lòng đăng nhập lại!");
            } else {
                alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại!");
            }
        } finally {
            setIsPaymentLoading(false);
        }
    };

    const handlePaymentZalo = async () => {
        if (selectedSeats.length === 0) {
            alert("Vui lòng chọn ít nhất một ghế!");
            return;
        }
        setIsPaymentLoading(true);
        try {
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                alert("Bạn chưa đăng nhập. Vui lòng đăng nhập để thanh toán!");
                setIsPaymentLoading(false);
                return;
            }
            const parsedToken = JSON.parse(tokenString);
            const token = parsedToken?.token;

            if (!token) {
                alert("Token không hợp lệ. Vui lòng đăng nhập lại!");
                setIsPaymentLoading(false);
                return;
            }

            const totalAmount = selectedSeats.reduce((total, seatId) => {
                const seat = seats.flat().find((s) => s.seatId === seatId);
                return total + (seat ? seat.price : 0);
            }, 0);
            console.log("Tổng số tiền thanh toán:", totalAmount);
            const createOrderResponse = await axios.post(
                apiCreateOrderUrl,
                {
                    show_time_id: showTimeDetails?._id,
                    list_seat: selectedSeats,
                    total_price: totalAmount,
                    discount: discount,
                    paid_amount: totalAmount - (totalAmount * discount) / 100,
                },
                {
                    headers: {Authorization: `Bearer ${token}`},
                }
            );
            console.log("Kết quả từ API create-order:", createOrderResponse.data);
            const {order_url} = createOrderResponse.data;
            window.location.href = order_url;
        } catch (error) {
            console.error("Lỗi trong quá trình thanh toán:", error.response?.data || error.message);
            if (error.response?.data?.EM === "Invalid token.") {
                alert("Token không hợp lệ. Vui lòng đăng nhập lại!");
            } else {
                alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại!");
            }
        } finally {
            setIsPaymentLoading(false);
        }
    };
    const handlePaymentMoMo = async () => {
    if (selectedSeats.length === 0) {
        alert("Vui lòng chọn ít nhất một ghế!");
        return;
    }
    setIsPaymentLoading(true);
    try {
        const tokenString = localStorage.getItem("token");
        if (!tokenString) {
            alert("Bạn chưa đăng nhập. Vui lòng đăng nhập để thanh toán!");
            setIsPaymentLoading(false);
            return;
        }
        const parsedToken = JSON.parse(tokenString);
        const token = parsedToken?.token;

        if (!token) {
            alert("Token không hợp lệ. Vui lòng đăng nhập lại!");
            setIsPaymentLoading(false);
            return;
        }

        // Trước khi thanh toán, giữ các ghế đã chọn
        const reservedSeatsForPayment = [...selectedSeats, ...reservedSeats];
        const updatedSeats = seats.map(row =>
            row.map(seat =>
                reservedSeatsForPayment.includes(seat.seatId) && seat.status !== 'booked'
                    ? { ...seat, status: 'reserved' } // Đánh dấu ghế đã giữ
                    : seat
            )
        );
        setSeats(updatedSeats);

        const totalAmount = selectedSeats.reduce((total, seatId) => {
            const seat = seats.flat().find((s) => s.seatId === seatId);
            return total + (seat ? seat.price : 0);
        }, 0);

        console.log("Tổng số tiền thanh toán:", totalAmount);
        const createOrderResponse = await axios.post(
            apiMomoPayUrl,
            {
                show_time_id: showTimeDetails?._id,
                list_seat: selectedSeats,
                total_price: totalAmount,
                discount: discount,
                paid_amount: totalAmount - (totalAmount * discount) / 100,
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log("Kết quả từ API create-order:", createOrderResponse.data);
        const { shortLink } = createOrderResponse.data.data;

        // Sau khi thanh toán thành công, cập nhật trạng thái ghế thành "booked"
        const updatedSeatsAfterPayment = seats.map(row =>
            row.map(seat =>
                reservedSeatsForPayment.includes(seat.seatId)
                    ? { ...seat, status: 'booked' } // Cập nhật ghế thành "booked"
                    : seat
            )
        );
        setSeats(updatedSeatsAfterPayment);

        window.location.href = shortLink; // Chuyển hướng người dùng tới link thanh toán MoMo
    } catch (error) {
        console.error("Lỗi trong quá trình thanh toán:", error.response?.data || error.message);
        if (error.response?.data?.EM === "Invalid token.") {
            alert("Token không hợp lệ. Vui lòng đăng nhập lại!");
        } else {
            alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại!");
        }
    } finally {
        setIsPaymentLoading(false);
    }
};

    return (
        <>
            {isLoading && <Loading/>}
            <Container>
                <BackButton onClick={() => navigate(-1)}>Quay lại</BackButton>
                <Header onLogout={onLogout}/>
                <BodyWrapper>
                    <SeatMapContainer>
                        <Screen>Màn hình chiếu</Screen>
                        <SeatMap>
                            {seats.map((row, rowIndex) => (
                                <Row key={rowIndex}>
                                    {row.map((seat, seatIndex) => (
                                        <Seat
                                        key={seat.seatId}
                                        status={seat.status}
                                        type={seat.type}
                                        onClick={() => handleSeatClick(rowIndex, seatIndex)} // Vẫn giữ chức năng chọn ghế
                                        onDoubleClick={() => handleReserveSeat(rowIndex, seatIndex)} // Thêm sự kiện double click để giữ ghế
                                        style={{ backgroundColor: seat.status === 'reserved' ? '#f39c12' : '' }} // Màu sắc ghế đã giữ
                                    >
                                        {seat.seatId}
                                    </Seat>

                                    ))}
                                </Row>
                            ))}
                        </SeatMap>
                        <Legend>
                            <LegendItem>
                                <LegendColor color="#bdc3c7"/> Ghế thường
                            </LegendItem>
                            <LegendItem>
                                <LegendColor color="#f1c40f"/> Ghế VIP
                            </LegendItem>
                            <LegendItem>
                                <LegendColor color="#42e0f5"/> Ghế đang chọn
                            </LegendItem>
                            <LegendItem>
                                <LegendColor color="#4a4a4a"/> Ghế đã đặt
                            </LegendItem>
                        </Legend>
                    </SeatMapContainer>
                    <DetailsContainer>
                        {filmDetails && (
                            <>
                                <TitleContentWrapper>
                                    <MovieThumbnail src={filmDetails.image_url} alt="Movie Poster"/>
                                    <MovieDetails>
                                        <h3>{filmDetails.film_name}</h3>
                                        <p>{filmDetails.category_id?.category_name || "N/A"}</p>
                                    </MovieDetails>
                                </TitleContentWrapper>
                                <MovieInfo>
                                    <MovieAttribute>
                                        <strong>Thể loại:</strong> {filmDetails.category_id?.category_name || "N/A"}
                                    </MovieAttribute>
                                    <MovieAttribute>
                                        <strong>Thời lượng:</strong> {filmDetails.duration || "N/A"} phút
                                    </MovieAttribute>
                                    <MovieAttribute>
                                        <strong>Rạp chiếu:</strong> {showTimeDetails.branch_id.branch_name || "N/A"}
                                    </MovieAttribute>
                                    <MovieAttribute>
                                        <strong>Ngày
                                            chiếu:</strong> {new Date(showTimeDetails.start_time).toISOString().split('T')[0].split('-').reverse().join('/')}
                                    </MovieAttribute>
                                    <MovieAttribute>
                                        <strong>Giờ
                                            chiếu:</strong> {showTimeDetails.start_time.substring(11, 16)}
                                    </MovieAttribute>
                                </MovieInfo>
                                <DiscountWrapper>
                                    <VoucherCustom>Voucher</VoucherCustom>
                                    <InputCustom
                                        value={voucherCode}
                                        onChange={(e) => setVoucherCode(e.target.value)}
                                        placeholder="Nhập mã voucher"
                                    />
                                    <ButtonVoucherCustom onClick={applyVoucher} disabled={isLoading}>
                                        {isLoading ? 'Áp dụng' : 'Áp dụng'}
                                    </ButtonVoucherCustom>
                                </DiscountWrapper>
                            </>
                        )}
                        <TotalPriceContainer>
                            <p>
                                <strong>Tổng số tiền:</strong> <span
                                className="total-amount">{totalPrice.toLocaleString()} VND</span>
                            </p>
                        </TotalPriceContainer>
                        <MoMoButton onClick={handlePaymentMoMo}
                                    disabled={isPaymentLoading || selectedSeats.length === 0}>
                            {isPaymentLoading ? 'Đang xử lý...' : 'Xác nhận đặt vé bằng'}
                            <img src="/images/momo.png" alt="MoMo" width="24" height="24"/>
                        </MoMoButton>
                        <ZaloButton onClick={handlePaymentZalo}
                                    disabled={isPaymentLoading || selectedSeats.length === 0}>
                            {isPaymentLoading ? 'Đang xử lý...' : 'Xác nhận đặt vé bằng'}
                            <img src="/images/zalopay.png" alt="ZaloPay" width="24" height="24"/>
                        </ZaloButton>
                    </DetailsContainer>
                </BodyWrapper>
                <Footer/>
                {showNotification && (
                    <NotificationModal>
                        <NotificationContent>
                            <NotificationTitle>{voucherSuccess ? 'Thành công' : 'Lỗi'}</NotificationTitle>
                            <NotificationText>{voucherSuccess || voucherError}</NotificationText>
                            <CloseButton onClick={() => setShowNotification(false)}>Đóng</CloseButton>
                        </NotificationContent>
                    </NotificationModal>
                )}
            </Container>
        </>
    );
}

export default SolveBooking;