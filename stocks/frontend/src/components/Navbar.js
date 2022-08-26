import React, { useState, useEffect } from 'react'
import SearchModal from '../functionalComponents/SearchModal';


const Navbar = () => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    function getWindowDimensions() {
        const {
            innerWidth: width,
            innerHeight: height
        } = window;
        return {
            width,
            height
        };
    }

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [])

    return (
        <div style={{ overflowY: 'hidden' }}>
            <nav class="navbar navbar-expand-lg navbar-dark nav-background">
                <div class={windowDimensions.width <= 992 ? "container-fluid" : "container-fluid container"}>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-lg-0">

                            <li class="navbar-brand">
                                <a class="nav-link active fw-bold" aria-current="page" href="/">
                                    Stocks
                                </a>
                            </li>

                            <li class="navbar-brand">
                                <a class="nav-link active fw-bold" aria-current="page" href="/chart/AAPL">
                                    Chart
                                </a>
                            </li>

                            <li class="navbar-brand">
                                <a class="nav-link active fw-bold" aria-current="page" href="/predictions">
                                    Predictions
                                </a>
                            </li>

                            <li class="navbar-brand">
                                <a class="nav-link active fw-bold" aria-current="page" href="/profile">
                                    Profile
                                </a>
                            </li>

                        </ul>
                        <button class="btn btn-light fw-bold text-secondary text-start pe-5" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-magnifying-glass"></i> Search quote</button>

                    </div>
                </div>
            </nav>
            <SearchModal />
        </div>
    )
}

export default Navbar