import React, { useEffect, useState } from 'react'
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LineChart,
    Line,
    Legend,
    ResponsiveContainer
} from 'recharts';
import ReactLoading from 'react-loading';
import { useParams } from 'react-router-dom';
import LinePredictionsChart from '../charts/LinePredictionsChart';
import PredictionsTable from '../PredictionsComponents/PredictionsTable';

const MarketPredictions = () => {

    const [predictions, setPredictions] = useState([])//if the price went up or down
    const [chartLoading, setChartLoading] = useState(true)
    let { symbol } = useParams();

    const getPrediction = () => {
        fetch(`/api/stock-prediction/${symbol}`)
            .then(res => res.json())
            .then(data => {
                const deserealizedData = JSON.parse(data)
                // managePredictions(deserealizedData.data)
                setPredictions(deserealizedData.data)
                setChartLoading(false)
                console.log(deserealizedData.data)

            })
            .catch(err => console.error(err))
    }

    // const managePredictions = (data) => {
    //     data.map((item, index) => {
    //         setPredictions(prev => [...prev, { prediction: item.prediction, date: item.date, target: item.target }])
    //         setChartLoading(false)
    //     })
    // }

    useEffect(() => {
        getPrediction();
    }, [])
    return (
        <div class="stock-details-header container">
            <div style={{ width: '100%' }}>
                {chartLoading == false ?
                    <div>
                        <h5 className="pt-4 pb-3 fw-bold">Predictions for the last 10 days</h5>
                        <PredictionsTable predictions={predictions} />
                        <h5 className="pt-5 fw-bold">Representation</h5>
                        <div>
                            <p>
                                If the prediction and the target are equal, it means that the algorithm predicted right where the price goes. If they are different, the algorithm has failed.
                                <div>
                                    The purpose of this part of the project is only for fun as the price where the stock will go is unknown.
                                </div>
                            </p>

                            <div>
                                1.0 - Up
                            </div>
                            <div>
                                0.0 - Down
                            </div>
                        </div>
                        <LinePredictionsChart predictions={predictions} />
                    </div>
                    :
                    <div style={{ textAlign: 'center' }}>
                        <div className="d-flex justify-content-center p-10">
                            <ReactLoading type="bubbles" color="#0D90FF" height={100} width={100} />
                        </div>
                        <h6>Loading...</h6>
                    </div>
                }
            </div>
        </div>
    )
}

export default MarketPredictions