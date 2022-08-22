import React from 'react'
import { Button } from '@mui/material'

const MenuCandlestickLeft = ({ currentOHLC, companyProfile }) => {
    var currentPeriod = 7
    return (
        <div>
            <div className="d-flex flex-wrap">
                <div className="mt-1">
                    <h6>{companyProfile.name}</h6>
                </div>
            </div>
            <div className="d-flex flex-wrap p-1" style={{ backgroundColor: "#222632", borderRadius: 5 }}>
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

export default MenuCandlestickLeft