// Header.jsx
import styled from 'styled-components'
import {useEffect, useState} from "react";

// eslint-disable-next-line react/prop-types
function Header({onLogout}) {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const tokenString = localStorage.getItem("token");
        try {
            const parsedToken = tokenString ? JSON.parse(tokenString) : null;
            console.log("Parsed Token: ", parsedToken);
            setToken(parsedToken);
        } catch (error) {
            console.error("Failed to parse token:", error);
            setToken(null);
        }
    }, []);

    return (
        <HeaderContainer>
            <Title>Admin</Title>
            <RightItemWrapper>
                <EmailCustom>{token?.user?.email}</EmailCustom>
                <LogoutButton onClick={onLogout}>Logout</LogoutButton>
            </RightItemWrapper>
        </HeaderContainer>
    )
}

export default Header

const HeaderContainer = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: #0b9a7d;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    z-index: 1000;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    color: #ecf0f1;
`

const Title = styled.h2`
    margin: 0;
    color: #ecf0f1;
`

const LogoutButton = styled.button`
    background-color: #e74c3c;
    border: none;
    color: #ecf0f1;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #c0392b;
    }
`

const RightItemWrapper = styled.div`
    display: flex;
    align-items: center;
`

const EmailCustom = styled.span`
    margin-right: 1rem;
    font-weight: bold;
`