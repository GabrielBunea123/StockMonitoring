import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

    const [user, setUser] = useState({})
    const [isAuthenticated, setIsAuthenticated] = useState(false)
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
                console.log(data)
                if (data.username) {
                    setIsAuthenticated(true)
                    setUser(data)
                }
                else{
                    setIsAuthenticated(false)
                    navigate("/login")
                }
                
            })
            .catch(err=>console.log(err))
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
            .catch(err=>console.log(err))
    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <div className="container">
            <div>{user.username}</div>
            <button onClick={handleLogout} className="btn btn-danger mt-5">Logout</button>

        </div>
    )
}

export default Profile