import { useEffect, useState } from "react";

function Advice_com(){
    const [advice,setadvice]=useState("Your Advice")
    const [count,setcount]=useState(0)

async function  getadvice(){
    const advice_res=await fetch(`https://api.adviceslip.com/advice?${new Date()}`)
  const json_res= await advice_res.json()
  setadvice(json_res.slip.advice)
  console.log(json_res.slip.advice)
  setcount((prev)=>prev+1)



}

useEffect(()=>{getadvice()},[])
    return <>
  


<h1>Simple Advice App</h1>
<p>Click below to get advice</p>
<button onClick={getadvice}>Get Advice</button>
<p>Your Advice: {advice}</p>

<p>You have read {count} advices</p>
    </>
}

export {Advice_com};