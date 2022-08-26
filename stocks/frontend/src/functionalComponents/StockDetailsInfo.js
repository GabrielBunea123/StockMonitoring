import React from 'react'
import { IconButton, Tooltip } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';

const StockDetailsInfo = ({ companyProfile, dailyStats, lastPrice, AddToWatchList }) => {
    return (
        <div>
            <div className="row stock-details-header container-fluid">

                <div class="d-flex ps-1 pe-5 py-3 col-md-4">
                    <div class="flex-shrink-0">
                        <img src={companyProfile.logo} class="img-stock-details" />
                    </div>
                    <div class="flex-grow-1 ms-3">
                        <div className="d-flex">
                            <h4>{companyProfile.ticker}</h4>
                            <Tooltip title="Add to watchlist">
                                <IconButton size="small" onClick={AddToWatchList} style={{ color: "#F5BE3A" }}>
                                    <AddIcon/>
                                </IconButton>
                            </Tooltip>
                        </div>
                        {lastPrice > dailyStats.c ?
                            <h5 class="current-price-minus">{parseFloat(dailyStats.c).toFixed(2)} <i class="fa-solid fa-down-long"></i> {companyProfile.currency}</h5>
                            :
                            <h5 class="current-price-plus">{parseFloat(dailyStats.c).toFixed(2)} <i class="fa-solid fa-up-long"></i> {companyProfile.currency}</h5>
                        }
                    </div>
                </div>

                <div className="ps-1 pe-2 py-3 col-md-3">
                    <p>Last 24h changes</p>
                    <h6 class={dailyStats.dp < 0 ? "current-price-minus" : "current-price-plus"}>{dailyStats.dp}%({dailyStats.d})</h6>
                </div>

                <div className="ps-1 pe-2 py-3 col-md-3">
                    <p>Highest price 24h</p>
                    <h6>{dailyStats.h} {companyProfile.currency}</h6>
                </div>

                <div className="ps-1 pe-2 py-3 col-md-2">
                    <p>Lowest price 24h</p>
                    <h6>{dailyStats.l} {companyProfile.currency}</h6>
                </div>
            </div>
        </div>
    )
}

export default StockDetailsInfo