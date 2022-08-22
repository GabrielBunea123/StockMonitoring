import React from 'react'
import { Card, CardActionArea, Typography, CardMedia, CardContent } from '@mui/material';

const CardMarketNews = ({ currentNews }) => {
    const checkBrokenImg = (ev) => {
        ev.target.src = "https://ecommerce-101.s3.us-east-2.amazonaws.com/images/luca-bravo-XJXWbfSo2f0-unsplash.jpg"//image if the news image is not displayed
    }
    return (
        <div class="card bg-dark text-white news-card shadow mb-5">
            <img src={currentNews.image} onError={checkBrokenImg} style={{ height: "100%", opacity: 0.5 }} class="card-img market-news-img" alt="..." />
            <a href={currentNews.url} style={{ textDecoration: "none", color: "white" }}>
                <div class="card-img-overlay">
                    <h5 class="card-title">{currentNews.headline}</h5>
                    <p class="card-text">{currentNews.summary.slice(0, 70)}</p>
                </div>
            </a>
        </div>
    )
}

export default CardMarketNews