import { useEffect, useState } from 'react';
import '../css/digitalclock.css'
const DIgital_clock = () => {
    const [time,settime]=useState(new Date())

useEffect(() => {
  const timer = setInterval(() => {
    settime(new Date());
  }, 1000);

  return () => clearInterval(timer); // Cleanup function
}, []);


function addzero(number){
    return number<10?`0`+number:number;


}

function convert_railway(number){
    return number>12?number-12:number

}

function general(time){
    return time.toLocaleDateString(undefined,{month:"long",year:"numeric",weekday:"long",day:"numeric"})

}
  return (


    <div className='container'>

        <h3>Digital CLock</h3>
        <div className="clock">{addzero(convert_railway(time.getHours()))}:{addzero(time.getMinutes())}:{addzero(time.getSeconds())}</div>
        <div className="general">{general(time)}</div>
      
    </div>
  );
}

export default DIgital_clock;
