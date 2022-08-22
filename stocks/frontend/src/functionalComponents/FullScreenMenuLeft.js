import React from 'react'

const FullScreenMenuLeft = ({ currentOHLC, companyProfile }) => {
    return (
        <div>
            <div className="d-flex flex-wrap">
                <div className="me-2">
                    <h5>{companyProfile.ticker}</h5>
                </div>
                <div className="mt-1">
                    <h6>{companyProfile.name}</h6>
                </div>
            </div>
            <div className="d-flex flex-wrap">
                <div className="d-flex pe-3">
                    <div style={{ color: "#F5BE3A", fontWeight: "bold" }}>
                        O
                    </div>
                    <div className="ohlc-candlestick">
                        &nbsp;{currentOHLC.open}
                    </div>
                </div>
                <div className="d-flex pe-3">
                    <div style={{ color: "#F5BE3A", fontWeight: "bold" }}>
                        H
                    </div>
                    <div className="ohlc-candlestick">
                        &nbsp;{currentOHLC.high}
                    </div>
                </div>
                <div className="d-flex pe-3">
                    <div style={{ color: "#F5BE3A", fontWeight: "bold" }}>
                        L
                    </div>
                    <div className="ohlc-candlestick">
                        &nbsp;{currentOHLC.low}
                    </div>
                </div>
                <div className="d-flex">
                    <div style={{ color: "#F5BE3A", fontWeight: "bold" }}>
                        C
                    </div>
                    <div className="ohlc-candlestick">
                        &nbsp;{currentOHLC.close}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FullScreenMenuLeft