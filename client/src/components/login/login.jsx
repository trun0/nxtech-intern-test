import "./login.css";
import checkInputValidity from "../inputValidityChecker";
import React, { useState, useEffect } from "react";
import bcrypt from "bcryptjs";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import baseUrl from "../baseUrl";

function Login(props) {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const navigate = useNavigate();


    useEffect(() => {
        if (localStorage.getItem("nxtechUser")) {
            navigate("/userhome");
        }
    }, [])

    function handleUser(event) {
        setLoginUsername(event.target.value);
    }
    function handlePass(event) {
        setLoginPassword(event.target.value);
    }

    function handleLogin() {
        if (checkInputValidity()) {
            axios
                .post(baseUrl + "loginServer", {
                    userName: loginUsername
                })
                .then(function (response) {
                    if (response.data.status) {
                        bcrypt.compare(loginPassword, response.data.password).then((result) => {
                            if (result) {
                                localStorage.setItem("nxtechUser", response.data.id);
                                //alert("Login Successfull");
                                navigate("/userhome");
                            }
                            else alert("Wrong username and/or password. Try again");
                        })
                    } else {
                        alert(response.data.message);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else alert("Try again. Please don't leave empty fields")
    }

    return (
        <div className="login">
            <div className="big-heading">
                <h1>Login</h1>
                <h6>User</h6>
            </div>
            <form className="">
                <label className="required">
                    <i className="fas fa-user mb-2"></i> Username
                </label>
                <input
                    onChange={handleUser}
                    type="text"
                    className="form-control username"
                    name="username"
                    placeholder="Enter Username"
                    value={loginUsername}
                    autoComplete="off"
                    required
                ></input>

                <label className="required">
                    <i className="fas fa-lock mb-2"></i> Password
                </label>
                <input
                    onChange={handlePass}
                    type="password"
                    className="form-control password"
                    name="password"
                    placeholder="Enter Password"
                    value={loginPassword}
                    autoComplete="off"
                    required
                ></input>

                <button
                    onClick={handleLogin}
                    type="button"
                    className="btn btn-primary button"
                    name="button"
                    value="Login"
                >
                    LOGIN
                </button>

                <div className="extra">
                    <strong>New user? </strong><Link to="/signup">Create an account</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;