import React, { useState } from 'react';
import '../css/qr.css'

//api.qrserver.com/v1/create-qr-code/?size=150x150&data=datanpm run dev
const QR_gen = () => {

   const [imgurl,setimgurl]=useState("https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?_gl=1*md2rfb*_ga*MTU4OTk1MzU1Mi4xNzUyNDE4OTk0*_ga_8JE65Q40S6*czE3NTQ3NTU5ODMkbzIkZzEkdDE3NTQ3NTU5OTgkajQ1JGwwJGgw")
  const [content,setcontent]=useState("sam")
  const [size,setsize]=useState("150")
  const [loading,setloading]=useState(false)
   async function gen(datas){
      if(content.length ===0 || size.length===0){
         alert("Enter right values")
         return;
      }
   setloading(true)

  await  fetch(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(content)}`).then((res)=>setimgurl(res["url"]))
   
   console.log("fetch completed")
   setloading(false)
   }

async function down(){
const  img= await fetch(imgurl).then((res)=>res.blob())
// const sam=new Blob(["oi"],{type:"text/plain"})
// console.log(sam)
// console.log(img)
const sam1=URL.createObjectURL(img)

 const a=document.createElement("a")
  a.href={imgurl}
 a.download="sam.png"
 a.click()



   }

  return (
   <>
   <div className="container">
    <h3>Qr generator</h3>

    {loading?<p>Please wait...</p>: <img src={imgurl} alt="QR" />}
   
   
   <label htmlFor="data">Enter the qr content</label>
   <input value={content} onChange={(obj)=>{setcontent(obj.target.value)}} type="text" name="" id="data"  placeholder="eg: sam"/>
   <label htmlFor="size">enter size</label>
   <input  value={size} onChange={(obj)=>{setsize(obj.target.value)}}  type="text" name="" id="size" placeholder='eg: 150'/>
<div className="buttons">

       <button className='generate' disabled={loading} onClick={gen}> Generate qr code</button>
   <button className='download' onClick={down}> download qr code</button>
</div>
   <footer>Designed by <a href="">maddy</a></footer>
   
   </div>
   
   </>
  );
}

export default QR_gen;
