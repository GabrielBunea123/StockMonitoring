import React, { useState, useEffect } from 'react'
import StocksTable from './StocksTable'
import { useNavigate } from "react-router-dom";
import NewsCandlestick from './NewsCandlestick';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CandlestickCompanyProfile from './CandlestickCompanyProfile';

const drawerWidth = 300


const MenuCandlestickRight = ({ stocks, currentTicker, companyProfile, ohlcData, lastPrice, dailyStats, basicData }) => {


    const GetDailyStats = (ticker) => {
        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                quote: ticker
            })
        }
        fetch('/api/get-daily-stats', requestOptions)
            .then(res => res.json())
            .then(data => {
                stocks.map(item => {
                    if (item.ticker == ticker) {
                        item.price = data.c
                        item.dp = data.dp
                    }
                })
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        if (stocks.length > 0) {
            stocks.map(item => {
                GetDailyStats(item.ticker)
            })
        }
    }, [stocks])

    return (
        <Box>
            <CssBaseline />
            <Drawer
                PaperProps={{
                    sx: {
                        backgroundColor: "#141823",
                        color: "white",
                        zIndex: 1
                    }
                }}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="right"
            >
                <Toolbar />
                <Divider />
                <div className="watchlist-container-candlestick">
                    <List component="nav">
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary="Watchlist"
                                primaryTypographyProps={{ fontSize: 17, fontWeight: "bold" }}
                            />
                        </ListItem>
                        {stocks.map(item => (
                            <>
                                <ListItemButton
                                    sx={{ padding: 2, paddingLeft: 2 }}
                                    selected={currentTicker == item.ticker}
                                    onClick={() => location.href = `/chart/${item.ticker}`}
                                >
                                    <ListItemIcon>
                                        <img src={item.logo} className="img-stock-candlestick" />
                                    </ListItemIcon>
                                    <ListItemText primary={item.ticker} primaryTypographyProps={{ fontWeight: "bold" }} />
                                    <ListItemText
                                        primary={item.price}
                                        primaryTypographyProps={{ color: item.dp < 0 ? 'greenyellow' : "#ef5350" }}
                                    />
                                </ListItemButton>
                                <Divider />
                            </>
                        ))}
                    </List>
                </div>
                <div className="company-profile-container-candlestick">
                    <CandlestickCompanyProfile
                        companyProfile={companyProfile}
                        ohlcData={ohlcData}
                        lastPrice={lastPrice}
                        dailyStats={dailyStats}
                        basicData={basicData}
                    />
                </div>
            </Drawer>
        </Box>
    )
}

export default MenuCandlestickRight