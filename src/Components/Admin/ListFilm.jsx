import {useState, useEffect} from "react";
import axios from "axios";
import styled from "styled-components";
import UpdateMovieModal from "../../modal/UpdateMovieModal.jsx";
import Loading from "../../utils/Loading.jsx";
import ConfirmDeactivateFilmModal from "../../modal/ConfirmDeactivateFilmModal.jsx";

const apiGetFilm = import.meta.env.VITE_API_FILM_URL;
const apiGetShowtime = import.meta.env.VITE_API_SHOW_TIME_URL;

function ListFilm() {
    const [movies, setMovies] = useState([]);
    const [, setShowTimes] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [, setIsCreateMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Active");
    const [nonDeletableFilmIds, setNonDeletableFilmIds] = useState([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(apiGetFilm);
                const apiMovies = response.data.map((movie) => ({
                    id: movie._id,
                    movieName: movie.film_name,
                    description: movie.description,
                    category: movie.category_id?.category_name || "Unknown",
                    duration: `${movie.duration} minutes`,
                    releaseDate: new Date(movie.release_date).toLocaleDateString(),
                    earlyReleaseDate: movie.early_release_date
                        ? new Date(movie.early_release_date).toLocaleDateString()
                        : null,
                    country: movie.country || "Unknown",
                    director: movie.director,
                    listActor: movie.list_actor.join(", ") || "Unknown",
                    imageUrl: movie.image_url || "",
                    isActive: movie.is_active,
                }));

                const showtimeResponse = await axios.get(apiGetShowtime);
                const currentDate = new Date();

                const filteredShowtimes = showtimeResponse.data
                    .filter((showtime) => showtime.film_id && new Date(showtime.start_time) > currentDate)
                    .map((showtime) => showtime.film_id._id);

                setNonDeletableFilmIds(filteredShowtimes);
                setShowTimes(showtimeResponse.data);
                setMovies(apiMovies);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching movies:", error);
                setIsLoading(false);
            }
        };
        fetchMovies();
    }, []);

    const handleCardClick = (movie) => {
        setSelectedMovie(movie);
        setIsCreateMode(false);
    };

    const handleCreateClick = () => {
        setSelectedMovie({
            id: movies.length + 1,
            movieName: "",
            description: "",
            category: "",
            duration: "",
            releaseDate: "",
            earlyReleaseDate: "",
            country: "",
            director: "",
            listActor: "",
            imageUrl: "",
            isActive: true,
        });
        setIsCreateMode(true);
    };

    const handleCloseModal = () => {
        setSelectedMovie(null);
        setIsCreateMode(false);
    };

    const handleSubmitModal = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(apiGetFilm);
            const apiMovies = response.data.map((movie) => ({
                id: movie._id,
                movieName: movie.film_name,
                description: movie.description,
                category: movie.category_id?.category_name || "Unknown",
                duration: `${movie.duration} minutes`,
                releaseDate: new Date(movie.release_date).toLocaleDateString(),
                earlyReleaseDate: movie.early_release_date
                    ? new Date(movie.early_release_date).toLocaleDateString()
                    : null,
                country: movie.country || "Unknown",
                director: movie.director,
                listActor: movie.list_actor.join(", ") || "Unknown",
                imageUrl: movie.image_url || "",
                isActive: movie.is_active,
            }));

            setMovies(apiMovies);
            handleCloseModal();
        } catch (error) {
            console.error("Error updating movie:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleConfirmSubmit = async () => {
        try {
            setIsLoading(true);
            await axios.put(`${apiGetFilm}${movieToDelete}`, {
                is_active: activeTab !== "Active",
            });

            const response = await axios.get(apiGetFilm);
            const apiMovies = response.data.map((movie) => ({
                id: movie._id,
                movieName: movie.film_name,
                description: movie.description,
                category: movie.category_id?.category_name || "Unknown",
                duration: `${movie.duration} minutes`,
                releaseDate: new Date(movie.release_date).toLocaleDateString(),
                earlyReleaseDate: movie.early_release_date
                    ? new Date(movie.early_release_date).toLocaleDateString()
                    : null,
                country: movie.country || "Unknown",
                director: movie.director,
                listActor: movie.list_actor.join(", ") || "Unknown",
                imageUrl: movie.image_url || "",
                isActive: movie.is_active,
            }));

            setMovies(apiMovies);
            handleConfirmClose();
        } catch (error) {
            console.error("Error updating movie:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleConfirmClose = () => {
        setIsConfirmOpen(false);
        setMovieToDelete(null);
    };

    const handleDeleteIconClick = (event, movieId) => {
        event.stopPropagation();
        setMovieToDelete(movieId);
        setIsConfirmOpen(true);
    };

    const filteredMovies = movies
        .filter((movie) => (activeTab === "Active" ? movie.isActive : !movie.isActive))
        .sort((a, b) => {
            const isANonDeletable = nonDeletableFilmIds.includes(a.id) ? 0 : 1;
            const isBNonDeletable = nonDeletableFilmIds.includes(b.id) ? 0 : 1;
            return isANonDeletable - isBNonDeletable;
        });

    return (
        <>
            {isLoading && <Loading/>}
            <WrapperAll>
                <TabContainer>
                    <Tab
                        isActive={activeTab === "Active"}
                        onClick={() => setActiveTab("Active")}
                    >
                        Active
                    </Tab>
                    <Tab
                        isActive={activeTab === "Deactivate"}
                        onClick={() => setActiveTab("Deactivate")}
                    >
                        Deactivate
                    </Tab>
                </TabContainer>
                <Button onClick={handleCreateClick}>Create Movie</Button>
                <TitleCustom>Movie List</TitleCustom>
                <CardGrid>
                    {filteredMovies.map((movie) => (
                        <Card key={movie.id} onClick={() => handleCardClick(movie)}>
                            <Image src={movie.imageUrl} alt={movie.movieName}/>
                            <CardContent>
                                <h3>{movie.movieName}</h3>
                                <p><strong>Category:</strong> {movie.category}</p>
                                <p><strong>Duration:</strong> {movie.duration}</p>
                                <p><strong>Release Date:</strong> {movie.releaseDate}</p>
                                <p><strong>Country:</strong> {movie.country}</p>
                                <p><strong>Director:</strong> {movie.director}</p>
                                {activeTab === "Deactivate" && (
                                    <ActivateIcon onClick={(event) => handleDeleteIconClick(event, movie.id)}>
                                        🔄
                                    </ActivateIcon>
                                )}

                                {activeTab === "Active" && !nonDeletableFilmIds.includes(movie.id) && (
                                    <DeleteIcon onClick={(event) => handleDeleteIconClick(event, movie.id)}>
                                        🗑️
                                    </DeleteIcon>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </CardGrid>
                {selectedMovie && (
                    <UpdateMovieModal
                        movie={selectedMovie}
                        onClose={handleCloseModal}
                        onSubmit={handleSubmitModal}
                    />
                )}
                <ConfirmDeactivateFilmModal
                    isOpen={isConfirmOpen}
                    onClose={handleConfirmClose}
                    onSubmit={handleConfirmSubmit}
                    message={
                        activeTab === "Active"
                            ? "Are you sure you want to deactivate this movie?"
                            : "Are you sure you want to activate this movie?"
                    }
                />

            </WrapperAll>
        </>
    );
}

export default ListFilm;

const WrapperAll = styled.div`
    position: absolute;
    top: 10%;
    left: 18%;
    width: 78%;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
`;

const TabContainer = styled.div`
    display: flex;
    margin-bottom: 20px;
`;

const Tab = styled.button`
    padding: 10px 20px;
    margin-right: 10px;
    background-color: ${(props) => (props.isActive ? "#4CAF50" : "#f1f1f1")};
    color: ${(props) => (props.isActive ? "white" : "#333")};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;

    &:hover {
        background-color: ${(props) => (props.isActive ? "#45a049" : "#ddd")};
    }
`;

const Button = styled.button`
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 20px;
`;

const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    width: 100%;
`;

const Card = styled.div`
    display: flex;
    align-items: center;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.05);
    }
`;

const Image = styled.img`
    padding: 1rem;
    height: 240px;
    width: 100px;
    border-radius: 8px 0 0 8px;
    object-fit: contain;
    flex: 2;
`;

const CardContent = styled.div`
    padding: 15px;
    flex: 2;
    position: relative;
`;

const TitleCustom = styled.h2`
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
    color: #333;
    text-align: center;
`;

const ActivateIcon = styled.span`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    color: green;
    font-size: 20px;
`;

const DeleteIcon = styled.span`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    color: red;
    font-size: 20px;
`;