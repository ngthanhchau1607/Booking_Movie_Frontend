import {useEffect, useState} from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

const TitleCustom = styled.h2`
    margin: 0;
    padding-left: 2rem;
    cursor: pointer;
`;

const RightHeaderWrapper = styled.div`
    display: flex;
    align-items: center;
`

const EmailCustom = styled.span`
    margin-right: 1rem;
    font-weight: bold;
`

// eslint-disable-next-line react/prop-types
function Header({onLogout}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [token, setToken] = useState(null);

    useEffect(() => {
        const tokenString = localStorage.getItem("token");
        try {
            const parsedToken = tokenString ? JSON.parse(tokenString) : null;
            console.log("Parsed Token: ", parsedToken);
            setToken(parsedToken);
            setIsLoggedIn(!!parsedToken);
        } catch (error) {
            console.error("Failed to parse token:", error);
            setIsLoggedIn(false);
            setToken(null);
        }
    }, []);

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleHistoryClick = () => {
        console.log("Button clicked");
        navigate("/user/history");
    };

    const handleLogoutClick = () => {
        console.log("Button clicked");
        onLogout();
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "10px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <TitleCustom onClick={() => navigate("/user")}>Disney Land</TitleCustom>
            {isLoggedIn ? (
                <>
                    <RightHeaderWrapper>
                        <EmailCustom>{token?.user?.email}</EmailCustom>
                        <button
                            onClick={handleHistoryClick}
                            style={{
                                backgroundColor: "#28a745",
                                color: "#fff",
                                border: "none",
                                padding: "8px 16px",
                                marginRight: "1rem",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            History
                        </button>
                        <button
                            onClick={handleLogoutClick}
                            style={{
                                backgroundColor: "#28a745",
                                color: "#fff",
                                border: "none",
                                padding: "8px 16px",
                                marginRight: "1rem",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            Logout
                        </button>
                    </RightHeaderWrapper>
                </>
            ) : (
                <button
                    onClick={handleLoginClick}
                    style={{
                        backgroundColor: "#ffc107",
                        color: "#000",
                        border: "none",
                        padding: "8px 16px",
                        marginRight: "1rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Login
                </button>
            )}
        </header>
    );
}

export default Header;