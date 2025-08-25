import { useState } from 'react';
import '../css/faq.css'
const Faq = () => {
        const data=[{"id":1,"ques":"Who we are ?","ans":"We are techieees who made for that and we now teaches stuffs like developing applications,wesites and hacking related contents"},
{"id":2,"ques":"What we are currently doing other tgan content creation?","ans":"We are working on several projects and we also run our own security company, we also do services like IT services"},
{"id":3,"ques":"Whats our real motive ?","ans":"To make people to understand what really the technology means instaed of just showing"}

    ]
  return (
   <>
   <div className="container">
{data.map((datas)=>
<Faq_div key={datas.id} datas={datas}/>
)}
   </div>
   </>
  );
}

export default Faq;

function Faq_div({datas}){
const [show,setshow]=useState(false)


    return <>


    <div className="faq_div">
        <div className="ques" onClick={()=>setshow((prev)=>!prev)}>{datas.ques}</div>
        <div className={`ans ${show?"show":""}`}>{datas.ans}</div> </div> 



  

    </>
}