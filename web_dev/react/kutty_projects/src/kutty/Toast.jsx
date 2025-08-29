import '../css/toast.css'
import { useState } from 'react'
export const Toast = () => {
   const [toasts,settoasts]=useState([])
   function handletoast(obj){

      const newItem = {
    id: Math.floor(Math.random() * 1000),
    msg: obj.target.innerText,
    bg: obj.target.className,
  };

    settoasts((prev)=>
   ( [...prev,newItem])
    )

    setTimeout(() => {

      settoasts((prev)=>(prev.filter((data,ind)=>data!=newItem)))
      
    }, 3000);

  
   }
function cleartoast(id){



  settoasts((prev)=>
  
  (prev.filter((data,ind)=> (data.id!==id)))
  
  )

}

  return (
   <>
   
<div className="toast-container">
   {toasts.map((data,ind)=>
    <div className={`toast ${data.bg}`}>
    <span>{data.msg}</span>

    <div className="times" onClick={(obj)=>cleartoast(data.id)}>
   &times;
    </div>
 
   </div>
  
  )}
  
</div>


 

   <div className="buttons">
    <button className='pos' onClick={handletoast}>Positive</button>
    <button className='neg'  onClick={handletoast} >Negative</button>
    <button className='med'  onClick={handletoast}>Med</button>
    <button className='info'  onClick={handletoast}>Info</button>
   </div>
   
   </>
  )
}