import React, { useEffect } from 'react'
import Chart from "react-apexcharts";

const LinePredictionsChart = ({ predictions }) => {
    const chartProps = {
        options: {
            colors: ["#F5BE3A", "#0D90FF"],
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
                categories: predictions.date,
                type: "datetime",
            },
            noData: {
                text: 'Loading...'
            },
        },
        series: [
            {
                name: "Prediction",
                data: predictions.prediction
            },
            {
                name: "Actual",
                data: predictions.target
            }
        ],

    }
    return (
        <div style={{ width: '100%' }} class="basic-chart-container mt-5">
            <Chart
                options={chartProps.options}
                series={chartProps.series}
                theme="dark"
                type="line"
                width="100%"
                height="100%"

            />
        </div>
    )
}

export default LinePredictionsChart