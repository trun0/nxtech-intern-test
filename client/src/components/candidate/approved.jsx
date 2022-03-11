import React from 'react';
import "./candidate.css";

function Approved(props) {
  return (
    <div>
      <h1 className='list-heading'><center>Approved</center></h1>
      {(props.list) ? props.list.map(item => {
        return <div key={item.candidate_id} className='list-item-approved'>
          <div><strong>Name: </strong>{item.candidatename}</div>
          <div><strong>Email: </strong>{item.email}</div>
          <div><strong>Phone: </strong>{item.phone}</div>
          <div><strong>Area of Interest: </strong>{item.areaofinterest}</div>
        </div>
      }) : null}
    </div>
  )
} 

export default Approved;