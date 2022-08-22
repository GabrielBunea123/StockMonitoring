import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { Button, Chip } from "@mui/material"
import Plot from 'react-plotly.js';
import Chart from "react-apexcharts";

const AreaPriceChart = ({ stockCandlesPriceData, stockCandlesDates, loadingChart, filterStockCandles }) => {

    const [currentPeriod, setCurrentPeriod] = useState('max')

    const chartProps = {
        options: {
            colors: ["#0D90FF"],
            theme: {
                mode: 'dark',
            },
            dataLabels: {
                enabled: false
            },
            chart: {
                background: '#141823',
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false
                }
            },
            fill: {
                gradient: {
                    enabled: true,
                    opacityFrom: 0.55,
                    opacityTo: 0
                }
            },
            xaxis: {
                categories: stockCandlesDates,
                type: 'datetime'
            },
            noData: {
                text: 'Loading...'
            },
        },
        series: [
            {
                name: "Close price",
                data: stockCandlesPriceData && stockCandlesPriceData.map(item => { return item.toFixed(2) })
            }
        ]

    }

    return (
        <div style={{ width: '100%' }} class="chart-container container">
            {loadingChart == false ?
                <div>
                    <div style={{ cursor: "default" }} className="basic-chart-container">
                        <Chart
                            options={chartProps.options}
                            series={chartProps.series}
                            theme="dark"
                            type="area"
                            width="100%"
                            height="100%"

                        />
                    </div>
                    <div className="d-flex flex-wrap">
                        <div className="p2">
                            <Button style={{ color: currentPeriod == 7 ? "#F5BE3A" : "#0D90FF" }} onClick={() => { filterStockCandles(7); setCurrentPeriod(7) }}>1 week</Button>
                        </div>
                        <div className="p2">
                            <Button style={{ color: currentPeriod == 30 ? "#F5BE3A" : "#0D90FF" }} onClick={() => { filterStockCandles(30); setCurrentPeriod(30) }}>1 month</Button>
                        </div>
                        <div className="p2">
                            <Button style={{ color: currentPeriod == 90 ? "#F5BE3A" : "#0D90FF" }} onClick={() => { filterStockCandles(90); setCurrentPeriod(90) }}>3 months</Button>
                        </div>
                        <div className="p2">
                            <Button style={{ color: currentPeriod == 180 ? "#F5BE3A" : "#0D90FF" }} onClick={() => { filterStockCandles(180); setCurrentPeriod(180) }}>6 months</Button>
                        </div>
                        <div className="p2">
                            <Button style={{ color: currentPeriod == 365 ? "#F5BE3A" : "#0D90FF" }} onClick={() => { filterStockCandles(365); setCurrentPeriod(365) }}>1 year</Button>
                        </div>
                        <div className="p2">
                            <Button style={{ color: currentPeriod == 'max' ? "#F5BE3A" : "#0D90FF" }} onClick={() => { filterStockCandles('max'); setCurrentPeriod('max') }}>Max</Button>
                        </div>
                    </div>
                </div>
                :
                <div style={{ textAlign: 'center' }}>
                    <div className="d-flex justify-content-center p-10">
                        <ReactLoading type="bubbles" color="#0D90FF" height={100} width={100} />
                    </div>
                    <h6>Loading...</h6>
                </div>
            }
        </div >

    )
}



// var layout = {F
//     dragmode: 'pan',
//     margin: {
//         r: 10,
//         t: 25,
//         b: 40,
//         l: 30
//     },
//     showlegend: false,
//     autosize: true,
//     height: 500,
//     xaxis: {
//         autorange: true,
//         type: 'date',
//         static: true,
//         color: "#bebebe",
//         fixedrange: true,
//         rangeselector: {
//             buttons: [
//                 {
//                     args: ['type', 'surface'],
//                     count: 1,
//                     label: '1 month',
//                     step: 'month',
//                     stepmode: 'backward',
//                     method: 'restyle'
//                 },
//                 {
//                     count: 3,
//                     label: '3 months',
//                     step: 'month',
//                     stepmode: 'backward',
//                 },
//                 {
//                     count: 6,
//                     label: '6 months',
//                     step: 'month',
//                     stepmode: 'backward',
//                 },
//                 {
//                     count: 1,
//                     label: '1 year',
//                     step: 'year',
//                     stepmode: 'backward',
//                 },
//                 { step: 'all', label: "Max" }
//             ],
//             bgcolor: '#2E3239',
//             bordercolor: '#FFFFFF',
//             font: { color: "white" },
//             showactive: true,
//         },
//     },
//     yaxis: {
//         autorange: true,
//         type: 'linear',
//         color: "#bebebe",
//         fixedrange: true
//     },
//     paper_bgcolor: "#141823",
//     plot_bgcolor: "#141823",
//     displayModeBar: true,
// };

// import React, { useRef } from 'react';
// import Plot from 'react-plotly.js';
// import ReactLoading from 'react-loading';

// const AreaPriceChart = ({ stockCandlesPriceData, stockCandlesDates, loadingChart }) => {

//     const chartContainerRef = useRef()

//     var trace1 = {
//         type: "scatter",
//         mode: "lines",
//         name: 'AAPL High',
//         x: stockCandlesPriceData,
//         y: stockCandlesDates,
//         line: { color: '#17BECF' }
//     }

//     // var trace2 = {
//     //     type: "scatter",
//     //     mode: "lines",
//     //     name: 'AAPL Low',
//     //     x: unpack(rows, 'Date'),
//     //     y: unpack(rows, 'AAPL.Low'),
//     //     line: { color: '#7F7F7F' }
//     // }

//     var data = [trace1];


//     var layout = {
//         title: 'Time Series with Rangeslider',
//         width:500,
//         height:500,
//         xaxis: {
//             autorange: true,
//             range: ['2015-02-17', '2017-02-16'],
//             rangeselector: {
//                 buttons: [
//                     {
//                         count: 1,
//                         label: '1m',
//                         step: 'month',
//                         stepmode: 'backward'
//                     },
//                     {
//                         count: 6,
//                         label: '6m',
//                         step: 'month',
//                         stepmode: 'backward'
//                     },
//                     { step: 'all' }
//                 ]
//             },
//             rangeslider: { range: ['2015-02-17', '2017-02-16'] },
//             type: 'date'
//         },
//         yaxis: {
//             autorange: true,
//             range: [86.8700008333, 138.870004167],
//             type: 'linear'
//         }
//     };

//     return (

//         <div style={{ width: '100%' }} class="chart-container container">
//             {loadingChart == false ?
//                 <div style={{ cursor: "default" }} className="basic-chart-container">
//                     <Plot
//                         data={data}
//                         layout={layout}
//                         style={{width:'100%'}}
//                     />
//                 </div>
//                 :
//                 <div style={{ textAlign: 'center' }}>
//                     <div className="d-flex justify-content-center p-10">
//                         <ReactLoading type="bubbles" color="#0D90FF" height={100} width={100} />
//                     </div>
//                     <h6>Loading...</h6>
//                 </div>
//             }
//         </div >
//     );
// };

export default AreaPriceChart