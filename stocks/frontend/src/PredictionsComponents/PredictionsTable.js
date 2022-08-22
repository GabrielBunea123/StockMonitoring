import React from 'react'

const PredictionsTable = ({ predictions }) => {
    return (
        <div class="table-responsive table-responsive-home">
            <table class="table table-borderless table-stripped stock-table text-white">
                <thead style={{ marginBottom: 10 }}>
                    <tr>
                        <th scope="col" style={{ color: "#727787" }}>
                            Date
                        </th>
                        <th scope="col" style={{ color: "#727787" }}>
                            Target
                        </th>
                        <th scope="col" style={{ color: "#727787" }}>
                            Prediction
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {predictions.date.slice(-10).map((item, index) => (
                        <tr onClick={() => navigate(`/stock-details/${item.ticker}`)}>
                            <th scope="col">
                                {new Date(item).toDateString()}
                            </th>
                            <th scope="col">
                                {predictions.target[index] == 1 ?
                                    <div className="current-price-plus">Going up<i class="fa-solid fa-up-long"></i></div>
                                    :
                                    <div className="current-price-minus">Going down<i class="fa-solid fa-down-long"></i></div>
                                }
                            </th>
                            <th scope="col" class="align-items-center">
                                {predictions.prediction[index] == 1 ?
                                    <div className="current-price-plus">Will go up<i class="fa-solid fa-up-long"></i></div>
                                    :
                                    <div className="current-price-minus">Will go down<i class="fa-solid fa-down-long"></i></div>
                                }
                            </th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PredictionsTable