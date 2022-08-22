import React from 'react'
import Chart from "react-apexcharts";

const BarStatisticsChart = ({ data, dates }) => {
    const chartProps = {
        options: {
            theme: {
                mode: 'dark',
            },
            colors:['#0D90FF','#00C6BE','#A6ABBD','#9FAACE','#EBB8D3'],
            chart: {
                background: '#141823',
                stacked: false,
                toolbar: {
                    show: false
                },
            },
            noData: {
                text: 'Loading...'
            },
            legend: {
                position: 'right',
                offsetY: 40
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }],
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 10
                },
            },
            xaxis: {
                type: "date",
                categories: dates
            },
            fill: {
                opacity: 1
            },
        },
        series: data

    }
    return (
        <div style={{ width: "100%", backgroundColor: "#202C47", padding: 5, borderRadius: 5, height: 500 }}>
            <Chart
                options={chartProps.options}
                series={chartProps.series}
                theme="dark"
                type="bar"
                width="100%"
                height="100%"

            />
        </div>
    )
}

export default BarStatisticsChart