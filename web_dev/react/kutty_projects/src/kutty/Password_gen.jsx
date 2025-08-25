import { useState } from 'react';
import '../css/pass.css'
const Password_gen = () => {

const [isuppercase,setisuppercase]=useState(false)
const [islowercase,setislowercase]=useState(false)
const [isnum,setisnum]=useState(false)
const [sym,issym]=useState(false)
const [len,setlen]=useState(5)
const [passs,setpasss]=useState("")
function generate(){
 var pass=""
  if (isuppercase) pass+="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (islowercase) pass+="ABCDEFGHIJKLMNOPQRSTUVWXYZ".toLocaleLowerCase();
  if (isnum) pass+="1234567890"
  if( sym) pass+= `~!@#$%^&*()_+`
var rand_passw=""
  for(var i=0;i<len;i++){
rand_passw+= pass[Math.floor(Math.random()*pass.length)]
  }
  console.log(pass)
  setpasss(rand_passw)

}

function copy(){
  navigator.clipboard.writeText(passs)
const btn=document.getElementsByTagName('button')[1]
if (passs){
btn.innerText="Copied!"
}
else{
  alert("Please generate password First!")
}

setTimeout(() => {
  btn.innerText="Copy"

}, 1000);

}

  return (
    <div className="container">
<h2>password generator</h2>

<div className="len">
<label id="lenn" htmlFor="len">Length</label>

<input type="text" id='len' onChange={(obj)=>setlen(parseInt(obj.target.value))}/></div>

<div className='up'><input type="checkbox" checked={isuppercase} name="" id="up" onChange={(obj)=>setisuppercase((val)=>!val)}/>
<label htmlFor="up">Include Uppercase</label></div>
<div className='low'><input type="checkbox" name="" id="low" checked={islowercase} onChange={(obj)=>setislowercase((val)=>!val)}/>
<label htmlFor="low">Include Lowercase</label></div>
<div className='num'>
<input type="checkbox" name="" id="num" checked={isnum} onChange={(obj)=>setisnum((val)=>!val)}/>
<label htmlFor="num">Include Numbers</label></div>
<div className='sym'>
<input type="checkbox" name="" id="sym" checked={sym}  onChange={(obj)=>issym((val)=>!val)}/>
<label htmlFor="sym">Include Symbols</label></div>



<button className='gen' onClick={generate}>Generate password</button>

<div className="copy">
    <input type="text " readOnly  value={passs}/>
    <button onClick={copy}>Copy</button>
</div>

    </div>
  );
}

export default Password_gen;
