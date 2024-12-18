import {useState, useEffect} from 'react';
import styled from 'styled-components';
import Header from "../utils/User/Header.jsx";
import Footer from "../utils/User/Footer.jsx";
import BookingModal from "../modal/BookingModal.jsx";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import LoginAlertModal from "../Components/User/LoginAlertModal.jsx";
import Loading from "../utils/Loading.jsx";

const Container = styled.div`
    width: 9999px;
    padding-top: 80px;
    padding-bottom: 60px;
    text-align: center;
    position: relative;
    min-height: 100vh;
    background-color: #1b1b1b;
    background-image: url('/images/cinema-bg.jpg');
    background-size: cover;
    background-position: center;
`;

const TabsContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #333;
`;

const Tab = styled.div`
    margin: 0 20px;
    padding: 12px 25px;
    cursor: pointer;
    font-weight: bold;
    color: ${(props) => (props.active ? '#e50914' : '#aaa')};
    border-bottom: ${(props) => (props.active ? '4px solid #e50914' : 'none')};
    transition: color 0.3s, border-bottom 0.3s;

    &:hover {
        color: #e50914;
    }
`;

const MovieListContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
`;

const MovieCard = styled.div`
    flex: 1 1 calc(20% - 20px);
    max-width: calc(20% - 20px);
    margin: 10px;
    background-color: #2c2c2c;
    border-radius: 20px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.7);
    text-align: center;
    position: relative;
    overflow: hidden;
    padding: 15px;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
        transform: translateY(-10px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.9);
    }
`;

const MovieImage = styled.img`
    width: 100%;
    border-radius: 20px;
    height: 400px;
    object-fit: cover;
    transition: transform 0.3s;

    &:hover {
        transform: scale(1.05);
    }
`;

const MovieTitle = styled.h3`
    font-size: 20px;
    margin: 15px 0 5px;
    color: #fff;
    font-weight: 700;
    height: 60px;
    overflow: hidden;
`;

const MovieInfo = styled.p`
    font-size: 16px;
    margin: 5px 0;
    color: #bbb;
`;

const BuyButton = styled.button`
    background-color: #e50914;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 15px;
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
        background-color: #b0070e;
        transform: scale(1.1);
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ModalContent = styled.div`
    background: #2c2c2c;
    padding: 30px;
    border-radius: 15px;
    text-align: left;
    width: 800px;
    color: #fff;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
`;

const MovieDetailImage = styled.img`
    width: 300px;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
    margin-right: 20px;
`;

const MovieDetailInfo = styled.div`
    flex: 1;
`;

const MovieDetailHeading = styled.h2`
    font-size: 28px;
    margin-bottom: 15px;
    color: #ffcd32;
    font-weight: bold;
`;

const MovieDetailText = styled.p`
    font-size: 18px;
    margin-bottom: 10px;
    color: #ddd;
    line-height: 1.5;
`;

const ButtonGroup = styled.div`
    margin-top: 20px;
    display: flex;
    gap: 15px;
`;

const StayPageCustom = styled.button`
    background-color: #ffcd32;
    padding: 10px 20px;
    color: #030303;
    font-weight: bold;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #b38f2b;
    }
`;

const BuyTicketButton = styled.button`
    background-color: #e50914;
    padding: 10px 20px;
    color: #fff;
    font-weight: bold;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #b0070e;
    }
