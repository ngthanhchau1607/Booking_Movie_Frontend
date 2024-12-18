import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

function UpdateShowtime({ onClose, onRefresh, screeningId }) {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedMovie, setSelectedMovie] = useState("");
    const [startTime, setStartTime] = useState("");
    const [vipPrice, setVipPrice] = useState("");
    const [normalPrice, setNormalPrice] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [movies, setMovies] = useState([]);
    const [branches, setBranches] = useState([]);
    const [rooms, setRooms] = useState([]); // Dữ liệu phòng chiếu của chi nhánh đã chọn

    useEffect(() => {
        // Lấy danh sách phim từ API
        axios.get('http://127.0.0.1:3000/api/v1/film')
            .then(response => {
                setMovies(response.data);
            })
            .catch(error => {
                console.error('Lỗi khi lấy danh sách phim:', error);
            });
    }, []);

    useEffect(() => {
        // Lấy danh sách chi nhánh từ API
        axios.get('http://127.0.0.1:3000/api/v1/branch')
            .then(response => {
                setBranches(response.data);
            })
            .catch(error => {
                console.error('Lỗi khi lấy danh sách chi nhánh:', error);
            });
    }, []);

    // Lấy dữ liệu từ API khi `screeningId` thay đổi
    useEffect(() => {
        if (screeningId) {
            console.log("screeningId:", screeningId);
            setLoading(true);

            // Gọi API để lấy dữ liệu buổi chiếu theo `screeningId`
            axios
                .get(`http://127.0.0.1:3000/api/v1/showtime/${screeningId}`)
                .then((response) => {
                    console.log("Dữ liệu nhận được từ API:", response.data);
                    const data = response.data;
                    // Cập nhật các trường trong form
                    setSelectedDate(new Date(data.start_time).toISOString().split('T')[0]);
                    setStartTime(new Date(data.start_time).toISOString().split('T')[1].slice(0, 5)); // Lấy giờ:phút
                    setVipPrice(data.vip_price);
                    setNormalPrice(data.normal_price);
                    setSelectedBranch(data.branch_id);
                    setSelectedMovie(data.film_id);
                    setSelectedRoom(data.screen_id);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Lỗi khi gọi API:", error);
                    setError("Không thể tải dữ liệu buổi chiếu");
                    setLoading(false);
                });
        }
    }, [screeningId]);

    const handleUpdate = () => {
        if (!selectedDate || !startTime || !vipPrice || !normalPrice || !selectedMovie || !selectedBranch || !selectedRoom) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        // Chuẩn bị dữ liệu để cập nhật
        const updatedData = {
            start_time: `${selectedDate}T${startTime}:00.000Z`, // Kết hợp ngày và giờ
            vip_price: vipPrice,
            normal_price: normalPrice,
            film_id: selectedMovie,
            branch_id: selectedBranch,
            screen_id: selectedRoom,
        };

        // Gửi dữ liệu lên API để cập nhật
        axios
            .put(`http://127.0.0.1:3000/api/v1/showtime/${screeningId}`, updatedData)
            .then((response) => {
                alert("Cập nhật buổi chiếu thành công!");
                onRefresh(); // Cập nhật danh sách buổi chiếu
                onClose(); // Đóng modal
            })
            .catch((error) => {
                alert("Không thể cập nhật buổi chiếu");
                console.error(error);
            });
    };

    if (loading) {
        return <p>Đang tải...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <ModalOverlay>
            <ModalContent>
                <TitleCustom>Cập nhật buổi chiếu</TitleCustom>
                
                {/* Phim */}
                <FormGroup>
                    <LabelCustom>Phim:</LabelCustom>
                    <select
                        value={selectedMovie}
                        onChange={(e) => setSelectedMovie(e.target.value)}
                    >
                        <option value="">Chọn phim</option>
                        {movies.map((movie) => (
                            <option key={movie._id} value={movie._id}>
                                {movie.film_name}
                            </option>
                        ))}
                    </select>
                </FormGroup>
    
                {/* Ngày */}
                <FormGroup>
                    <LabelCustom>Ngày:</LabelCustom>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </FormGroup>
    
                {/* Giờ chiếu và giá vé */}
                <FormGroupRow>
                    <FormGroup>
                        <LabelCustom>Giờ chiếu:</LabelCustom>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </FormGroup>
    
                    <FormGroup>
                        <LabelCustom>Giá Vip:</LabelCustom>
                        <input
                            type="number"
                            value={vipPrice}
                            onChange={(e) => setVipPrice(e.target.value)}
                            placeholder="Nhập giá"
                        />
                    </FormGroup>
    
                    <FormGroup>
                        <LabelCustom>Giá Thường</LabelCustom>
                        <input
                            type="number"
                            value={normalPrice}
                            onChange={(e) => setNormalPrice(e.target.value)}
                            placeholder="Nhập giá"
                        />
                    </FormGroup>
                </FormGroupRow>
    
                {/* Chi nhánh */}
                <FormGroup>
                    <LabelCustom>Chi nhánh:</LabelCustom>
                    <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                        <option value="">Chọn chi nhánh</option>
                        {branches.map((branch) => (
                            <option key={branch._id} value={branch._id}>
                                {branch.branch_name}
                            </option>
                        ))}
                    </select>
                </FormGroup>
    
                {/* Phòng chiếu */}
                <FormGroup>
                    <LabelCustom>Phòng chiếu:</LabelCustom>
                    <select
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                    >
                        <option value="">Chọn phòng</option>
                        <option value="room1">Phòng 1</option>
                        <option value="room2">Phòng 2</option>
                    </select>
                </FormGroup>
    
                <ButtonContainer>
                    <Button onClick={() => { onClose(); }}>Hủy</Button>
                    <Button primary onClick={handleUpdate}>Cập nhật</Button>
                </ButtonContainer>
            </ModalContent>
        </ModalOverlay>
    );
}

export default UpdateShowtime;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: #fff;
    padding: 30px;
    border-radius: 10px;
    width: 450px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
`;

const FormGroup = styled.div`
    margin-bottom: 15px;

    label {
        display: block;
        margin-bottom: 5px;
    }

    select, input {
        width: 100%;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #ccc;
    }
`;

const FormGroupRow = styled.div`
    display: flex;
    align-items: center;
    gap: 50px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: ${(props) => (props.primary ? "#4CAF50" : "#f44336")};
    color: white;
`;

const TitleCustom = styled.h3`
    text-align: center;
    font-size: 1.5rem;
`;

const LabelCustom = styled.label`
    font-size: 1.2rem;
    font-weight: bold;
`;
