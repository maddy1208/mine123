import { useState } from 'react';
import '../css/color.css'
const Color_picker = () => {
    const [color,setcolor]=useState("black")
  return <>
  <div className="container">
<div className="show" style={{backgroundColor:color}}></div>
<div className="inp_cp">
    <input type="color"  onChange={(obj)=>setcolor(obj.target.value)} />
    <input type="text"  value={color} readOnly  className='in'/>
    <button onClick={(obj)=>{
navigator.clipboard.writeText(color)
obj.target.innerText="Copied!"
setTimeout(() => {
    obj.target.innerText="Copy"

}, 2000);


    }}>Copy</button>
</div>

  </div>
  
  </>
}

export default Color_picker;
