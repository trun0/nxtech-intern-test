import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./userHome.css";
import checkInputValidity from '../inputValidityChecker';
import axios from "axios";
import baseUrl from '../baseUrl';

function UserHome() {

    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [aoi, setAoi] = useState("");
    const [status, setStatus] = useState("Not sent");

    useEffect(() => {
        initialize();
    }, [])

    function initialize() {
        if (localStorage.getItem("nxtechUser")) {
            axios
                .get(baseUrl + "userServer/" + localStorage.getItem("nxtechUser"))
                .then(function (response) {
                    if (response.data.status) {
                        //alert(response.data.message);
                        const candidate = response.data.candidate;
                        setStatus(candidate.currentstatus ? candidate.currentstatus : '');
                        setName(candidate.candidatename ? candidate.candidatename : '');
                        setEmail(candidate.email ? candidate.email : '');
                        setPhone(candidate.phone ? candidate.phone : '');
                        setAoi(candidate.areaofinterest ? candidate.areaofinterest : '');
                    } else {
                        alert(response.data.message);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else {
            navigate("/login");
        }
    }

    function handleUser() {
        if (checkInputValidity()) {
            axios
                .put(baseUrl + "userServer/" + localStorage.getItem("nxtechUser"), {
                    candidateName: name,
                    email: email,
                    phone: phone,
                    areaOfInterest: aoi,
                    currentStatus: "pending"
                })
                .then(function (response) {
                    if (response.data.status) {
                        alert("Application sent. Thank you for applying");
                        initialize();
                    } else {
                        alert(response.data.message);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    function handleDelete() {
        axios
            .delete(baseUrl + "applicationsServer/" + localStorage.getItem("nxtechUser"))
            .then(function (response) {
                if (response.data.status) {
                    //alert(response.data.message);
                    initialize();
                } else {
                    alert(response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    function logout() {
        localStorage.removeItem("nxtechUser");
        navigate("/login");
    }

    return (
        <div>
            <div className='logout-btn'>
                <button onClick={logout} className='btn btn-danger'>Logout</button>
            </div>
            <div className='userForm' >
                <h1 className='userHeading'>{(status === "Not sent") ? <span>Enter</span> : <span>Edit</span>} your Details</h1>
                <div className='inputGroup'>
                    <div className='row'>
                        <div className='col-sm-4'>
                            <label className='form-label required'>Name</label>
                        </div>
                        <div className='col'>
                            <input type="text" required placeholder='your name' onChange={e => { setName(e.target.value) }} value={name} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-sm-4'>
                            <label className='form-label required'>Email</label>
                        </div>
                        <div className='col'>
                            <input type="email" required placeholder='name@email.com' onChange={e => { setEmail(e.target.value) }} value={email} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-sm-4'>
                            <label className='form-label required'>Phone</label>
                        </div>
                        <div className='col'>
                            <input type="text" required placeholder='10 digit phone number' className='' onChange={e => { setPhone(e.target.value) }} value={phone} pattern="[1-9]{1}[0-9]{9}"/>
                            <div className="form-text">Only 10 digit numbers | Don't start with 0</div>                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-sm-4'>
                            <label className='form-label required'>Area of Interest</label>
                        </div>
                        <div className='col'>
                            <input type="text" required placeholder='e.g. Android, Web, etc' onChange={e => { setAoi(e.target.value); }} value={aoi} />
                        </div>
                    </div>
                </div>
                <div className='apply'>
                    <button onClick={handleUser} className='btn btn-success application-btn'>Send Application</button>
                </div>
            </div>
            <div className='application-status'>
                <strong>Application Status : </strong>{status}
            </div>
            {(status === "Not sent") ? null: <div className='delete-application'>
                <button onClick={handleDelete} className='btn btn-warning'>Delete Application</button>
            </div>}
        </div>
    )
}

export default UserHome;