import React, { useEffect, useState, useRef } from 'react'
import { Button } from "@mui/material"
import Candlestick from '../charts/Candlestick'
import ReactLoading from 'react-loading';
import { useParams } from 'react-router-dom'
import MenuCandlestickRight from '../functionalComponents/MenuCandlestickRight';
import MenuCandlestickLeft from '../functionalComponents/MenuCandlestickLeft';
import CandlestickCompanyProfile from '../functionalComponents/CandlestickCompanyProfile';
import CandlestickContent from './CandlestickContent';

const CandlestickContainer = () => {

    const [user, setUser] = useState('')
    const [loading, setLoading] = useState(true)
    const [apexChartData, setApexChartData] = useState([])
    const [currentOHLC, setCurrentOHLC] = useState({})
    const [currentProfile, setCurrentProfile] = useState({})
    const [companies, setCompanies] = useState([])
    const [ohlcData, setOhlcData] = useState({})
    const [dailyStats, setDailyStats] = useState({})
    const [basicData, setBasicData] = useState({
        marketCap: 0,
        dividendYield: 0,
        eps: 0,
        netDebtAnnual: 0,
    })
    const [news, setNews] = useState([])
    const [candlestickUpperBand, setCandlestickUpperBand] = useState([])
    const [candlestickLowerBand, setCandlestickLowerBand] = useState([])
    const [buyOrSell, setBuyOrSell] = useState([])
    const [lastPrice, setLastPrice] = useState(0)
    const [allSocketPrices, setAllSocketPrices] = useState([])
    const [avaliableIndicators, setAvaliableIndicators] = useState([])
    const [historyPeriod, setHistoryPeriod] = useState(40 * 365)
    const [alertSounded, setAlertSounded] = useState(false)
    var currentPeriod = 7

    const { ticker } = useParams()

    const getUser = () => {
        var authToken = localStorage.getItem('tokenAuth')
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${authToken}`
            }
        }
        fetch("/users/get-user", requestOptions)
            .then(res => res.json())
            .then(data => {
                setUser(data)
            })
            .catch(err => console.log(err))
    }

    const GetUserAlerts = () => {
        var authToken = localStorage.getItem('tokenAuth')
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${authToken}`
            }
        }
        fetch("/api/get-user-alerts", requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    RunWebSocket(authToken)
                }
            })
            .catch(err=>console.log(err))
    }

    const GetCompanies = () => {
        setCompanies([])
        fetch('/api/get-company-profile')
            .then(res => res.json())
            .then(data => {
                GetUserWatchlist()
                data.map(item => {
                    if (item.defaultWatchlist == true) {
                        setCompanies(prev => [...prev, item])
                    }
                })
                // setLoadedCompanies(true)
            })
            .catch(error => console.error(error))
    }

    const GetUserWatchlist = () => {
        setCompanies([])

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
                })
                // setLoadedWatclist(true)
            })
            .catch(error => console.error(error))
    }

    const GetCompanyProfile = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                symbol: ticker
            })
        }
        fetch("/api/get-company-profile-finnhub", requestOptions)
            .then(res => res.json())
            .then(data => {
                setCurrentProfile(data)
            })
            .catch(err => console.log(err))
    }

    const GetStockFullStats = (period) => {

        var resolution = 'D'
        var date = new Date();
        date.setDate(date.getDate() - period); //data from 1980 

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                symbol: ticker,
                fromTimestamp: parseInt(date.getTime() / 1000),//convert it to timestamp
                resolution: resolution
            })
        }
        fetch("/api/get-stock-full-stats", requestOptions)
            .then(res => res.json())
            .then(data => {
                if(data.localData===true){
                    data['c'] = JSON.parse(data['c'])
                    data['h'] = JSON.parse(data['h'])
                    data['l'] = JSON.parse(data['l'])
                    data['o'] = JSON.parse(data['o'])
                    data['v'] = JSON.parse(data['v'])
                    data['t'] = JSON.parse(data['t'])
                }
                var stock_hist_dates = []
                var all_data_array = []
                data.t.map((item, index) => {
                    // stock_hist_dates.push(new Date(item * 1000).toISOString())//convert from timestamp to iso date
                    all_data_array.push(
                        {
                            time: item,
                            open: data.o[index],
                            high: data.h[index],
                            low: data.l[index],
                            close: data.c[index],
                            volume: data.v[index]
                        }
                    )
                })
                setCurrentOHLC(all_data_array[all_data_array.length - 1])
                setApexChartData(all_data_array)
                setLoading(false)
            })
            .catch(err => console.error(err))
    }

    const SuperTrend = (period) => {

        var resolution = 'D'
        var date = new Date();
        date.setDate(date.getDate() - period); //data from 1980 

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                symbol: ticker,
                fromTimestamp: parseInt(date.getTime() / 1000),//convert it to timestamp
                resolution: resolution
            })
        }
        fetch("/api/supertrend", requestOptions)
            .then(res => res.json())
            .then(data => {
                data = JSON.parse(data)
                data.upperBand = JSON.parse(data.upperBand)
                data.lowerBand = JSON.parse(data.lowerBand)
                data.buy_or_sell = JSON.parse(data.buy_or_sell)

                setBuyOrSell(data.buy_or_sell)
                setCandlestickUpperBand(filterSupertrend(data.upperBand))
                setCandlestickLowerBand(filterSupertrend(data.lowerBand))
            })
            .catch(err => console.error(err))
    }

    const filterSupertrend = (data) => {
        var i = 0;
        var toReturnData = []
        while (i < data.length) {
            if (data[i].value == null) i++;
            else {
                var j = i;
                var newArray = []
                while (j < data.length && data[j].value != null) {
                    newArray.push(data[j])
                    j++;
                }
                i = j;
                toReturnData.push(newArray)

            }
        }
        return toReturnData
    }

    const GetStockBasicData = () => {

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                symbol: ticker
            })
        }
        fetch("/api/get-stock-basic-financials", requestOptions)
            .then(res => res.json())
            .then(data => {
                setBasicData({
                    marketCap: data.metric.marketCapitalization,
                    dividendYield: data.metric.dividendYield5Y,
                    eps: data.metric.epsExclExtraItemsTTM,
                    netDebtAnnual: data.metric.netDebtAnnual,
                    freeCashFlowAnnual: data.metric.freeCashFlowAnnual,
                    dayAverageTradingVolume10: data.metric['10DayAverageTradingVolume'],
                    weekPriceReturnDaily26: data.metric['26WeekPriceReturnDaily']

                })
            })
            .catch(err => console.log(err))
    }

    const GetDailyStats = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                quote: ticker
            })
        }
        fetch("/api/get-daily-stats", requestOptions)
            .then(res => res.json())
            .then(data => {
                setDailyStats(data)
                setLastPrice(data.c)
                setCurrentOHLC(data)
            })
            .catch(err => console.log(err))
    }

    const RunWebSocket = (userKey) => {
        const socket = new WebSocket('wss://ws.finnhub.io?token=c9cg3bqad3i8nttpggf0');

        let url = `ws://${window.location.host}/ws/socket-server/`
        const notificationSocket = new WebSocket(url)

        // notificationSocket.onmessage = function (e) {
        //     console.log(JSON.parse(e.data))
        // }

        // Connection opened -> Subscribe
        socket.addEventListener('open', function (event) {
            socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': ticker }))
        });

        // Listen for messages
        socket.addEventListener('message', function (event) {
            notificationSocket.send(JSON.stringify({
                'symbol': JSON.parse(event.data).data[0].s,
                'price': JSON.parse(event.data).data[0].p,
            }))
            notificationSocket.onmessage = function (e) {
                const data = JSON.parse(e.data);
                if(data.alert_name){
                    setAlertSounded(true)
                }
            }
        });

        // Unsubscribe
        var unsubscribe = function (symbol) {
            socket.send(JSON.stringify({ 'type': 'unsubscribe', 'symbol': symbol }))
        }

        socket.addEventListener('close', (event) => {
            unsubscribe(ticker);
            console.log("unsubscribed")
            socket.close()
        });

    }

    const GetMarketNews = () => {
        fetch("/api/get-market-news")
            .then(res => res.json())
            .then(data => {
                setNews(data)
            })
            .catch(err => console.error(err))

    }

    const GetAvaliableIndicators = () => {
        fetch('/api/avaliable-indicators')
            .then(res => res.json())
            .then(data => {
                setAvaliableIndicators(data)
            })
            .catch(err => console.error(err))
    }

    const AlertWebSocket = () => {
        let url = `ws://${window.location.host}/ws/socket-server/`
        const chatSocket = new WebSocket(url)

        chatSocket.onmessage = (e) => {
            let data = JSON.parse(e.data);
            console.log(data)
        }

    }

    useEffect(() => {
        GetCompanies()
        GetMarketNews()
        GetAvaliableIndicators()
        getUser()// run the websocket after the user has been fetched
        GetUserAlerts()
    }, [])

    useEffect(() => {
        GetCompanyProfile()
        GetDailyStats()
        GetStockBasicData()

    }, [ticker])

    useEffect(() => {
        GetStockFullStats(historyPeriod)//from 1982
        SuperTrend(historyPeriod)
    }, [ticker, historyPeriod])

    return (
        <div className="chart-page">
            <CandlestickContent
                apexChartData={apexChartData}
                upperBand={candlestickUpperBand}
                lowerBand={candlestickLowerBand}
                setCurrentOHLC={setCurrentOHLC}
                currentOHLC={currentOHLC}
                companyProfile={currentProfile}
                buy_or_sell={buyOrSell}
                avaliableIndicators={avaliableIndicators}
                setAvaliableIndicators={setAvaliableIndicators}
                companies={companies}
                currentTicker={ticker}
                news={news}
                ohlcDataCompanyProfile={ohlcData}
                lastPrice={allSocketPrices[allSocketPrices.length - 2]}
                dailyStats={dailyStats}
                basicData={basicData}
            />
            <div className="menu-left-candlestick">
                {loading == false &&
                    <MenuCandlestickLeft
                        currentOHLC={currentOHLC}
                        companyProfile={currentProfile}
                    />}
            </div>
        </div>
    )
}

export default CandlestickContainer