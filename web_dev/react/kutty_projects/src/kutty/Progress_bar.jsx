import { useEffect, useState } from 'react';
import '../css/prog.css'
const Progress_bar = () => {

    const [prog,setprog]=useState(0)
    const [show,setshow]=useState(false)

    useEffect(function(){

let myint=setInterval(() => {
    setprog((prev)=>
    {
      
        if(prev>=100){
             clearInterval(myint)
            setprog(0)
           setshow(false)
          
        }
        else{
            return prev+20; 
        }

    }
)


}, 1000);

    },[show])



  return (
   <div className="container">
{show &&  <div className="bar"
    style={{transform:`translateX(-${100-prog}%)`}}

    
    ></div>}
   
    <button onClick={(obj)=>{
setshow((prev)=>!prev)

    }}>{show?"Stop":"Check"}</button>
   </div>
  );
}

export default Progress_bar;
