import {useEffect, useState} from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';
import AuthTabs from './pages/AuthTabs.jsx';
import Admin from './pages/Admin.jsx';
import User from './pages/User.jsx';
import BookingHistory from "./Components/User/BookingHistory.jsx";
import SolveBooking from "./Components/User/SolveBooking.jsx";
import TransactionStatus from "./pages/TransactionStatus.jsx";


function App() {
    const [roleId, setRoleId] = useState(null);
    const [fakeToken, setFakeToken] = useState(null);

    useEffect(() => {
        const savedRole = localStorage.getItem('roleId');
        const token = localStorage.getItem('token');
        if (savedRole && token) {
            setRoleId(parseInt(savedRole, 10));
            setFakeToken(token);
        }
    }, []);

    const handleLogin = (role, token) => {
        localStorage.setItem('roleId', role);
        localStorage.setItem("token", JSON.stringify(token));
        setRoleId(role);
        setFakeToken(token);
    };

    const handleLogout = () => {
        console.log('Logging out...');
        localStorage.removeItem('roleId');
        localStorage.removeItem('token');
        setRoleId(null);
        setFakeToken(null);
    };

    return (
        <Routes>
            <Route
                path="/login"
                element={fakeToken ? <Navigate to="/"/> : <AuthTabs onLogin={handleLogin}/>}
            />
            <Route
                path="/admin/*"
                element={fakeToken && roleId === 1 ? <Admin onLogout={handleLogout}/> : <Navigate to="/login"/>}
            />
            <Route
                path="/user"
                element={<User onLogout={handleLogout}/>}
            />
            <Route
                path="/user/history"
                element={<BookingHistory onLogout={handleLogout}/>}
            />
            <Route
                path="/user/booking/:showTimeId"
                element={<SolveBooking onLogout={handleLogout}/>}
            />
            <Route
                path="/"
                element={
                    fakeToken
                        ? roleId === 1
                            ? <Navigate to="/admin"/>
                            : <Navigate to="/user"/>
                        : <Navigate to="/user"/>
                }
            />
            <Route path="/transaction-status" element={<TransactionStatus/>}/>
            <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
    );
}

export default App;