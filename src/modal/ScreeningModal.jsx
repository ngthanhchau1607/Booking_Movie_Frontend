import {useEffect, useState} from "react";
import styled from "styled-components";
import axios from "axios";
import Loading from "../utils/Loading.jsx";

const apiBranchUrl = import.meta.env.VITE_API_BRANCH_URL
const apiFilmUrl = import.meta.env.VITE_API_FILM_URL
const apiShowTimeUrl = import.meta.env.VITE_API_SHOW_TIME_URL

// eslint-disable-next-line react/prop-types
function ScreeningModal({onClose, onRefresh, data}) {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedMovie, setSelectedMovie] = useState("");
    const [duration, setDuration] = useState(0);
    const [startTime, setStartTime] = useState("");
    const [vipPrice, setVipPrice] = useState("");
    const [normalPrice, setNormalPrice] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [availableRooms, setAvailableRooms] = useState([]);
    const [movies, setMovies] = useState([]);
    const [branches, setBranches] = useState([]);
    const [minDate, setMinDate] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    console.log(data)

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                setLoading(true);
                const response = await axios.get(apiBranchUrl);
                const activeBranches = response.data.filter(branch => branch.is_active === true);
                setBranches(activeBranches);

                if (activeBranches.length > 0) {
                    const firstBranch = activeBranches[0];
                    setSelectedBranch(firstBranch._id);
                    setAvailableRooms(firstBranch.list_screen);
                    if (firstBranch.list_screen.length > 0) {
                        setSelectedRoom(firstBranch.list_screen[0]._id);
                    }
                }
                setLoading(false)
            } catch (error) {
                console.error("Error fetching branches:", error);
                setLoading(false)
            }
        };

        const fetchMovies = async () => {
            try {
                setLoading(true);
                const response = await axios.get(apiFilmUrl);
                const activeMovies = response.data.filter(movie => movie.is_active === true);
                setMovies(activeMovies);

                if (activeMovies.length > 0) {
                    const firstMovie = activeMovies[0];
                    setSelectedMovie(firstMovie._id);
                    setDuration(firstMovie.duration);
                    updateMinDate(firstMovie);
                }
                setLoading(false)
            } catch (error) {
                console.error("Error fetching movies:", error);
                setLoading(false)
            }
        };

        fetchBranches();
        fetchMovies();
    }, []);

    useEffect(() => {
        const selectedBranchData = branches.find(branch => branch._id === selectedBranch);
        if (selectedBranchData) {
            setAvailableRooms(selectedBranchData.list_screen);
            if (selectedBranchData.list_screen.length > 0) {
                setSelectedRoom(selectedBranchData.list_screen[0]._id);
            }
        } else {
            setAvailableRooms([]);
            setSelectedRoom("");
        }
    }, [selectedBranch, branches]);

    const checkScheduleConflict = (selectedStartTime, selectedDuration) => {
        const selectedStart = new Date(`${selectedDate}T${selectedStartTime}:00.000Z`);
        const selectedEnd = new Date(selectedStart.getTime() + selectedDuration * 60000);

        // eslint-disable-next-line react/prop-types
        const conflictingShowtime = data.some(showtime => {
            const existingStart = new Date(showtime.start_time);
            const existingEnd = new Date(existingStart.getTime() + showtime.duration * 60000);

            const isSameDay =
                existingStart.toISOString().split("T")[0] === selectedDate;

            const isSameBranchAndRoom =
                showtime.branch_id._id === selectedBranch &&
                showtime.screen._id === selectedRoom;

            if (isSameDay && isSameBranchAndRoom) {
                console.log("Đã vào")
                return (
                    (selectedStart >= existingStart && selectedStart < existingEnd) ||
                    (selectedEnd > existingStart && selectedEnd <= existingEnd) ||
                    (selectedStart <= existingStart && selectedEnd >= existingEnd)
                );
            }

            return false;
        });

        return conflictingShowtime;
    };


    const handleStartTimeChange = (e) => {
        const newStartTime = e.target.value;

        if (checkScheduleConflict(newStartTime, duration)) {
            setErrorMessage("The selected time conflicts with an existing showtime on this date.");
        } else {
            setErrorMessage("");
            setStartTime(newStartTime);
        }
    };

    const updateMinDate = (movie) => {
        const earlyReleaseDate = movie.early_release_date
            ? new Date(movie.early_release_date)
            : null;
        const releaseDate = new Date(movie.release_date);

        const minDate = earlyReleaseDate && earlyReleaseDate > releaseDate
            ? earlyReleaseDate
            : releaseDate;

        setMinDate(minDate.toISOString().split("T")[0]);
    };

    useEffect(() => {
        const selectedMovieData = movies.find(movie => movie._id === selectedMovie);
        if (selectedMovieData) {
            setDuration(selectedMovieData.duration);
            updateMinDate(selectedMovieData);
        }
    }, [selectedMovie, movies]);

    const handleCreate = async () => {
        if (!selectedDate || !startTime || !vipPrice || !normalPrice || !selectedMovie || !selectedBranch || !selectedRoom) {
            alert("Please fill out all fields!");
            return;
        }

        if (checkScheduleConflict(startTime, duration)) {
            setErrorMessage("The selected time conflicts with an existing showtime on this date.");
            return;
        }

        const startDateTime = `${selectedDate}T${startTime}:00.000Z`;

        try {
            setLoading(true);
            await axios.post(apiShowTimeUrl, {
                film_id: selectedMovie,
                branch_id: selectedBranch,
                screen_id: selectedRoom,
                start_time: startDateTime,
                duration: duration,
                vip_price: parseFloat(vipPrice),
                normal_price: parseFloat(normalPrice),
            });
            onClose();
            if (onRefresh) onRefresh();
            setLoading(false);
        } catch (error) {
            console.error("Error creating showtime:", error);
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Loading/>}
            <ModalOverlay>
                <ModalContent>
                    <TitleCustom>Create Movie Screening</TitleCustom>
                    <FormGroup>
                        <LabelCustom>Movie:</LabelCustom>
                        <select
                            value={selectedMovie}
                            onChange={(e) => setSelectedMovie(e.target.value)}
                        >
                            <option value="">Select Movie</option>
                            {movies.map((movie) => (
                                <option key={movie._id} value={movie._id}>
                                    {movie.film_name}
                                </option>
                            ))}
                        </select>
                    </FormGroup>
                    <FormGroup>
                        <LabelCustom>Date:</LabelCustom>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={minDate}
                        />
                    </FormGroup>
                    <FormGroupRow>
                        <FormGroup>
                            <LabelCustom>Start Time:</LabelCustom>
                            <input
                                type="time"
                                value={startTime}
                                onChange={handleStartTimeChange}
                            />
                            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
                        </FormGroup>

                        <FormGroup>
                            <LabelCustom>Vip Price:</LabelCustom>
                            <input
                                type="number"
                                value={vipPrice}
                                onChange={(e) => setVipPrice(e.target.value)}
                                placeholder="Enter price"
                            />
                        </FormGroup>
                        <FormGroup>
                            <LabelCustom>Normal Price</LabelCustom>
                            <input
                                type="number"
                                value={normalPrice}
                                onChange={(e) => setNormalPrice(e.target.value)}
                                placeholder="Enter price"
                            />
                        </FormGroup>
                    </FormGroupRow>
                    <FormGroup>
                        <LabelCustom>Branch:</LabelCustom>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                        >
                            {branches.map((branch) => (
                                <option key={branch._id} value={branch._id}>
                                    {branch.branch_name}
                                </option>
                            ))}
                        </select>
                    </FormGroup>
                    <FormGroup>
                        <LabelCustom>Screening Room:</LabelCustom>
                        <select
                            value={selectedRoom}
                            onChange={(e) => setSelectedRoom(e.target.value)}
                        >
                            {availableRooms.map((room) => (
                                <option key={room._id} value={room._id}>
                                    {room.screen_name} (Seats: {room.total_seat})
                                </option>
                            ))}
                        </select>
                    </FormGroup>
                    <ButtonContainer>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button primary onClick={handleCreate}>Create</Button>
                    </ButtonContainer>
                </ModalContent>
            </ModalOverlay>
        </>
    );
}

export default ScreeningModal;

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

const ErrorText = styled.p`
    color: red;
    font-size: 0.9rem;
    margin-top: 5px;
`;