import React from 'react'
import { useNavigate } from "react-router-dom";


const StocksTable = ({ stocks, pricesData }) => {
    let navigate = useNavigate();

    return (
        <div class="table-responsive table-responsive-home shadow-lg p-3 mb-5 rounded">
            <table class="table table-borderless table-stripped stock-table text-white">
                <thead style={{ marginBottom: 10 }}>
                    <tr>
                        <th scope="col" style={{ color: "#727787" }}>
                            LOGO
                        </th>
                        <th scope="col" style={{ color: "#727787" }}>
                            Price
                        </th>
                        <th scope="col" style={{ color: "#727787" }}>
                            SYMBOL
                        </th>
                        <th scope="col" className="optional-col" style={{ color: "#727787" }}>
                            NAME
                        </th>
                        <th scope="col" className="optional-col" style={{ color: "#727787" }}>
                            INDUSTRY
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map(item => (
                        <tr onClick={() => navigate(`/stock-details/${item.ticker}`)} class="stocks-table-row">
                            <th scope="col">
                                <img src={item.logo} class="img-stock" />
                            </th>
                            <th scope="col">
                                {pricesData.map((stock, index) => (
                                    <div style={{ color: stock.dp > 0 ? "greenyellow" : "#ef5350" }} className="fw-bold">
                                        {stock.symbol == item.ticker ? `${stock.price}  ${stock.currency}` : null}
                                    </div>
                                ))}
                            </th>
                            <th scope="col" class="align-items-center">
                                {item.ticker}
                            </th>
                            <th scope="col" className="optional-col">
                                {item.name}
                            </th>
                            <th scope="col" className="optional-col">
                                {item.finnhubIndustry}
                            </th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default StocksTable