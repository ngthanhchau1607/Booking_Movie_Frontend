import styled from 'styled-components'

const LoadingOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 10001;
`

const Loader = styled.svg`
    max-width: 15rem;
    width: 100%;
    height: auto;
    stroke-linecap: round;

    circle {
        fill: none;
        stroke-width: 3.5;
        animation-name: preloader;
        animation-duration: 3s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
        transform-origin: 170px 170px;
        will-change: transform;
    }

    circle:nth-of-type(1) {
        stroke: #e2007c;
        stroke-dasharray: 550;
        animation-delay: -0.15s;
    }

    circle:nth-of-type(2) {
        stroke: #404041;
        stroke-dasharray: 500;
        animation-delay: -0.3s;
    }

    circle:nth-of-type(3) {
        stroke: #e2007c;
        stroke-dasharray: 450;
        animation-delay: -0.45s;
    }

    circle:nth-of-type(4) {
        stroke: #404041;
        stroke-dasharray: 300;
        animation-delay: -0.6s;
    }

    @keyframes preloader {
        50% {
            transform: rotate(360deg);
        }
    }
`

const Loading = () => (
    <LoadingOverlay>
        <Loader xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 340">
            <circle cx="170" cy="170" r="160"/>
            <circle cx="170" cy="170" r="135"/>
            <circle cx="170" cy="170" r="110"/>
            <circle cx="170" cy="170" r="85"/>
        </Loader>
    </LoadingOverlay>
)

export default Loading