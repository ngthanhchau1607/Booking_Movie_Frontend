﻿﻿import {useState, useEffect} from "react";
import {format, addMinutes} from 'date-fns';
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ScreeningModal from "../../modal/ScreeningModal.jsx";
import Loading from "../../utils/Loading.jsx";
import axios from "axios";

const apiGetShowTime = import.meta.env.VITE_API_SHOW_TIME_URL

function MovieScreenings() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [screeningsList, setScreeningsList] = useState([]);
    const [loading, setLoading] = useState(true);

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