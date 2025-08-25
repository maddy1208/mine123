import Par from './Par'
import { createContext, useContext } from 'react'
    const grandmsg=createContext()
    export default grandmsg;
const Grand = () => {
    const grand_msg=function(){
        alert("call me to get the gift")
    }



  return (

    <grandmsg.Provider value={grand_msg}>
    <div style={{border:"2px solid blue",padding:"15px",margin:"10px"}}>
        <div>HI im grandparent</div>
       <Par />
    </div>
    </grandmsg.Provider>
  );
}

export  {Grand};
