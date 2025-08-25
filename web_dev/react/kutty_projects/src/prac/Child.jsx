import React, { useContext } from 'react';
import grandmsg from './Grand'
   
const Child = () => {
 const  msg=useContext(grandmsg)
 

  return (
    <div style={{border:"2px solid blue",padding:"15px",margin:"10px"}}>
        <div style={{}}>HEllo Im child</div>
        <button  onClick={msg} style={{padding:"10px",margin:" 10px 0"}}>get gift</button>
    </div>
  );
}

export default Child;