`;

const apiFilmUrl = import.meta.env.VITE_API_FILM_URL

// eslint-disable-next-line react/prop-types
const MovieDetailModal = ({movie, onClose, onBuyTicket}) => (
    <ModalOverlay>
        <ModalContent>
            {/* eslint-disable-next-line react/prop-types */}
            <MovieDetailImage src={movie.image_url} alt={movie.film_name}/>
            <MovieDetailInfo>
                {/* eslint-disable-next-line react/prop-types */}
                <MovieDetailHeading>{movie.film_name}</MovieDetailHeading>
                {/* eslint-disable-next-line react/prop-types */}
                <MovieDetailText><strong>Mô tả:</strong> {movie.description}</MovieDetailText>
                {/* eslint-disable-next-line react/prop-types */}
                <MovieDetailText><strong>Thể loại:</strong> {movie.category_id?.category_name}</MovieDetailText>
                {/* eslint-disable-next-line react/prop-types */}
                <MovieDetailText><strong>Ngày phát hành:</strong> {new Date(movie.release_date).toLocaleDateString()}
                </MovieDetailText>
                {/* eslint-disable-next-line react/prop-types */}
                <MovieDetailText><strong>Thời lượng:</strong> {movie.duration} phút</MovieDetailText>
                {/* eslint-disable-next-line react/prop-types */}
                <MovieDetailText><strong>Quốc gia:</strong> {movie.country}</MovieDetailText>
                {/* eslint-disable-next-line react/prop-types */}
                <MovieDetailText><strong>Đạo diễn:</strong> {movie.director}</MovieDetailText>
                {/* eslint-disable-next-line react/prop-types */}
                <MovieDetailText><strong>Diễn viên:</strong> {movie.list_actor?.join(', ')}</MovieDetailText>
                <ButtonGroup>
                    <BuyTicketButton onClick={() => onBuyTicket(movie)}>Mua vé</BuyTicketButton>
                    <StayPageCustom onClick={onClose}>Đóng</StayPageCustom>

                </ButtonGroup>
            </MovieDetailInfo>
        </ModalContent>
    </ModalOverlay>
);

// eslint-disable-next-line react/prop-types
function MovieList({dataBookingFilm, onMovieClick, onBuyTicket}) {
    return (
        <MovieListContainer>
            {/* eslint-disable-next-line react/prop-types */}
            {dataBookingFilm.map((movie) => (
                <MovieCard key={movie._id}>
                    <MovieImage src={movie.image_url} alt={movie.film_name} onClick={() => onMovieClick(movie)}/>
                    <MovieTitle>{movie.film_name}</MovieTitle>
                    <MovieInfo>Thể loại: {movie.category_id?.category_name || "N/A"}</MovieInfo>
                    <MovieInfo>Thời lượng: {movie.duration} phút</MovieInfo>
                    <BuyButton onClick={() => onBuyTicket(movie)}>Mua vé</BuyButton>
                </MovieCard>
            ))}
        </MovieListContainer>
    );
}

// eslint-disable-next-line react/prop-types
function User({onLogout}) {
    const [activeTab, setActiveTab] = useState('PHIM ĐANG CHIẾU');
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isLoginAlertOpen, setIsLoginAlertOpen] = useState(false);
    const [isMovieDetailOpen, setIsMovieDetailOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(apiFilmUrl);
                const dataBookingFilm = response.data;
                const currentDate = new Date();
                
                const moviesComingSoon = dataBookingFilm.filter(
                    (movie) => movie.is_active === true && new Date(movie.early_release_date) > currentDate
                );

                const moviesNowShowing = dataBookingFilm.filter(
                    (movie) => movie.is_active === true && new Date(movie.release_date) < currentDate
                );

                const specialShowings = dataBookingFilm.filter(
                    (movie) =>
                        movie.is_active === true &&
                        new Date(movie.early_release_date) < currentDate &&
                        new Date(movie.release_date) > currentDate
                );

                let filteredMovies = [];
                if (activeTab === 'PHIM SẮP CHIẾU') {
                    filteredMovies = moviesComingSoon;
                } else if (activeTab === 'PHIM ĐANG CHIẾU') {
                    filteredMovies = moviesNowShowing;
                } else if (activeTab === 'SUẤT CHIẾU ĐẶC BIỆT') {
                    filteredMovies = specialShowings;
                }

                setFilteredMovies(filteredMovies);
                setIsLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách phim:', error);
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [activeTab]);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
        setIsMovieDetailOpen(true);
    };

    const handleBuyTicketClick = (movie) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoginAlertOpen(true);
            return;
        }
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const closeMovieDetailModal = () => {
        setIsMovieDetailOpen(false);
        setSelectedMovie(null);
    };

    // const closeModal = () => {
    //     setIsModalOpen(false);
    //     setSelectedMovie(null);
    // };

    const closeLoginAlert = () => {
        setIsLoginAlertOpen(false);
    };

    const redirectToLogin = () => {
        setIsLoginAlertOpen(false);
        navigate('/login');
    };

    return (
        <>
            {isLoading && <Loading/>}
            <Container>
                <Header onLogout={onLogout}/>
                <TabsContainer>
                    <Tab active={activeTab === 'PHIM ĐANG CHIẾU'} onClick={() => handleTabClick('PHIM ĐANG CHIẾU')}>
                        PHIM ĐANG CHIẾU
                    </Tab>
                    <Tab active={activeTab === 'PHIM SẮP CHIẾU'} onClick={() => handleTabClick('PHIM SẮP CHIẾU')}>
                        PHIM SẮP CHIẾU
                    </Tab>
                    <Tab active={activeTab === 'SUẤT CHIẾU ĐẶC BIỆT'}
                         onClick={() => handleTabClick('SUẤT CHIẾU ĐẶC BIỆT')}>
                        SUẤT CHIẾU ĐẶC BIỆT
                    </Tab>
                </TabsContainer>
                <MovieList dataBookingFilm={filteredMovies} onMovieClick={handleMovieClick}
                           onBuyTicket={handleBuyTicketClick}/>
                {isModalOpen && selectedMovie && (
                    <BookingModal
                        movieTitle={selectedMovie.film_name}
                        movieId={selectedMovie._id}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
                {isLoginAlertOpen && (
                    <LoginAlertModal onStay={closeLoginAlert} onRedirect={redirectToLogin}/>
                )}
                {isMovieDetailOpen && selectedMovie && (
                    <MovieDetailModal movie={selectedMovie} onClose={closeMovieDetailModal}
                                      onBuyTicket={handleBuyTicketClick}/>
                )}
                <Footer/>
            </Container>
        </>
    );
}

export default User;
