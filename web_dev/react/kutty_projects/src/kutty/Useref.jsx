import React, { useRef } from 'react';

const Useref = () => {

    const ref1=useRef(0)
    const domm=useRef()

  return (
    <div>
        <p ref={domm}>Clicked: 0</p>
        <button onClick={(obj)=>{

ref1.current++;
// console.log(ref1.current,obj.target.parentElement.querySelector("p").innerText=`Clicked: ${ref1.current}`
// )
domm.current.innerText=`Clicked ${ref1.current}`



        }}>Click</button>
      
    </div>
  );
}

export default Useref;
