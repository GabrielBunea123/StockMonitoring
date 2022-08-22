import React, { useEffect, useState } from 'react'
import TableStockData from './TableStockData'
import BarStatisticsChart from '../charts/BarStatisticsChart'

const StockBasicData = ({ stockSymbol }) => {

    const [basicDataMetric, setBasicDataMetric] = useState([])
    const [chartDataTotalEPS, setChartDataEPS] = useState([])
    const [recommendationTrendsDates, setRecommendationTrendsDates] = useState([])
    const [recommendationTrends,setRecommendationTrends] = useState([])

    const GetStockBasicData = () => {

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                symbol: stockSymbol
            })
        }
        fetch("/api/get-stock-basic-financials", requestOptions)
            .then(res => res.json())
            .then(data => {
                setBasicDataMetric(data.metric)
                data.series.annual.eps.slice(0, 5).map(item => {
                    setChartDataEPS(prev => [...prev, item.v])
                })
            })
            .catch(err => console.log(err))
    }


    const GetRecommedationTrends = () =>{
        const requestOptions = {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify({
                quote:stockSymbol
            })
        }
        fetch('/api/recommendation-trends',requestOptions)
        .then(res=>res.json())
        .then(data=>{
            var dates = []
            var buy = []
            var hold = []
            var sell = []
            var strongBuy = []
            var strongSell = []
            data.map((item)=>{
                dates.push(new Date(item.period).toISOString().slice(0, 10))
                buy.push(item.buy)
                hold.push(item.hold)
                sell.push(item.sell)
                strongBuy.push(item.strongBuy)
                strongSell.push(item.strongSell)
            })
            setRecommendationTrendsDates(dates)
            setRecommendationTrends([
                {
                    name:'Buy',
                    data:buy
                },
                {
                    name:'Hold',
                    data:hold
                },
                {
                    name:'Sell',
                    data:sell
                },
                {
                    name:'Strong buy',
                    data:strongBuy
                },
                {
                    name:'Strong sell',
                    data:strongSell
                },
            ])
        })
        .catch(err=>console.error(err))
    }

    useEffect(() => {
        GetStockBasicData()
        GetRecommedationTrends()
    }, [])

    return (
        <div class="social-sentiment-container container">
            <h4 className="mb-5 mt-3 fw-bold">Financials on {stockSymbol}</h4>
            <TableStockData basicData={basicDataMetric} chartData={chartDataTotalEPS} />
            <h4 className="mb-5 mt-3 fw-bold">Recommendation trends</h4>
            <BarStatisticsChart data={recommendationTrends} dates={recommendationTrendsDates} />
        </div>
    )
}

export default StockBasicData