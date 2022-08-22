import React, { useEffect, useState } from 'react'
import RadialBarCharts from '../charts/RadialBarChart'

const CandlestickCompanyProfile = ({ companyProfile, ohlcData, lastPrice, dailyStats, basicData, ref, refTop }) => {

  const [trends, setTrends] = useState([])

  const getRecommendationTrends = () => {
    const requestOptions = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quote: companyProfile.ticker
      })
    }
    fetch('/api/recommendation-trends', requestOptions)
      .then(res => res.json())
      .then(data => {
        setTrends(data)
      })
      .catch(err => console.error(err))
  }

  const getPriceColor = () => {
    if (ohlcData.p) {
      if (lastPrice <= ohlcData.p) {
        return (
          <h4 className="current-price-plus">{ohlcData.p.toFixed(2)} {companyProfile.currency}</h4>
        )
      }
      else {
        return (
          <h4 className="current-price-minus">{ohlcData.p.toFixed(2)} {companyProfile.currency}</h4>
        )
      }
    }
    return (
      <h4 className="current-price-plus">{dailyStats.c} {companyProfile.currency}</h4>
    )
  }

  useEffect(() => {
    getRecommendationTrends()
  }, [])

  return (
    <div ref={ref} className="menu-right-candlestick">
      <div ref={refTop} className="resizer resizer-t">

        <div className="p-3">
          <div className="d-flex">
            <div className="pe-3">
              <img src={companyProfile.logo} class="img-stock" />
            </div>
            <div>
              <h5 style={{ fontWeight: "bold" }} className="pt-2">{companyProfile.ticker}</h5>
            </div>
          </div>
          <div className="pt-2 candlestick-company-profile-name">
            <p>{companyProfile.name}</p>
          </div>
          <div className="d-flex pt-3">
            <div className="pe-3">
              {getPriceColor()}
            </div>
            <div className="pt-1">
              <p class={dailyStats.dp < 0 ? "current-price-minus" : "current-price-plus"}>{dailyStats.dp}%</p>
            </div>
          </div>

          {/* <RadialBarCharts data={trends}/> */}

          <hr></hr>
          <div className="ohlc-company-profile-candlestick">
            <div className="d-flex pt-1">
              <div style={{ color: "#F5BE3A" }} className="pe-2 fw-bold">
                Open
              </div>
              <div>
                {dailyStats.o}
              </div>
            </div>
            <div className="d-flex pt-1">
              <div style={{ color: "#F5BE3A" }} className="pe-2 fw-bold">
                High
              </div>
              <div>
                {dailyStats.h}
              </div>
            </div>
            <div className="d-flex pt-1">
              <div style={{ color: "#F5BE3A" }} className="pe-2 fw-bold">
                Low
              </div>
              <div>
                {dailyStats.l}
              </div>
            </div>
            <div className="d-flex pt-1">
              <div style={{ color: "#F5BE3A" }} className="pe-2 fw-bold">
                Close
              </div>
              <div>
                {dailyStats.c}
              </div>
            </div>
            <div className="d-flex pt-1">
              <div style={{ color: "#F5BE3A" }} className="pe-2 fw-bold">
                Price change
              </div>
              <div>
                {dailyStats.d}
              </div>
            </div>
          </div>
          <hr></hr>
          <h5 className="pt-3 pb-2 fw-bold">Financials</h5>
          <div className="pt-3">
            <div>
              <p style={{ color: "#c5c5c5", fontWeight: "bold", fontSize: 13 }}>Market cap: {basicData.marketCap}</p>
            </div>
            <div>
              <p style={{ color: "#c5c5c5", fontWeight: "bold", fontSize: 13 }}>Dividend yield: {basicData.dividendYield}</p>
            </div>
            <div>
              <p style={{ color: "#c5c5c5", fontWeight: "bold", fontSize: 13 }}>EPS TTM: {basicData.eps}</p>
            </div>
            <div>
              <p style={{ color: "#c5c5c5", fontWeight: "bold", fontSize: 13 }}>Net debt annual: {basicData.netDebtAnnual}</p>
            </div>

            <div>
              <p style={{ color: "#c5c5c5", fontWeight: "bold", fontSize: 13 }}>Free cash flow annual: {basicData.freeCashFlowAnnual}</p>
            </div>
            <div>
              <p style={{ color: "#c5c5c5", fontWeight: "bold", fontSize: 13 }}>10 days trading volume: {basicData.dayAverageTradingVolume10}</p>
            </div>
            <div>
              <p style={{ color: "#c5c5c5", fontWeight: "bold", fontSize: 13 }}>26 weeks price return daily: {basicData.weekPriceReturnDaily26}</p>
            </div>
            <div>
              <p style={{ color: "#c5c5c5", fontWeight: "bold", fontSize: 13 }}>
                {/* Website: <a className="weburl" href={companyProfile.weburl}>{companyProfile.weburl.slice(0,40)}</a> */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default CandlestickCompanyProfile