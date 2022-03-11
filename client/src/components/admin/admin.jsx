import "./admin.css";
import checkInputValidity from "../inputValidityChecker";
import React, { useState, useEffect } from "react";
import bcrypt from "bcryptjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin(props) {
    const [adminUsername, setAdminUsername] = useState("");
    const [adminPassword, setAdminPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("nxtechAdmin")) {
            navigate("/adminhome");
        }
    }, [])

    function handleUser(event) {
        setAdminUsername(event.target.value);
    }
    function handlePass(event) {
        setAdminPassword(event.target.value);
    }

    function handleAdmin() {
        if (checkInputValidity()) {
            axios
                .post("http://localhost:8000" + "/adminServer", {
                    userName: adminUsername
                })
                .then(function (response) {
                    if (response.data.status) {
                        bcrypt.compare(adminPassword, response.data.password).then((result) => {
                            if (result) {
                                //alert("Login Successfull");
                                localStorage.setItem("nxtechAdmin", adminUsername);
                                navigate("/adminhome");
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
    }

    return (
        <div className="login">
            <div className="big-heading">
                <h1>Login</h1>
                <h6>Admin</h6>
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
                    value={adminUsername}
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
                    value={adminPassword}
                    autoComplete="off"
                    required
                ></input>

                <button
                    onClick={handleAdmin}
                    type="button"
                    className="btn btn-primary button"
                    name="button"
                >
                    LOGIN
                </button>
            </form>
        </div>
    );
}

export default Admin;