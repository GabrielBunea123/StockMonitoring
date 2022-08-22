import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Redirect } from "react-router-dom";
import Home from './Home'
import StockDetails from './StockDetails';
import Navbar from './Navbar'
import PredictionsSymbols from './PredictionsSymbols';
import MarketPredictions from './MarketPredictions';
import CandlestickContainer from './CandlestickContainer';
import Profile from './Profile';
import Register from './Register';
import Login from './Login';


const Pages = () => {
    return (
        <Router>
            {window.location.href.slice(21, 28) == "/chart/" ? null : <Navbar />}
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/stock-details/:symbol" element={<StockDetails />}></Route>
                <Route path="/predictions" element={<PredictionsSymbols />}></Route>
                <Route path="/stock-prediction/:symbol" element={<MarketPredictions />}></Route>
                <Route path="/chart/:ticker" element={<CandlestickContainer />}></Route>
                <Route path="/profile" element={<Profile />}></Route>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/login" element={<Login />}></Route>
            </Routes>
        </Router>
    )
}

export default Pages