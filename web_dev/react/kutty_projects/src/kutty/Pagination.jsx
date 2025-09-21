import '../css/page.css'
import pages from '../../assets/paras.json'
import { useEffect, useState } from 'react'
const Pagination = () => {
    const [currentpage,setcurrentpage]=useState(9)
    const [entries,setentries]=useState(10)
    const [display_data,setdisplay_data]=useState([])

useEffect(function(){

    const firstindex=(currentpage*10)-10
    const lastindex=(currentpage*10)
    console.log(firstindex,lastindex)

   setdisplay_data(pages.slice(firstindex,lastindex))

},[currentpage])

function handle(obj){
   

    setcurrentpage(Number(obj.target.innerText))
}

  return <>
  
  <div className="conatiner">
    <h3>Simple pagination</h3>
    <ul>
    {display_data?display_data.map((page,ind)=>
    <li key={page.id}>{page.paragraph}</li>
    
    
    
    ):""}
</ul>

<div className="buttons">

    <button onClick={(obj)=>setcurrentpage(1)}>First</button>
    <button disabled={(currentpage<=1)} onClick={(obj)=>{
        if(currentpage<=10){
            setcurrentpage((prev)=>prev-1)

        } 



    }}>Prev</button>
 {[...new Array(10)].map((_,index)=>
 <button  className={(index+1)==currentpage? 'active':''} key={index+10}
 onClick={handle}>{index+1}</button>
 )
 }
    <button disabled={(currentpage>=10)} onClick={(obj)=>{
        
            setcurrentpage((prev)=>prev+1)

         



    }}>Next</button>
        <button onClick={(obj)=>setcurrentpage(10)}>Last</button>


</div>


  </div>
  </>
}

export default Pagination;
