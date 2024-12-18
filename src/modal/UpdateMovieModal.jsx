import axios from "axios";
import {useState, useEffect} from "react";
import styled from "styled-components";
import Select from "react-select";
import Loading from "../utils/Loading.jsx";

const apiFilmUrl = import.meta.env.VITE_API_FILM_URL;
const apiCategoryUrl = import.meta.env.VITE_API_CATEGORY_URL;

// eslint-disable-next-line react/prop-types
function UpdateMovieModal({movie, onClose, onSubmit}) {
    const [movieData, setMovieData] = useState(movie);
    const [countries, setCountries] = useState([]);
    const [isChanged, setIsChanged] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState({
        value: "",
        label: "",
    });
    const [listCategory, setListCategory] = useState([]);
    const [loading, setLoading] = useState(false);
    let title = "Create Movie";
    // eslint-disable-next-line react/prop-types
    if (movie.movieName) {
        title = "Details";
    }

    const convertDateToInputFormat = (date) => {
        if (!date) return date;
        const parts = date.split('/');
        if (parts.length === 3) {
            const [month, day, year] = parts;
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return date;
    };

    // Reset dữ liệu khi mở modal
    useEffect(() => {
        console.log("movie: ", movie.listActor);
        setMovieData({
            id: movie.id,
            film_name: movie.movieName,
            category_id: movie.category,

            // movie.duration: xxx minutes -> chỉ lấy xxx
            duration: movie.duration.split(" ")[0],
            release_date: convertDateToInputFormat(movie.releaseDate),
            early_release_date: convertDateToInputFormat(movie.earlyReleaseDate),
            country: movie.country,
            director: movie.director,
            list_actor: movie.listActor,
            description: movie.description,
            image_url: movie.imageUrl,
        });
        setIsChanged(false);
    }, [movie]);

    useEffect(() => {
        if (listCategory.length > 0 && movie.category) {
            const category = listCategory.find(
                (category) => category.label === movie.category
            );

            setMovieData({
                ...movieData,
                category_id: category.value,
            });
            setSelectedCategory(category);
        }
    }, [listCategory]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get("https://restcountries.com/v3.1/all");
                const countryNames = response.data
                    .map((country) => country.name.common)
                    .sort();
                setCountries(countryNames);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${apiCategoryUrl}`);
                const categories = response.data.map((category) => ({
                    value: category._id,
                    label: category.category_name,
                }));
                setListCategory(categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCountries();
        fetchCategories();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
        setIsChanged(true);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setMovieData({...movieData, [name]: value});
        setIsChanged(true);
    };

    const handleReset = () => {
        setMovieData(movie);
        setIsChanged(false);
    };

    const handleSubmit = async () => {
        let method = "POST";
        let url = apiFilmUrl;

        if (title === "Details") {
            method = "PUT";
            url = `${apiFilmUrl}${movieData.id}`;
        }

        const formData = new FormData();

        for (const key in movieData) {
            if (movieData[key]) {
                if (key === "list_actor") {
                    const actors = movieData.list_actor
                        .split(",")
                        .map((actor) => actor.trim());
                    actors.forEach((actor) => {
                        formData.append(`list_actor`, actor);
                    });
                    continue;
                }
                formData.append(key, movieData[key]);
            }
        }

        if (selectedImage) {
            formData.append("image", selectedImage);
        } else if (method === "POST") {
            alert("Vui lòng chọn hình ảnh trước khi gửi.");
            return;
        }

        try {
            setLoading(true);
            const response =
                method === "POST"
                    ? await axios.post(url, formData)
                    : await axios.put(url, formData);

            onSubmit(response.data);
            onClose();
        } catch (error) {
            alert(
                `Không thể ${method === "POST" ? "tạo mới" : "cập nhật"} phim: ${
                    error.response?.data?.message || error.message
                }`
            );
        } finally {
            setLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            {loading && <Loading/>}
            <ModalOverlay onClick={handleOverlayClick}>
                <ModalContent>
                    <TitleCustom>{title}</TitleCustom>
                    <FormGrid>
                        <FormItem>
                            <LabelCustom>Movie Name:</LabelCustom>
                            <StyledInput
                                type="text"
                                name="film_name"
                                value={movieData.film_name}
                                onChange={handleInputChange}
                            />
                        </FormItem>
                        <FormItem>
                            <LabelCustom>Category:</LabelCustom>
                            <Select
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        paddingBottom: "3px",
                                        marginTop: "4px",
                                    }),
                                }}
                                options={listCategory}
                                value={selectedCategory}
                                onChange={(selectedOption) => {
                                    setSelectedCategory(selectedOption);
                                    setMovieData({
                                        ...movieData,
                                        category_id: selectedOption.value,
                                    });
                                    setIsChanged(true);
                                }}
                            />

                        </FormItem>
                        <FormItem>
                            <LabelCustom>Duration:</LabelCustom>
                            <StyledInput
                                type="number"
                                name="duration"
                                value={movieData.duration}
                                onChange={handleInputChange}
                            />
                        </FormItem>
                        <FormItem>
                            <LabelCustom>Release Date:</LabelCustom>
                            <StyledInput
                                type="date"
                                name="release_date"
                                value={movieData.release_date}
                                onChange={handleInputChange}
                            />
                        </FormItem>
                        <FormItem>
                            <LabelCustom>Early Release Date:</LabelCustom>
                            <StyledInput
                                type="date"
                                name="early_release_date"
                                value={movieData.early_release_date}
                                onChange={handleInputChange}
                            />
                        </FormItem>
                        <FormItem>
                            <LabelCustom>Country:</LabelCustom>
                            <select
                                name="country"
                                value={movieData.country}
                                onChange={handleInputChange}
                                style={{
                                    padding: "12px 10px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    fontSize: "14px",
                                    marginTop: "5px",
                                }}
                            >
                                <option value="">Select a country</option>
                                {countries.map((country, index) => (
                                    <option key={index} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                        </FormItem>

                        <FormItem>
                            <LabelCustom>Director:</LabelCustom>
                            <StyledInput
                                type="text"
                                name="director"
                                value={movieData.director}
                                onChange={handleInputChange}
                            />
                        </FormItem>
                        <FormItem>
                            <LabelCustom>Actors:</LabelCustom>
                            <StyledInput
                                type="text"
                                name="list_actor"
                                value={movieData.list_actor}
                                onChange={handleInputChange}
                            />
                        </FormItem>
                        <FormItem fullWidth>
                            <LabelCustom>Description:</LabelCustom>
                            <StyledTextarea
                                name="description"
                                value={movieData.description}
                                onChange={handleInputChange}
                            />
                        </FormItem>
                        <FormItem fullWidth>
                            <LabelCustom>Image:</LabelCustom>
                            <StyledInput
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </FormItem>
                        {/* show selected image */}
                        {selectedImage && (
                            <FormItem fullWidth>
                                <img
                                    src={URL.createObjectURL(selectedImage)}
                                    alt="Selected"
                                    style={{width: "20%"}}
                                />
                            </FormItem>
                        )}
                        {movieData.image_url && !selectedImage && (
                            <FormItem fullWidth>
                                <img
                                    src={movieData.image_url}
                                    alt="Movie"
                                    style={{width: "20%"}}
                                />
                            </FormItem>
                        )}
                    </FormGrid>
                    {isChanged && (
                        <ButtonContainer>
                            <Button onClick={handleReset}>Reset</Button>
                            <Button primary onClick={handleSubmit}>
                                Submit
                            </Button>
                        </ButtonContainer>
                    )}
                    <CloseButton onClick={onClose}>X</CloseButton>
                </ModalContent>
            </ModalOverlay>
        </>
    );
}

export default UpdateMovieModal;

// Styled components
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
    position: relative;
    background: #fff;
    padding: 30px;
    border-radius: 10px;
    width: 700px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
`;

const FormItem = styled.div`
    display: flex;
    flex-direction: column;
    ${(props) => props.fullWidth && "grid-column: span 2;"}
`;

const StyledInput = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    margin-top: 5px;
`;

const StyledTextarea = styled.textarea`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    margin-top: 5px;
    resize: vertical;
    min-height: 80px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    gap: 10px;
`;

const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: ${(props) => (props.primary ? "#4CAF50" : "#f44336")};
    color: white;
    font-size: 16px;
`;

const CloseButton = styled.span`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 20px;
    color: #333;
`;

const TitleCustom = styled.h3`
    text-align: center;
    font-size: 1.5rem;
`;

const LabelCustom = styled.label`
    font-weight: bold;
    font-size: 1.2rem;
`;
