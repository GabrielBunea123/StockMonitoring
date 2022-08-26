import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StocksTable from '../functionalComponents/StocksTable';
import Alarm from '@mui/icons-material/Alarm'

const Profile = () => {

    const [user, setUser] = useState({})
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [companies, setCompanies] = useState([])
    const [dailyStocksPrice, setDailyStocksPrice] = useState([])
    const [loadedWatchlist, setLoadedWatchlist] = useState(false)
    const [userAlerts, setUserAlerts] = useState([])
    const navigate = useNavigate()

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }//csrftoken
        return cookieValue;
    }

    var csrftoken = getCookie('csrftoken');

    function getUser() {
        var authToken = localStorage.getItem('tokenAuth')
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${authToken}`
            }
        }
        fetch("/users/get-user", requestOptions)
            .then((res) => res.json())
            .then((data) => {
                if (data.username) {
                    setIsAuthenticated(true)
                    setUser(data)
                }
                else {
                    setIsAuthenticated(false)
                    navigate("/login")
                }

            })
            .catch(err => console.log(err))
    }

    const GetUserWatchlist = () => {
        var authToken = localStorage.getItem('tokenAuth')
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${authToken}`
            }
        }
        fetch('/api/get-user-watchlist', requestOptions)
            .then(res => res.json())
            .then(data => {
                data.map(item => {
                    setCompanies(prev => [...prev, item])
                    GetDailyStats(item.ticker, item.currency)
                })
                setLoadedWatchlist(true)
            })
            .catch(error => console.error(error))
    }

    const GetDailyStats = (symbol, currency) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                quote: symbol
            })
        }
        fetch("/api/get-daily-stats", requestOptions)
            .then(res => res.json())
            .then(data => {
                setDailyStocksPrice(prev => [...prev, { symbol: symbol, price: data.c, currency: currency, dp: data.dp }])
            })
            .catch(err => console.log(err))
    }

    const GetUserAlerts = () => {
        var authToken = localStorage.getItem('tokenAuth')
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${authToken}`
            }
        }
        fetch("/api/get-all-user-alerts", requestOptions)
            .then(res => res.json())
            .then(data => {
                setUserAlerts(data)
            })
            .catch(err => console.log(err))
    }

    const handleLogout = () => {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            mode: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                logout_user: isAuthenticated
            })
        }
        fetch("/users/logout", requestOptions)
            .then((res) => res.json())
            .then((data) => {
                localStorage.setItem("tokenAuth", "")
                setIsAuthenticated(false)
                navigate("/login")

            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getUser()
        GetUserWatchlist()
        GetUserAlerts()
    }, [])

    return (
        <div className="container">
            <div className="profile-stats d-flex justify-content-start flex-wrap pt-5">
                <div className="pe-2">
                    <img src="https://ecommerce-101.s3.us-east-2.amazonaws.com/profile/Wallpaper_rocket.jpg" className="profile-img image-thumbnail" alt="..."></img>
                </div>


                <div className="ps-2 pt-3">
                    <h4 className="p-0">{user.username}</h4>
                    <div className="p-0">{user.email}</div>
                    <div className="p-0">Date joined: {new Date(user.date_joined).toDateString()}</div>
                </div>

            </div>

            <div className="followed-stocks pt-5">
                <h4 style={{ fontWeight: "bold", paddingTop: 10, paddingBottom: 25 }}>Followed stocks</h4>
                {loadedWatchlist && companies.length > 0 ?
                    <StocksTable stocks={companies} pricesData={dailyStocksPrice} />
                    :
                    <div className="shadow-lg p-3 mb-5 rounded text-center">
                        <h6 style={{ fontWeight: "bold", padding: 20, color: "grey" }}>There are no followed stocks yet</h6>
                    </div>
                }

            </div>

            <div className="alerts pt-3">
                <h4 style={{ fontWeight: "bold", paddingTop: 10, paddingBottom: 25 }}>Alerts</h4>
                {userAlerts.length > 0 ?
                    <div class="table-responsive table-responsive-home shadow-lg p-3 mb-5 rounded">
                        <table class="table table-borderless table-stripped stock-table text-white">
                            <thead style={{ marginBottom: 10 }}>
                                <tr>
                                    <th scope="col" style={{ color: "#727787" }}>
                                        Alert
                                    </th>
                                    <th scope="col" style={{ color: "#727787" }}>
                                        Condition
                                    </th>
                                    <th scope="col" style={{ color: "#727787" }}>
                                        Trigger
                                    </th>
                                    <th scope="col" className="optional-col" style={{ color: "#727787" }}>
                                        Value
                                    </th>
                                    <th scope="col" className="optional-col" style={{ color: "#727787" }}>
                                        Active
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {userAlerts.map(item => (
                                    <tr class="alert-table-row">
                                        <th scope="col">
                                            <Alarm/>
                                        </th>
                                        <th scope="col">
                                            {item.condition}
                                        </th>
                                        <th scope="col" class="align-items-center">
                                            {item.trigger}
                                        </th>
                                        <th scope="col" className="optional-col">
                                            {item.value}
                                        </th>
                                        <th scope="col" className="optional-col">
                                            {item.isActive.toString()}
                                        </th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    :
                    <div className="shadow-lg p-3 mb-5 rounded text-center">
                        <h6 style={{ fontWeight: "bold", padding: 20, color: "grey" }}>There are no alerts yet</h6>
                    </div>
                }

            </div>

            <button onClick={handleLogout} className="btn btn-danger my-5">Logout</button>

        </div>
    )
}

export default Profile