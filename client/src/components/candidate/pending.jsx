import React, { useEffect, useState } from 'react';
import "./candidate.css";
import axios from "axios";
import Loading from '../loading';
import baseUrl from '../baseUrl';

function Pending(props) {

    const [list, setList] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Loading");

    useEffect(() => {
        const page = props.page;
        if(props.list)
        setList(props.list.slice((page-1)*5, page*5));
        setLoading(false);
    }, [props])


    function handleApprove(id) {
        setLoading(true);
        setLoadingText("Approving");
        axios
            .put(baseUrl + "applicationsServer/" + id, {
                currentStatus: "approved"
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
                setLoading(false);
            });
    }

    function handleReject(id) {
        setLoading(true);
        setLoadingText("Rejecting");
        axios
            .put(baseUrl + "applicationsServer/" + id, {
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
                setLoading(false);
            });
    }

    return (
        <div>
            <h1 className='list-heading'><center>Pending</center></h1>

{loading ? <Loading text={loadingText}/> : 
            (list) ? list.map(item => {
                return <div key={item.candidate_id} className='list-item-pending'>
                    <div >
                        <div><strong>Name: </strong>{item.candidatename}</div>
                        <div><strong>Email: </strong>{item.email}</div>
                        <div><strong>Phone: </strong>{item.phone}</div>
                        <div><strong>Area of Interest: </strong>{item.areaofinterest}</div>
                    </div>
                    <div className='decision-btns'>
                        <div className='selection-btn' onClick={e => { handleApprove(item.candidate_id) }} ><button className='btn btn-primary'>Approve</button></div>
                        <div className='selection-btn' onClick={e => { handleReject(item.candidate_id) }} ><button className='btn btn-primary'>Reject</button></div>
                    </div>
                </div>

            }) : null
        }
        </div>
    )
}

export default Pending;