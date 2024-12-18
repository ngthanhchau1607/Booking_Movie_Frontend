import {NavLink} from 'react-router-dom'
import styled from 'styled-components'

function Navbar() {
    return (
        <NavContainer>
            <NavList>
                <NavItem>
                    <StyledNavLink to="/admin/dashboard" activeClassName="active">
                        Dashboard
                    </StyledNavLink>
                </NavItem>
                <NavItem>
                    <StyledNavLink to="/admin/list_film" activeClassName="active">
                        List Film
                    </StyledNavLink>
                </NavItem>
                <NavItem>
                    <StyledNavLink to="/admin/movie_screenings" activeClassName="active">
                        Movie Screenings
                    </StyledNavLink>
                </NavItem>
                <NavItem>
                    <StyledNavLink to="/admin/voucher" activeClassName="active">
                        Voucher
                    </StyledNavLink>
                </NavItem>
                <NavItem>
                    <StyledNavLink to="/admin/user_manager" activeClassName="active">
                        User
                    </StyledNavLink>
                </NavItem>
            </NavList>
        </NavContainer>
    )
}

export default Navbar

const NavContainer = styled.nav`
    position: fixed;
    top: 60px;
    left: 0;
    width: 14%;
    height: calc(100vh - 60px);
    background-color: #2c3e50;
    padding: 20px;
    z-index: 900;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`

const NavList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
`

const NavItem = styled.li`
    margin-bottom: 10px;
`

const StyledNavLink = styled(NavLink)`
    text-decoration: none;
    color: #ecf0f1;
    font-weight: bold;
    padding: 10px 15px;
    display: block;
    border-radius: 4px;
    transition: background-color 0.3s, color 0.3s;

    &:hover {
        background-color: #34495e;
        color: #ffffff;
    }

    &.active {
        background-color: #007bff;
        color: #ffffff;
    }
`
