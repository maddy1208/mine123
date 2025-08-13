import  { useEffect, useState } from 'react';
import '../css/advice.css'

const Advice_app = () => {

useEffect(function(){
getadvice()

},[])

async function getadvice(obj){

  await  fetch(`https://api.adviceslip.com/advice?date=${new Date()}`).then((response)=>response.json())
  
  .then((data)=>{
    setadvice(data.slip.advice);
  setcount((count)=>count+1)
  }

)}
  

    const [advice,setadvice]=useState("POi velaya paru")
    const [count,setcount]=useState(0)
  return (
   <div className="container">
    <p>YOu have read  <span>{count}</span>advices</p>
    <p>Your Advice : {advice}</p>
    <button onClick={getadvice}>Get Advice</button>
   </div>
  );
}

export default Advice_app;
