import React, { useRef, useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { Box, Toolbar, List, CssBaseline, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material"
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';

import SearchModal from '../functionalComponents/SearchModal'
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Candlestick from '../charts/Candlestick';
import FullScreenMenuLeft from '../functionalComponents/FullScreenMenuLeft';
import IndicatorsModal from '../functionalComponents/IndicatorsModal';
import AlarmModal from '../functionalComponents/AlarmModal';
import MenuCandlestickLeft from '../functionalComponents/MenuCandlestickLeft';
import MenuCandlestickRight from '../functionalComponents/MenuCandlestickRight';
import AlarmSoundedModal from "../functionalComponents/AlarmSoundedModal";


const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    backgroundColor: "#141823",
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    backgroundColor: "#141823",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: "space-between",
    padding: theme.spacing(0, 1),
    paddingLeft: 20,
    backgroundColor: "#141823",
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "#141823",
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        backgroundColor: "#141823",
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);


const CandlestickContent = ({ apexChartData, upperBand, lowerBand, setCurrentOHLC, currentOHLC, companyProfile, buy_or_sell, avaliableIndicators, setAvaliableIndicators, companies, currentTicker, news, ohlcDataCompanyProfile, lastPrice, dailyStats, basicData, alertSounded, alarmSoundedProps, handleAlertSoundedClose, getUserAlerts }) => {
    const handle = useFullScreenHandle();
    const [open, setOpen] = useState(false);


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    return (
        <Box>
            <CssBaseline />
            <AppBar position="fixed" open={open} style={{ background: "#141823"}}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">
                        {companyProfile.ticker}
                    </Typography>

                    <AlarmModal indicators={avaliableIndicators} companyProfile={companyProfile} companySymbol={companyProfile.ticker} getUserAlerts={getUserAlerts}/>
                    <AlarmSoundedModal alarmSoundedProps ={alarmSoundedProps} alertSounded={alertSounded} handleAlertSoundedClose={handleAlertSoundedClose}/>
                    <IndicatorsModal avaliableIndicators={avaliableIndicators} setAvaliableIndicators={setAvaliableIndicators} />
                    <SearchModal />
                    <FullScreen handle={handle}>
                        {handle.active &&
                            <div className="d-flex justify-content-center">
                                <div className="menu-left-candlestick-full-screen">
                                    <FullScreenMenuLeft currentOHLC={currentOHLC} companyProfile={companyProfile} />
                                </div>
                                <div className="flex-grow-1">
                                    <Candlestick apexChartData={apexChartData} upperBand={upperBand} lowerBand={lowerBand} setCurrentOHLC={setCurrentOHLC} fullScreen={true} buy_or_sell={buy_or_sell} avaliableIndicators={avaliableIndicators} />
                                </div>
                            </div>
                        }
                    </FullScreen>

                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <Typography variant="h6">
                        Menu
                    </Typography>
                    <IconButton onClick={handleDrawerClose}>
                        {/* {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />} */}
                        <CloseIcon />
                    </IconButton>
                </DrawerHeader>
                {/* <Divider /> */}
                <List>
                    {/* INDICATORS */}
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            data-bs-toggle="modal" data-bs-target="#indicatorsModal"
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <CandlestickChartIcon />
                            </ListItemIcon>
                            <ListItemText primary="Indicators" sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    {/* SEARCH */}
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            data-bs-toggle="modal" data-bs-target="#exampleModal"
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <SearchIcon />
                            </ListItemIcon>
                            <ListItemText primary="Search quote" sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    {/* ALERT */}
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            data-bs-toggle="modal" data-bs-target="#alarmModal"
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <AddAlertIcon />
                            </ListItemIcon>
                            <ListItemText primary="Set alert" sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>

                    {/* Full screen */}
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            onClick={handle.enter}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <FullscreenIcon />
                            </ListItemIcon>
                            <ListItemText primary="Full screen" sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem button component="a" disablePadding sx={{ display: 'block' }} href="/" style={{ color: 'white' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>

                </List>
            </Drawer>
            <div className="candlesstick-chart-container">
                <Box component="main" sx={{ flexGrow: 1 }}>
                    <Candlestick apexChartData={apexChartData} upperBand={upperBand} lowerBand={lowerBand} setCurrentOHLC={setCurrentOHLC} fullScreen={false} buy_or_sell={buy_or_sell} avaliableIndicators={avaliableIndicators} />
                </Box>
            </div>
            <div className="menu-right-candlestick">
                <MenuCandlestickRight
                    stocks={companies}
                    currentTicker={currentTicker}
                    news={news}
                    companyProfile={companyProfile}
                    ohlcData={ohlcDataCompanyProfile}
                    lastPrice={lastPrice}
                    dailyStats={dailyStats}
                    basicData={basicData}
                />
            </div>
        </Box >
    )
}

export default CandlestickContent
