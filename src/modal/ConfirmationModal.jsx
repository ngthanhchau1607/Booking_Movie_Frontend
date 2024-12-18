import React from "react";
import styled from "styled-components";

// eslint-disable-next-line react/prop-types
function ConfirmationModal({isActive, onClose, onSubmit}) {
    return (
        <ModalOverlay>
            <ModalContent>
                <Title>
                    {isActive ? "Confirm Activation" : "Confirm Deactivation"}
                </Title>
                <Message>
                    Are you sure you want to{" "}
                    {isActive ? "activate" : "deactivate"} this voucher?
                </Message>
                <ButtonContainer>
                    <Button onClick={onClose}>Close</Button>
                    <Button primary onClick={onSubmit}>
                        Submit
                    </Button>
                </ButtonContainer>
            </ModalContent>
        </ModalOverlay>
    );
}

export default ConfirmationModal;

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
    background: #fff;
    padding: 30px;
    border-radius: 10px;
    width: 400px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h3`
    margin-bottom: 15px;
    font-size: 1.5rem;
`;

const Message = styled.p`
    margin-bottom: 20px;
    font-size: 1.2rem;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-around;
`;

const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: ${(props) => (props.primary ? "#4CAF50" : "#f44336")};
    color: white;

    &:hover {
        background: ${(props) => (props.primary ? "#45a049" : "#d32f2f")};
    }
`;