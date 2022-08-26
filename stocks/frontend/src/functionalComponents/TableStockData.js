import React from 'react'
import { Button } from '@mui/material'
import DivsBasicFinancials from '../functionalComponents/DivsBasicFinancials'

const TableStockData = ({ basicData, chartData }) => {
    return (
        <div class="basic-stock-data-container row container-fluid">
            <div className="col-md-3">
                <DivsBasicFinancials name={"Market cap."} data={basicData.marketCapitalization} />
                <DivsBasicFinancials name={"5y dividend yield"} data={basicData.dividendYield5Y} />
                <DivsBasicFinancials name={"Annual payout ratio"} data={basicData.payoutRatioAnnual} />
                <DivsBasicFinancials name={"52 Weeks high"} data={basicData["52WeekHigh"]} />
            </div>
            <div className="col-md-3">
                <DivsBasicFinancials name={"Beta"} data={basicData.beta} />
                <DivsBasicFinancials name={"EPS TTM"} data={basicData.epsExclExtraItemsTTM} />
                <DivsBasicFinancials name={"P/E ratio TTM"} data={basicData.peExclExtraTTM} />
                <DivsBasicFinancials name={"52 Weeks low"} data={basicData["52WeekLow"]} />
            </div>
            <div className="col-md-3">
                <DivsBasicFinancials name={"Revennue per share TTM"} data={basicData.revenuePerShareTTM} />
                <DivsBasicFinancials name={"26 weeks price return daily"} data={basicData['26WeekPriceReturnDaily']} />
                <DivsBasicFinancials name={"Net debt annual"} data={basicData.netDebtAnnual} />
                <DivsBasicFinancials name={"Gross margin TTM"} data={basicData.grossMarginTTM} />
            </div>
            <div className="col-md-3">
                <DivsBasicFinancials name={"Free cash flow annual"} data={basicData.freeCashFlowAnnual} />
                <DivsBasicFinancials name={"10 days trading volume"} data={basicData['10DayAverageTradingVolume']} />
                <DivsBasicFinancials name={"P/B annual"} data={basicData.pbAnnual} />
                <DivsBasicFinancials name={"Month to date price return daily"} data={basicData.monthToDatePriceReturnDaily} />
            </div>
        </div >
    )
}

export default TableStockData