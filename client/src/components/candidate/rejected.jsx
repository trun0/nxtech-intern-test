import React from 'react';
import "./candidate.css";

function Rejected(props) {
  return (
    <div>
      <h1 className='list-heading'><center>Rejected</center></h1>
      {(props.list) ? props.list.map(item => {
        return <div key={item.candidate_id} className="list-item-rejected">
          <div><strong>Name: </strong>{item.candidate_id}</div>
          <div><strong>Email: </strong>{item.email}</div>
          <div><strong>Phone: </strong>{item.phone}</div>
          <div><strong>Area of Interest: </strong>{item.areaofinterest}</div>
        </div>
      }) : null}
    </div>
  )
}

export default Rejected;