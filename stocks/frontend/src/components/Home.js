import React, { useEffect, useState } from 'react'
import StocksTable from '../functionalComponents/StocksTable'
import MarketNews from './MarketNews'

const Home = () => {

    const [companies, setCompanies] = useState([])
    const [dailyStocksPrice, setDailyStocksPrice] = useState([])
    const [loadedCompanies, setLoadedCompanies] = useState(false)
    const [loadedWatclist, setLoadedWatclist] = useState(false)

    const GetCompanies = () => {
        fetch('/api/get-company-profile')
            .then(res => res.json())
            .then(data => {
                GetUserWatchlist()
                data.map(item => {
                    if (item.defaultWatchlist == true) {
                        setCompanies(prev => [...prev, item])
                        GetDailyStats(item.ticker, item.currency)
                    }
                })
                setLoadedCompanies(true)
            })
            .catch(error => console.error(error))
    }

    const GetUserWatchlist = () => {
        var authToken = localStorage.getItem('tokenAuth')
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${authToken}`
            }
        }
        fetch('/api/get-user-watchlist', requestOptions)
            .then(res => res.json())
            .then(data => {
                data.map(item => {
                    setCompanies(prev => [...prev, item])
                    GetDailyStats(item.ticker, item.currency)
                })
                setLoadedWatclist(true)
            })
            .catch(error => console.error(error))
    }

    const GetDailyStats = (symbol, currency) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                quote: symbol
            })
        }
        fetch("/api/get-daily-stats", requestOptions)
            .then(res => res.json())
            .then(data => {
                setDailyStocksPrice(prev => [...prev, { symbol: symbol, price: data.c, currency: currency, dp: data.dp }])
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        GetCompanies()
    }, [])

    return (
        <div>
            <div class="container home-container">
                <div class="companies-container">
                    <h4 style={{ fontWeight: "bold", paddingTop: 10, paddingBottom: 25 }}>Watchlist</h4>
                    {(loadedCompanies && loadedWatclist) &&
                        <StocksTable stocks={companies} pricesData={dailyStocksPrice} />
                    }
                    <h4 style={{ fontWeight: "bold", paddingTop: 20, paddingBottom: 5 }}>Market general news</h4>
                    <MarketNews />
                </div>
            </div>
        </div>
    )
}

export default Home