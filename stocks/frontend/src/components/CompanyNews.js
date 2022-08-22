import React, { useState, useEffect } from 'react'
import CardMarketNews from '../functionalComponents/CardMarketNews'

const CompanyNews = ({ symbol, logo }) => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const [news, setNews] = useState([])

    const GetMarketNews = () => {
        const _from = new Date()
        const today = new Date()
        _from.setDate(_from.getDate() - 1)//get news from 1 day ago

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                symbol: symbol,
                _from: _from.toISOString().slice(0, 10),
                to: today.toISOString().slice(0, 10)
            })
        }
        fetch('/api/get-company-news', requestOptions)
            .then(res => res.json())
            .then(data => {
                setNews(data)
            })
            .catch(err => console.log(err))
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
                <div class={window.innerWidth < 780 ? `market-news-cards-container d-flex flex-wrap justify-content-evenly` : `market-news-cards-container d-flex flex-wrap justify-content-between`}>
                    {news.map((item, index) => (
                        <CardMarketNews currentNews={item} />
                    ))}
                </div>
                : null}
        </div>
    )
}

export default CompanyNews