import {useState, useEffect} from "react";
import styled from "styled-components";
import axios from 'axios';
import Loading from "../../utils/Loading.jsx";
import {IoMdPersonAdd} from 'react-icons/io'
import {CiEdit} from 'react-icons/ci'
import {MdDelete} from 'react-icons/md'
import CreateUserModal from "../../modal/CreateUserModal.jsx";
import DeactivateModal from "../../modal/DeactivateModal.jsx";
import {TiTick} from "react-icons/ti";

const Container = styled.div`
    position: absolute;
    top: 10%;
    left: 18%;
    width: 78%;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
`;

const TableWrapper = styled.div`
    min-width: 1000px;
    background: #fff;
    padding: 20px 25px;
    border-radius: 3px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    max-height: 100vh;
    overflow-y: auto;
`

const TableTitle = styled.div`
    padding: 16px 30px;
    background: #299be4;
    color: white;
    margin: -20px -25px 10px;
    border-radius: 3px 3px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
        margin: 0;
        font-size: 24px;
    }

    button {
        background-color: white;
        color: #566787;
        border: none;
        font-size: 13px;
        border-radius: 2px;
        padding: 8px 16px;
        margin-left: 10px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
    }

    button:hover {
        background-color: #f2f2f2;
    }

    button i {
        margin-right: 5px;
    }
`

const TableWrapperBlock = styled.div`
    display: block;
    max-height: 70vh;
    overflow-y: auto;
`

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;

    th,
    td {
        padding: 12px 15px;
        border: 1px solid #e9e9e9;
        text-align: left;
        vertical-align: middle;
    }

    th {
        background-color: #f5f5f5;
        position: sticky;
        top: 0;
        z-index: 1;
    }

    tbody tr:nth-child(odd) {
        background-color: #fcfcfc;
    }

    tbody tr:hover {
        background-color: #f5f5f5;
    }

    td i {
        font-size: 19px;
    }

    .actions i {
        margin-right: 10px;
        cursor: pointer;
        opacity: 0.9;
    }

    .actions i:hover {
        color: #2196f3;
    }
`

const Pagination = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;

    .hint-text {
        font-size: 13px;
    }

    .pagination {
        list-style: none;
        display: flex;
        margin: 0;
    }

    .pagination li {
        margin: 0 2px;
    }

    .pagination a {
        border: none;
        padding: 5px 10px;
        color: #999;
        cursor: pointer;
        font-size: 13px;
        border-radius: 2px;
        text-decoration: none;
    }

    .pagination a:hover {
        color: #666;
    }

    .pagination .active a {
        background-color: #03a9f4;
        color: white;
    }

    .pagination .disabled a {
        cursor: not-allowed;
    }
`

const TextCustom = styled.text`
    margin-left: 6px;
`
const EditIcon = styled.div`
    display: inline;
    cursor: pointer;
`
const DeleteIcon = styled.div`
    margin-left: 10px;
    display: inline;
    cursor: pointer;
`
const PAGE_SIZE = 50
const getUserAPI = import.meta.env.VITE_API_USER_URL
const updateUserAPI = import.meta.env.VITE_API_AUTH_URL

