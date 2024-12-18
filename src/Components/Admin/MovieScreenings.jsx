import {useState, useEffect} from "react";
import {format, addMinutes} from 'date-fns';
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ScreeningModal from "../../modal/ScreeningModal.jsx";
import ConfirmDelete from "../../modal/ConfirmDelete.jsx";
import UpdateShowtime from "../../modal/UpdateShowtime.jsx";
import Loading from "../../utils/Loading.jsx";
import axios from "axios";

const apiGetShowTime = import.meta.env.VITE_API_SHOW_TIME_URL

function MovieScreenings() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [screeningsList, setScreeningsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedScreeningId, setSelectedScreeningId] = useState(null);
    const [showModalUpdate, setShowModalUpdate] = useState(false);  // State để hiển thị modal UpdateShowtime

    const fetchScreenings = async () => {
        try {
            setLoading(true);
            const response = await axios.get(apiGetShowTime);
            const allScreenings = response.data;

            const filteredScreenings = allScreenings.filter((show) => {
                const screeningDate = new Date(show.start_time).toISOString().split("T")[0];
                const selectedFormattedDate = selectedDate.toISOString().split("T")[0];
                return screeningDate === selectedFormattedDate;
            });

            setScreeningsList(filteredScreenings);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu buổi chiếu phim:", error);
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchScreenings();
    }, [selectedDate]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleCreateClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDeleteScreening = (id) => {
        setSelectedScreeningId(id); // Lưu ID của buổi chiếu cần xóa
        setShowDeleteModal(true); // Hiển thị modal xác nhận xóa
    };

    const handleConfirmDelete = async () => {
        try {
            console.log("Gui gi day", selectedScreeningId);
            await axios.delete(`${apiGetShowTime}${selectedScreeningId}`);
            fetchScreenings();  // Sau khi xóa, lấy lại danh sách buổi chiếu
            setShowDeleteModal(false);  // Đóng modal xác nhận
        } catch (error) {
            console.error("Lỗi khi xóa buổi chiếu:", error);
            console.log("Đã nhận lỗi khi gửi yêu cầu", error.response?.data);  // In thông tin lỗi từ server nếu có
        }
    };

    const handleEditScreening = (id) => {
        setSelectedScreeningId(id); // Lưu ID của buổi chiếu cần chỉnh sửa
        setShowModalUpdate(true);  // Mở modal UpdateShowtime
    };

    return (
        <>
            {loading && <Loading/>}
            <Container>
                <CreateButton onClick={handleCreateClick}>Create a Movie Show</CreateButton>
                <h2>List Of Movie Screenings</h2>
                <DatePickerContainer>
                    <label>Select Date: </label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy/MM/dd"
                        showMonthYearDropdown
                    />
                </DatePickerContainer>
                <ScreeningsTable>
                    <thead>
                    <tr>
                        <th>Branch</th>
                        <th>Address</th>
                        <th>Screening Room</th>
                        <th>Movie Name</th>
                        <th>Start Time</th>
                        <th>Duration</th>
                        <th>End Time</th>
                        <th>Number of Seats</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {screeningsList.length > 0 ? (
                        screeningsList.map((show, index) => (
                            <tr key={index}>
                                <td>{show.branch_id ? show.branch_id.branch_name : "N/A"}</td>
                                <td>{show.branch_id ? show.branch_id.address : "N/A"}</td>
                                <td>{show.screen ? show.screen.screen_name : "N/A"}</td>
                                <td>{show.film_id ? show.film_id.film_name : "N/A"}</td>
                                <td>{show.start_time ? new Date(show.start_time).toISOString().substring(11, 16) : "N/A"}</td>
                                <td>{show.duration || "N/A"}</td>
                                <td>
                                    {show.start_time
                                        ? (addMinutes(new Date(show.start_time), show.duration || 0)).toISOString().substring(11, 16)
                                        : "N/A"}
                                </td>
                                <td>{show.screen ? show.screen.total_seat : "N/A"}</td>
                                <td>
                                    <ButtonContainer>
                                    <EditButton onClick={() => handleEditScreening(show._id)}>
                                            Edit
                                        </EditButton>
                                        <DeleteButton onClick={() => handleDeleteScreening(show._id)}>
                                            Xóa
                                        </DeleteButton>
                                    </ButtonContainer>
                                </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9">Không có buổi chiếu nào cho ngày này.</td>
                        </tr>
                    )}
                    </tbody>
                </ScreeningsTable>
                {showModal && (
                    <ScreeningModal onClose={handleCloseModal} onRefresh={fetchScreenings} data={screeningsList}/>
                )}
            </Container> 
            
            {/* Hiển thị ConfirmDelete modal khi showDeleteModal = true */}
            {showDeleteModal && (
                <ConfirmDelete
                    onClose={() => setShowDeleteModal(false)} // Đóng modal
                    onSubmit={handleConfirmDelete} // Xác nhận xóa
                />
            )}

            {/* Modal cập nhật buổi chiếu */}
            {showModalUpdate &&  (
                <UpdateShowtime 
                    onClose={() => setShowModalUpdate(false)} 
                    onRefresh={fetchScreenings} 
                    screeningId={selectedScreeningId} // Truyền ID vào modal
                />
            )}
        </>
    );
}

export default MovieScreenings;

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

const DatePickerContainer = styled.div`
    margin-bottom: 20px;
`;

const ScreeningsTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;

    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    th {
        background-color: #f2f2f2;
    }
`;
const CreateButton = styled.button`
    background-color: #4CAF50;
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

const DeleteButton = styled.button`
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 5px;
    &:hover {
        background-color: #c82333;
    }
`;

const EditButton = styled.button`
    padding: 5px 10px;
    background-color: orange;
    color: white;
    cursor: pointer;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;  // Tạo khoảng cách giữa các nút
`;