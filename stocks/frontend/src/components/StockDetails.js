import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import StockDetailsInfo from '../StockDetailsComponents/StockDetailsInfo'
import AreaPriceChart from '../charts/AreaPriceChart'
import CompanyNews from './CompanyNews';
import MarketPredictions from './MarketPredictions';
import StockBasicData from '../StockDetailsComponents/StockBasicData';
import { Button } from '@mui/material';
import CandlestickContainer from './CandlestickContainer';


const StockDetails = () => {

    const [dailyStats, setDailyStats] = useState({})
    const [companyProfile, setCompanyProfile] = useState({})
    const [stockCandlesPriceDataWhole, setStockCandlesPriceDataWhole] = useState({})//ohlcv data on 4 years
    const [filteredCandles, setFilteredCandles] = useState({})
    const [tradeSocketsData, setTradeSocketsData] = useState([])
    const [loadingChart, setLoadingChart] = useState(true)
    const [lastPrice, setLastPrice] = useState(0)
    const [allPrices, setAllPrices] = useState([])

    let { symbol } = useParams();

    const socket = useRef();

    const GetDailyStats = () => {
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
                setDailyStats(data)
                setLastPrice(data.c)
            })
            .catch(err => console.log(err))
    }

    const GetStockCandles = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                quote: symbol
            })
        }
        fetch("/api/get-stock-candles", requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                var dates = []

                data.t.map((item, index) => {
                    dates.push(new Date(item * 1000).toISOString().slice(0, 10))//store the dates in iso format
                })
                data.t = dates

                setStockCandlesPriceDataWhole(data)//the full stock data
                setFilteredCandles(data)//editable stock data
                setLoadingChart(false)
            })
            .catch(err => console.error(err))
    }

    const GetCompanyProfile = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                symbol: symbol
            })
        }
        fetch("/api/get-company-profile-finnhub", requestOptions)
            .then(res => res.json())
            .then(data => {
                setCompanyProfile(data)
            })
            .catch(err => console.log(err))
    }

    const AddToWatchList = () => {
        var authToken = localStorage.getItem('tokenAuth')
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `${authToken}` },
            body: JSON.stringify({
                user: "user",
                country: companyProfile.country,
                currency: companyProfile.currency,
                exchange: companyProfile.exchange,
                ipo: companyProfile.ipo,
                marketCapitalization: companyProfile.marketCapitalization,
                name: companyProfile.name,
                phone: companyProfile.phone,
                shareOutstanding: companyProfile.shareOutstanding,
                ticker: companyProfile.ticker,
                weburl: companyProfile.weburl,
                logo: companyProfile.logo,
                finnhubIndustry: companyProfile.finnhubIndustry,
            })
        }
        fetch("/api/add-to-watch-list", requestOptions)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error(err))
    }

    const RunWebSocket = () => {
        if (!socket.current) {//to not create a new socket every time the component re-renders
            socket.current = new WebSocket('wss://ws.finnhub.io?token=c9cg3bqad3i8nttpggf0');
        }

        // Connection opened -> Subscribe
        socket.current.addEventListener('open', function (event) {
            setTimeout(function () {
                socket.current.send(JSON.stringify({ 'type': 'subscribe', 'symbol': symbol }))
            }, 10000);
        });

        // Listen for messages
        socket.current.addEventListener('message', function (event) {
            setTimeout(function () {
                if (event.data.type || !JSON.parse(event.data).data) null
                else {
                    setDailyStats(prev => ({ ...prev, c: JSON.parse(event.data).data[0].p }))
                    setTradeSocketsData(prev => [...prev, JSON.parse(event.data).data])
                    setAllPrices(prev => [...prev, JSON.parse(event.data).data[0].p])
                }
            }, 10000);
        });
        var unsubscribe = function (symbol) {
            socket.current.send(JSON.stringify({ 'type': 'unsubscribe', 'symbol': symbol }))
        }
        socket.current.addEventListener('close', (event) => {
            unsubscribe(symbol)
            socket.current.close()
        });
    }

    const filterStockCandles = (period) => {
        var sliceIndex = 0
        if (period != 'max') {
            var sliceDate = new Date()
            sliceDate.setDate(sliceDate.getDate() - period)
            sliceDate = sliceDate.toISOString().slice(0, 10)
            for (var i = 0; i < stockCandlesPriceDataWhole.t.length; i++) {
                if (new Date(sliceDate).getTime() >= new Date(stockCandlesPriceDataWhole.t[i]).getTime()) {
                    sliceIndex = i;
                }
                else {
                    break;
                }
            }
            var newCandles = {
                o: stockCandlesPriceDataWhole.o.slice(sliceIndex),
                h: stockCandlesPriceDataWhole.h.slice(sliceIndex),
                l: stockCandlesPriceDataWhole.l.slice(sliceIndex),
                c: stockCandlesPriceDataWhole.c.slice(sliceIndex),
                v: stockCandlesPriceDataWhole.v.slice(sliceIndex),
                t: stockCandlesPriceDataWhole.t.slice(sliceIndex),
            }
            setFilteredCandles(newCandles)
        }
        else {
            setFilteredCandles(stockCandlesPriceDataWhole)
        }
    }

    useEffect(() => {
        GetDailyStats()
        GetCompanyProfile()
        GetStockCandles()
        // RunWebSocket()//TURN ON THE WEBSOCKET ON MONDAY AFTER 04:30 AND CLOSE IT ON FIRDAY BEFORE 23:00:)))0
    }, [])

    return (
        <div style={{ paddingBottom: 60 }}>
            <div>
                <div className="container">
                    <StockDetailsInfo companyProfile={companyProfile} dailyStats={dailyStats} lastPrice={allPrices[allPrices.length - 2]} AddToWatchList={AddToWatchList} />
                </div>
                {/* page tabs */}
                <div style={{ marginTop: 30 }} className="container">
                    <ul class="nav nav-pills mb-4 container" id="myTab" role="tablist">
                        <li class="nav-item" role="presentation" style={{ marginTop: 5 }}>
                            <button class="nav-link active" id="pills-statistics-tab" data-bs-toggle="pill" data-bs-target="#pills-statistics" type="button" role="tab" aria-controls="pills-statistics" aria-selected="true">Statistics</button>
                        </li>
                        <li class="nav-item" style={{ marginTop: 5 }}>
                            <button class="nav-link" id="pills-marketNews-tab" data-bs-toggle="pill" data-bs-target="#pills-marketNews" type="button" role="tab" aria-controls="pills-marketNews" aria-selected="false">Company news</button>
                        </li>
                    </ul>

                    <div class="tab-content" id="pills-tabContent">
                        <div class="tab-pane fade show active" id="pills-statistics" role="tabpanel" aria-labelledby="pills-statistics-tab">
                            <h4 className="mb-1 mt-5 fw-bold container">Stock price</h4>
                            <AreaPriceChart
                                stockCandlesDates={filteredCandles.t}
                                stockCandlesPriceData={filteredCandles.c}
                                loadingChart={loadingChart}
                                filterStockCandles={filterStockCandles}
                            />

                            <div className="container p-3 pt-5">
                                <a href={`/chart/${symbol}`} style={{ textDecoration: "none", color: "white" }}>
                                    <button type="button" class="btn fw-bold .text-nowrap" style={{ backgroundColor: "#0D90FF", color: "#E4F0FF" }}>See chart</button>
                                </a>
                            </div>

                            {companyProfile.ticker &&
                                <StockBasicData stockSymbol={companyProfile.ticker} />
                            }
                        </div>
                        <div class="tab-pane fade" id="pills-marketNews" role="tabpanel" aria-labelledby="pills-marketNews-tab">
                            <CompanyNews symbol={symbol} logo={companyProfile.logo} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StockDetails