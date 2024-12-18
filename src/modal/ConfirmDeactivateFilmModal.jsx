import styled from "styled-components";

// eslint-disable-next-line react/prop-types
const ConfirmDeactivateFilmModal = ({ isOpen, onClose, onSubmit, message }) => {
    if (!isOpen) return null;

    return (
        <Overlay>
            <Modal>
                <p>{message}</p>
                <ButtonContainer>
                    <Button onClick={onClose}>Cancel</Button>
                    <ButtonSubmit onClick={onSubmit}>Submit</ButtonSubmit>
                </ButtonContainer>
            </Modal>
        </Overlay>
    );
};

export default ConfirmDeactivateFilmModal;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const Modal = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    width: 300px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
`;

const Button = styled.button`
    padding: 10px 20px;
    background-color: #ccc;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #bbb;
    }
`;

const ButtonSubmit = styled(Button)`
    background-color: #4caf50;
    color: white;

    &:hover {
        background-color: #45a049;
    }
`;