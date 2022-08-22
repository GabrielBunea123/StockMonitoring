import React, { useEffect, useState } from 'react'
import CardMarketNews from '../functionalComponents/CardMarketNews'

const MarketNews = () => {


    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [news,setNews] = useState([])

    const GetMarketNews = () => {
        fetch("/api/get-market-news")
            .then(res => res.json())
            .then(data => {
                setNews(data)
            })
            .catch(err => console.error(err))

    }

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


    useEffect(() => {
        GetMarketNews()
    }, [])


    return (
        <div class="stock-details-header container">
            {news.length > 0 ?
                // set the justify content to between or evenly based on screen size
                <div class={windowDimensions.width<780 ?`market-news-cards-container d-flex flex-wrap justify-content-evenly`:`market-news-cards-container d-flex flex-wrap justify-content-between`}>
                    {news.map((item, index) => (
                        <CardMarketNews currentNews={item} />
                    ))}
                </div>
                : null}
        </div>
    )
}

export default MarketNews