const UserManager = () => {
    const [users, setUsers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [paginatedUsers, setPaginatedUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setModalOpen] = useState(false)
    const [isDeactiveModalOpen, setDeactiveModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [method, setMethod] = useState('POST')

    const fullData = JSON.parse(localStorage.getItem('fullData'))
    let token = ''
    if (!fullData) {
        console.log('Rỗng')
    } else {
        token = fullData.access_token
        console.log(token)
    }

    // Fetch user data from the API
    const fetchUserData = () => {
        setIsLoading(true);
        axios
            .get(getUserAPI, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                const data = response.data;
                console.log('User data:', data);
                const formattedUsers = data.map((user) => ({
                    id: user._id,
                    name: user.email,
                    dateCreated: '',
                    role: user.role_id === 1 ? 'admin' : user.role_id === 2 ? 'user' : 'unknown',
                    status: user.is_active ? 'Active' : 'Deactivate',
                    password: user.password,
                    phone: user.phone,
                    full_name: user.full_name
                }));

                setUsers(formattedUsers);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchUserData()
    }, [])

    useEffect(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE
        const paginatedData = users.slice(startIndex, startIndex + PAGE_SIZE)
        setPaginatedUsers(paginatedData) // Set users for the current page
    }, [users, currentPage])

    const handleModalOpen = () => {
        setSelectedUser(null)
        setModalOpen(true)
        setMethod('POST')
    }

    const handleEditUser = (user) => {
        setSelectedUser(user)
        setMethod('PUT')
        setModalOpen(true)
    }

    const handleDeleteUser = (user) => {
        setSelectedUser(user)
        setDeactiveModalOpen(true)
    }

    const handleModalClose = () => {
        setModalOpen(false)
    }

    const handleUserCreated = () => {
        fetchUserData()
    }

    const handleDeactivateSubmit = async () => {
        console.log('Deactivating user:', selectedUser);
        let is_active = true
        if (selectedUser.status === 'Active') {
            is_active = false
        }
        try {
            setIsLoading(true);
            const response = await axios.put(
                `${updateUserAPI}${selectedUser.id}`,
                {
                    is_active: is_active,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status >= 200 && response.status < 300) {
                console.log('User deactivated successfully');
                fetchUserData();
            }
            setDeactiveModalOpen(false);
            setIsLoading(false);
        } catch (error) {
            if (error.response) {
                console.error('Error deactivating user:', error.response.data);
            } else {
                console.error('Error:', error.message);
            }
            setDeactiveModalOpen(false);
            setIsLoading(false);
        }
    };

    const totalPages = Math.ceil(users.length / PAGE_SIZE)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    return (
        <>
            {isLoading && <Loading/>}
            <Container>
                <TableWrapper>
                    <TableTitle>
                        <h2>User Management</h2>
                        <div>
                            <button onClick={handleModalOpen}>
                                <IoMdPersonAdd fontSize={16}/>
                                <TextCustom>Add New User</TextCustom>
                            </button>
                            {/*<button>*/}
                            {/*    <FaFileExport fontSize={16}/>*/}
                            {/*    <TextCustom>Export to Excel</TextCustom>*/}
                            {/*</button>*/}
                        </div>
                    </TableTitle>
                    <CreateUserModal
                        isOpen={isModalOpen}
                        onClose={handleModalClose}
                        onUserCreated={handleUserCreated}
                        initialData={selectedUser}
                        method={method}
                    />
                    <DeactivateModal
                        isOpen={isDeactiveModalOpen}
                        onClose={() => setDeactiveModalOpen(false)}
                        onSubmit={handleDeactivateSubmit}
                        student={selectedUser}
                    />
                    <TableWrapperBlock>
                        <StyledTable>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>FullName</th>
                                <th>UserName</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paginatedUsers.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                                    <td>{user.full_name}</td>
                                    <td>{user.name}</td>
                                    <td>{user.role}</td>
                                    <td>{user.status}</td>
                                    <td className="actions">
                                        <EditIcon onClick={() => handleEditUser(user)}>
                                            <CiEdit fontSize={20}/>
                                        </EditIcon>
                                        {user.status === 'Active' ? (
                                            <DeleteIcon onClick={() => handleDeleteUser(user)}>
                                                <MdDelete fontSize={20}/>
                                            </DeleteIcon>
                                        ) : (
                                            <EditIcon onClick={() => handleDeleteUser(user)}>
                                                <TiTick fontSize={20}/>
                                            </EditIcon>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </StyledTable>
                    </TableWrapperBlock>
                    <Pagination>
            <span className="hint-text">
              Showing <b>{paginatedUsers.length}</b> out of{' '}
                <b>{users.length}</b> entries
            </span>
                        <ul className="pagination">
                            <li className={currentPage === 1 ? 'disabled' : ''}>
                                <a
                                    href="#"
                                    onClick={() =>
                                        currentPage > 1 && handlePageChange(currentPage - 1)
                                    }
                                >
                                    Previous
                                </a>
                            </li>
                            {[...Array(totalPages)].map((_, index) => (
                                <li
                                    key={index}
                                    className={currentPage === index + 1 ? 'active' : ''}
                                >
                                    <a href="#" onClick={() => handlePageChange(index + 1)}>
                                        {index + 1}
                                    </a>
                                </li>
                            ))}
                            <li className={currentPage === totalPages ? 'disabled' : ''}>
                                <a
                                    href="#"
                                    onClick={() =>
                                        currentPage < totalPages &&
                                        handlePageChange(currentPage + 1)
                                    }
                                >
                                    Next
                                </a>
                            </li>
                        </ul>
                    </Pagination>
                </TableWrapper>
            </Container>
        </>
    )
}

export default UserManager;