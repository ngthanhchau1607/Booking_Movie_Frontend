import styled from 'styled-components';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const ModalContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: #2c2c2c;
    padding: 30px 50px;
    border-radius: 20px;
    width: 80%;
    max-width: 900px;
    text-align: left;
    position: relative;
    min-height: 30vh;
    max-height: 80vh;
    overflow-y: auto;
    color: #fff;
`;

const CloseButton = styled.button`
    background-color: transparent;
    color: #fff;
    border: none;
    font-size: 2rem;
    padding: 0 10px;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
        color: #e50914;
    }
`;

const Title = styled.h2`
    font-size: 24px;
    text-align: center;
    margin-bottom: 2rem;
    color: #ffcd32;
`;

const BranchSelect = styled.select`
    width: 100%;
    padding: 15px;
    margin-bottom: 30px;
    font-size: 16px;
    border-radius: 10px;
    border: 2px solid #555;
    background-color: #1b1b1b;
    color: #fff;

    &:focus {
        border-color: #e50914;
        outline: none;
    }
`;

const DateTabs = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #555;
`;

const DateTab = styled.div`
    margin: 0 15px;
    padding: 15px 20px;
    cursor: pointer;
    font-weight: bold;
    color: ${(props) => (props.active ? '#ffcd32' : '#aaa')};
    border-bottom: ${(props) => (props.active ? '4px solid #ffcd32' : 'none')};
    transition: color 0.3s, border-bottom 0.3s;

    &:hover {
        color: #ffcd32;
    }
`;

const ShowTimeContainer = styled.div`
    margin-top: 30px;
    text-align: center;
`;

const ShowTimeGroup = styled.div`
    margin-bottom: 3rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
`;

const StyledShowTime = styled.div`
    position: relative;
    background-color: #333;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.3s, background-color 0.3s;

    &:hover {
        transform: scale(1.05);
        background-color: #444;
    }
`;

const StyledSpan = styled.span`
    position: absolute;
    top: 110%;
    right: 0;
    left: 0;
    font-size: 14px;
    color: #bbb;
    cursor: default;
`;

const TimeSlot = styled.div`
    padding: 0.5rem 1rem;
    font-weight: bold;
    color: #ffcd32;
`;

const apiShowTimeUrl = import.meta.env.VITE_API_SHOW_TIME_URL
const apiFilmUrl = import.meta.env.VITE_API_FILM_URL

// eslint-disable-next-line react/prop-types
function BookingModal({movieTitle, movieId, onClose}) {
    const navigate = useNavigate();
    const [showTimes, setShowTimes] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        const fetchShowTimes = async () => {
            try {
                const response = await axios.get(`${apiShowTimeUrl}${movieId}/film`);
                const data = response.data;
                setShowTimes(data);

                if (data.length > 0) {
                    const firstBranch = data[0].branch_id?._id || '';
                    setSelectedBranch(firstBranch);

                    const firstDate = data
                        .filter((showTime) => showTime.branch_id?._id === firstBranch)
                        .map((showTime) => new Date(showTime.start_time))
                        .sort((a, b) => a - b)[0]?.toISOString().split('T')[0] || '';

                    setSelectedDate(firstDate);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách suất chiếu:', error);
            }
        };

        fetchShowTimes();
    }, [movieId]);

    const uniqueBranches = Array.from(
        new Map(
            showTimes
                .filter((showTime) => showTime.branch_id && showTime.branch_id.branch_name)
                .map((showTime) => [showTime.branch_id._id, showTime.branch_id])
        ).values()
    );

    const filteredShowTimes = showTimes.filter(
        (showTime) => showTime.branch_id._id === selectedBranch
    );

    const groupedShowTimes = filteredShowTimes.reduce((acc, showTime) => {
        const date = new Date(showTime.start_time).toISOString().split('T')[0];
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(showTime);
        return acc;
    }, {});

    const handleBranchChange = (event) => {
        const newBranchId = event.target.value;
        setSelectedBranch(newBranchId);

        const newFirstDate = showTimes
            .filter((showTime) => showTime.branch_id._id === newBranchId)
            .map((showTime) => new Date(showTime.start_time))
            .sort((a, b) => a - b)[0]?.toISOString().split('T')[0] || '';

        setSelectedDate(newFirstDate);
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    const handleTimeSlotClick = (showTime) => {
        const filmId = showTime.film_id._id;

        axios
            .get(`${apiFilmUrl}${filmId}`)
            .then((filmResponse) => {
                const filmDetails = filmResponse.data;

                navigate(`/user/booking/${showTime._id}`, {
                    state: {
                        showTimeDetails: showTime,
                        filmDetails: filmDetails,
                    },
                });
            })
            .catch((error) => {
                console.error("Error fetching film details:", error);
            });
    };

    const handleOutsideClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <ModalContainer onClick={handleOutsideClick}>
            <ModalContent>
                <CloseButton onClick={onClose}>×</CloseButton>
                <Title>LỊCH CHIẾU - {movieTitle}</Title>
                <BranchSelect
                    value={selectedBranch}
                    onChange={handleBranchChange}
                >
                    <option value="">Chọn rạp</option>
                    {uniqueBranches.map((branch) => (
                        <option key={branch._id} value={branch._id}>
                            {branch.branch_name}
                        </option>
                    ))}
                </BranchSelect>

                <DateTabs>
                    {Object.keys(groupedShowTimes).map((date) => (
                        <DateTab
                            key={date}
                            active={date === selectedDate}
                            onClick={() => handleDateClick(date)}
                        >
                            {new Date(date).getDate()}/{new Date(date).getMonth() + 1}
                        </DateTab>
                    ))}
                </DateTabs>

                <ShowTimeContainer>
                    {groupedShowTimes[selectedDate] ? (
                        <ShowTimeGroup>
                            {groupedShowTimes[selectedDate].map((showTime) => (
                                <StyledShowTime key={showTime._id} onClick={() => handleTimeSlotClick(showTime)}>
                                    <TimeSlot>{new Date(showTime.start_time).toISOString().substring(11, 16)}</TimeSlot>
                                    <StyledSpan>Màn hình: {showTime.screen.screen_name}</StyledSpan>
                                </StyledShowTime>
                            ))}
                        </ShowTimeGroup>
                    ) : (
                        <p>Không có suất chiếu cho ngày đã chọn.</p>
                    )}
                </ShowTimeContainer>
            </ModalContent>
        </ModalContainer>
    );
}

export default BookingModal;