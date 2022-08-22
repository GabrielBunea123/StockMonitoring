import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import { Button } from '@mui/material';

const Candlestick = ({ apexChartData, upperBand, lowerBand, setCurrentOHLC, buy_or_sell, fullScreen, avaliableIndicators }) => {
    const backgroundColor = '#141823'
    const lineColor = '#141823'
    const textColor = 'white'
    const areaTopColor = '#2962FF'
    const areaBottomColor = 'rgba(41, 98, 255, 0.28)'
    const chartContainerRef = useRef()
    var currentPeriod = 7

    //!!! MAKE THE SUPERTREND AND THE BUY/SELL DIFFERENT FUNCTIONS

    const SuperTrendAndBuyAndSell = (lower, upper, chart, hasBuyAndSell, hasSupertrend) => {
        if (lower.length > 0 && hasSupertrend) {
            lower.map((item, index) => {
                var lineLowerBand = chart.addLineSeries(
                    {
                        color: '#26a69a',
                        priceLineVisible: false,
                        crosshairMarkerVisible: false,
                    }
                )
                lineLowerBand.setData(item)
                if (hasBuyAndSell == true)
                    lineLowerBand.setMarkers([{//the buy or sell marker
                        time: buy_or_sell[index].time,
                        position: 'belowBar',
                        color: '#0D90FF',
                        shape: 'arrowUp',
                        id: index,
                        size: 2,
                        text: "Buy"
                    }])
            })
        }

        if (upper.length > 0 && hasSupertrend)
            upper.map((item, index) => {
                const lineUpperBand = chart.addLineSeries(
                    {
                        color: '#ef5350',
                        priceLineVisible: false,
                        crosshairMarkerVisible: false,
                    }
                )
                lineUpperBand.setData(item)
                if (hasBuyAndSell == true)
                    lineUpperBand.setMarkers([{//the buy or sell marker
                        time: buy_or_sell[index].time,
                        position: 'aboveBar',
                        color: '#F5BE3A',
                        shape: 'arrowDown',
                        id: index,
                        size: 2,
                        text: "Sell"
                    }])
            })
    }

    const Volume = (volumeSeries, data, hasVolume) => {
        if (hasVolume == true)
            volumeSeries.setData(data.map(item => {
                return ({ time: item.time, value: item.volume })
            }))
    }

    useEffect(
        () => {
            const handleResize = () => {
                chart.applyOptions({
                    width: fullScreen == false ? window.innerWidth > 720 ? chartContainerRef.current.clientWidth - 300 : chartContainerRef.current.clientWidth : chartContainerRef.current.clientWidth,
                    height: fullScreen == true ? chartContainerRef.current.clientHeight : chartContainerRef.current.clientHeight
                });
            };

            const chart = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: backgroundColor },
                    textColor,
                },
                width: fullScreen == false ? window.innerWidth > 720 ? chartContainerRef.current.clientWidth - 300 : chartContainerRef.current.clientWidth : chartContainerRef.current.clientWidth,
                height: fullScreen == true ? chartContainerRef.current.clientHeight : chartContainerRef.current.clientHeight,
                grid: {
                    vertLines: {
                        color: "#212530"
                    },
                    horzLines: {
                        color: "#212530"
                    }
                },
                trackingMode: {
                    exitMode: 0
                },
                kineticScroll: {
                    mouse: true,
                    touch: true
                },
                handleScroll: {
                    mouseWheel: true,
                    pressedMouseMove: true,
                    horzTouchDrag: true,
                    vertTouchDrag: true
                },
                handleScale: {
                    mouseWheel: true
                },
                crosshair: {
                    mode: 0,
                    horzLine: {
                        visible: true,
                    },
                    vertLine: {
                        visible: true
                    }
                },
                localization: {
                    locale: "datetime"
                },


            });

            chart.timeScale()

            const newSeries = chart.addCandlestickSeries({
                lastValueVisible: true,
            });
            newSeries.setData(apexChartData)

            var volumeSeries = chart.addHistogramSeries({
                color: '#222632',
                priceFormat: {
                    type: 'volume',
                },
                priceScaleId: '',
                scaleMargins: {
                    top: 0.9,
                    bottom: 0,
                },
            });
            //volume

            //buy and sell
            var hasBuyAndSell = false;
            var hasVolume = false;
            var hasSupertrend = false;
            
            avaliableIndicators.map((item) => {
                if (item.name == "Supertrend" && item.value == true) {
                    hasSupertrend = true
                }
                if (item.name == "Buy/Sell" && item.value == true) {
                    hasBuyAndSell = true
                }
                if (item.name == "Volume" && item.value == true) {
                    hasVolume = true
                }
            })
            SuperTrendAndBuyAndSell(lowerBand, upperBand, chart, hasBuyAndSell, hasSupertrend)
            Volume(volumeSeries, apexChartData, hasVolume)

            window.addEventListener('resize', handleResize);
            chart.subscribeCrosshairMove(param => {
                if (param.time) {
                    setCurrentOHLC(param.seriesPrices.get(newSeries))
                }
            })


            return () => {
                window.removeEventListener('resize', handleResize);

                chart.remove();
            };
        },
        [backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor, apexChartData, lowerBand, upperBand, buy_or_sell, avaliableIndicators]
    );

    return (
        <div>
            <div className={fullScreen ? "candlestick-height-full-screen" : "candlestick-height"} ref={chartContainerRef}></div>
        </div>
    );
};

export default Candlestick


