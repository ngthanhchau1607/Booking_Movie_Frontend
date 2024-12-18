import styled from "styled-components";

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
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: #2c2c2c;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    width: 400px;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ModalText = styled.p`
    font-size: 18px;
    margin-bottom: 20px;
    color: #ddd;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 15px;
    margin-top: 20px;
`;

const StayButton = styled.button`
    background-color: #aaa;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 50px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #888;
    }
`;

const RedirectButton = styled.button`
    background-color: #e50914;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 50px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #b0070e;
    }
`;

// eslint-disable-next-line react/prop-types
const LoginAlertModal = ({onStay, onRedirect}) => {
    return (
        <ModalOverlay>
            <ModalContent>
                <ModalText>Bạn cần đăng nhập để mua vé. Bạn có muốn đăng nhập ngay không?</ModalText>
                <ButtonGroup>
                    <StayButton onClick={onStay}>Ở lại</StayButton>
                    <RedirectButton onClick={onRedirect}>Đăng nhập</RedirectButton>
                </ButtonGroup>
            </ModalContent>
        </ModalOverlay>
    );
};

export default LoginAlertModal;