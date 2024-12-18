// Admin.jsx
import styled from 'styled-components'
import {Navigate, Route, Routes} from 'react-router-dom'
import Header from "../utils/Admin/Header.jsx";
import Navbar from "../utils/Admin/Navbar.jsx";
import Dashboard from "../Components/Admin/Dashboard.jsx";
import MovieScreenings from "../Components/Admin/MovieScreenings.jsx";
import ListFilm from "../Components/Admin/ListFilm.jsx";
import Voucher from "../Components/Admin/Voucher.jsx";
import UserManager from "../Components/Admin/UserManager.jsx";


// eslint-disable-next-line react/prop-types
function Admin({onLogout}) {
    return (
        <AdminContainer>
            <HeaderWrapper>
                <Header onLogout={onLogout}/>
            </HeaderWrapper>
            <div className="main-layout">
                <NavbarWrapper>
                    <Navbar/>
                </NavbarWrapper>
                <ContentWrapper>
                    <Routes>
                        <Route path="dashboard" element={<Dashboard/>}/>
                        <Route path="movie_screenings" element={<MovieScreenings/>}/>
                        <Route path="list_film" element={<ListFilm/>}/>
                        <Route path="voucher" element={<Voucher/>}/>
                        <Route path="user_manager" element={<UserManager/>}/>
                        <Route path="/" element={<Navigate to="dashboard"/>}/>
                    </Routes>
                </ContentWrapper>
            </div>
        </AdminContainer>
    )
}

export default Admin

// Styled components
const AdminContainer = styled.main`
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 100vh;

    .main-layout {
        display: flex;
    }
`

const HeaderWrapper = styled.div`
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    background-color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`

const NavbarWrapper = styled.div`

`

const ContentWrapper = styled.div`

`
