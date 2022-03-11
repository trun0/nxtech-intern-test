import React, { useEffect, useState } from 'react';
import "./candidate.css";
import axios from "axios";

function Pending(props) {

    const [list, setList] = useState();

    useEffect(() => {
        const page = props.page;
        if(props.list)
        setList(props.list.slice((page-1)*5, page*5));
    }, [props])


    function handleApprove(id) {
        axios
            .put("http://localhost:8000" + "/applications/" + id, {
                currentStatus: "approved"
            })
            .then(function (response) {
                if (response.data.status) {
                    alert(response.data.message);
                    props.handlePending();
                } else {
                    alert(response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function handleReject(id) {
        axios
            .put("http://localhost:8000" + "/applicationsServer/" + id, {
                currentStatus: "rejected"
            })
            .then(function (response) {
                if (response.data.status) {
                    //alert(response.data.message);
                    props.handlePending();
                } else {
                    alert(response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div>
            <h1 className='list-heading'><center>Pending</center></h1>
            {(list) ? list.map(item => {
                return <div key={item.candidate_id} className='list-item-pending'>
                    <div >
                        <div><strong>Name: </strong>{item.candidate_id}</div>
                        <div><strong>Email: </strong>{item.email}</div>
                        <div><strong>Phone: </strong>{item.phone}</div>
                        <div><strong>Area of Interest: </strong>{item.areaofinterest}</div>
                    </div>
                    <div className='decision-btns'>
                        <div className='selection-btn' onClick={e => { handleApprove(item.candidate_id) }} ><button className='btn btn-primary'>Approve</button></div>
                        <div className='selection-btn' onClick={e => { handleReject(item.candidate_id) }} ><button className='btn btn-primary'>Reject</button></div>
                    </div>
                </div>

            }) : null}
        </div>
    )
}

export default Pending;