import { Button } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [incorrectCredentials, setIncorrectCredentials] = useState(false)
    const navigate = useNavigate()

    function usernameChange(e) {
        setUsername(e.target.value)
    }
    function passwordChange(e) {
        setPassword(e.target.value)
    }
    function submit(e) {
        e.preventDefault()
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        }
        fetch("/users/login", requestOptions)
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }
                else {
                    setIncorrectCredentials(true)
                }
            })
            .then((data) => {
                localStorage.setItem("tokenAuth", data.key)
                console.log(data)
                navigate('/profile')
            })
            .catch(err=>console.log(err))
    }


    return (
        <form className="container authentication-container" onSubmit={submit}>
            <div className="card card-auth shadow rounded p-5">
                <h3 className="pt-3 pb-3 fw-bold" style={{ color: "white" }}>Sign in</h3>
                {incorrectCredentials == true ?
                    <label className="fw-bold" style={{ color: "#f7636c" }}>Your username or password is incorrect</label>
                    :
                    null
                }
                <input onChange={usernameChange} className="form-control m-2 ms-0 mt-3" placeholder="Username" type="username" />
                <input onChange={passwordChange} className="form-control m-2 ms-0 mt-3" placeholder="Password" type="password" />
                <button type="submit" class="mt-5 btn fw-bold .text-nowrap" style={{ backgroundColor: "#0D90FF", color: "#E4F0FF" }}>Sign in</button>
                <div className="pt-5">
                    <small>
                        <a style={{ color: "white" }} href="/register">Don't have an account? Create one here</a>
                    </small>
                </div>
            </div>
        </form>
    )
}

export default Login