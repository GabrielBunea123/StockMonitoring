import React from 'react'
import Chart from "react-apexcharts";
import ReactLoading from 'react-loading';

const RadialBarCharts = ({ data }) => {
    const chartProps = {
        options: {
            stroke: {
                colors: ['#141823']
            },
            fill: {
                opacity: 0.6
            },
            legend: {
                show: false
            },
            yaxis: {
                show: false
            },
            labels: ['Buy', 'Hold', 'Sell', 'Strong buy', 'Strong sell'],

        },
        series: data.length>0 && [data[0].buy, data[0].hold, data[0].sell, data[0].strongBuy, data[0].strongSell],

    }
    return (
        <div className="mt-3">
            {data ?
                <>
                    <p>Recommendation trends from {data.length>0 && new Date(data[0].period).toDateString()}</p>
                    <Chart
                        options={chartProps.options}
                        series={chartProps.series}
                        theme="dark"
                        type="donut"
                        width="100%"
                        height="100%"

                    />
                </>
                :
                <div style={{ textAlign: 'center' }}>
                    <div className="d-flex justify-content-center p-10">
                        <ReactLoading type="spin" color="#0D90FF" height={50} width={50} />
                    </div>
                </div>
            }
        </div>
    )
}

export default RadialBarCharts