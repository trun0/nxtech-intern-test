import React, { useState, useEffect } from 'react';
import "./adminHome.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Approved from '../candidate/approved';
import Pending from '../candidate/pending';
import Rejected from '../candidate/rejected';

function AdminHome() {

    const [pending, setPending] = useState();
    const [approved, setApproved] = useState();
    const [rejected, setRejected] = useState();
    const [message, setMessage] = useState("pending");
    const [pageNo, setPageNo] = useState(1);
    const [maxPage, setMaxPage] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        handlePending();
    }, [])

    function logout() {
        localStorage.removeItem("nxtechAdmin");
        navigate("/admin");
    }

    function initializeList(type, myCallback) {
        axios.get("http://localhost:8000" + "/applicationsServer/" + type)
            .then(function (response) {
                //console.log(response.data);
                if (response.data.status) {
                    myCallback(response.data.list);
                    setMessage(type);
                    setMaxPage(Math.ceil(response.data.list.length * 0.2));
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
            });

        const tags = document.querySelectorAll(".navlink-active");
        tags.forEach(tag => {
            tag.classList.remove("navlink-active");
        });
        switch (type) {
            case "pending":
                document.getElementsByClassName("navlink")[0].classList.add("navlink-active");
                break;
            case "approved":
                document.getElementsByClassName("navlink")[1].classList.add("navlink-active");
                break;
            case "rejected":
                document.getElementsByClassName("navlink")[2].classList.add("navlink-active");
                break;
            default:
                break;
        }
    }

    function handlePending() {
        initializeList("pending", setPending);
    }
    function handleApproved() {
        initializeList("approved", setApproved);
    }
    function handleRejected() {
        initializeList("rejected", setRejected);
    }

    function handlePrevious() {
        if (pageNo > 1) setPageNo(pageNo - 1);
        else alert("cannot go before page 1");
    }
    function handleNext() {
        if (pageNo < maxPage) setPageNo(pageNo + 1);
        else alert("No more entries");
    }
    function handlePageNo(e) {
        setPageNo(e.target.value);
    }

    return (
        <div className='adminHome'>
            <div className="sidebar">
                <div className='sidebar-nav'>
                    <div className='sidebar-heading'><h4>Applications</h4></div>
                    <div className=''><button onClick={logout} className='btn btn-danger admin-logout-btn'>Logout</button></div>
                </div>
                <div className='navitems'>
                    <div className='navlink' onClick={handlePending}>
                        <i className="sidebar-icon fas fa-hourglass"></i>Pending
                    </div>
                    <div className='navlink' onClick={handleApproved}>
                        <i className="sidebar-icon fas fa-thumbs-up"></i>Approved
                    </div>
                    <div className='navlink' onClick={handleRejected}>
                        <i className="sidebar-icon fas fa-trash mb-2"></i>Rejected
                    </div>
                </div>
            </div>
            <div className='candidate-list'>
                {(message === "pending") ? <Pending page={pageNo} list={pending} handlePending={handlePending} /> : null}
                {(message === "approved") ? <Approved page={pageNo} list={approved} /> : null}
                {(message === "rejected") ? <Rejected page={pageNo} list={rejected} /> : null}
                <div>
                    <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-center">
                            <li className="page-item">
                                <button onClick={handlePrevious} className="page-link">Previous</button>
                            </li>
                            <li className="page-item">
                                <button onClick={handleNext} className="page-link">Next</button>
                            </li>
                        </ul>
                    </nav>
                    <div>Page {pageNo} of {maxPage}</div>
                </div>
            </div>
        </div>
    )
}

export default AdminHome;