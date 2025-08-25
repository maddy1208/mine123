import { useEffect, useState } from 'react';
import '../css/cal.css'
const Calender = () => {

    const [selecteddate,setselecteddate]=useState(new Date())
    const weekdays=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
    const [year,setyear]=useState(2025)
    const [month,setmonth]=useState(7)

function getdays(){
      var days_array=[]
    const firstday=new Date(selecteddate.getFullYear(),selecteddate.getMonth(),1)
        const lastday=new Date(selecteddate.getFullYear(),selecteddate.getMonth()+1,0)

        console.log(firstday,lastday)


for(let i=1;i<=firstday.getDay();i++){
    days_array.push(null)
}

for(let j=1;j<=lastday.getDate();j++){
    days_array.push(j)

}

return days_array


}
useEffect(function(){
    setselecteddate(new Date(Number(year),Number(month),0))
    console.log(new Date(Number(year),Number(month),0))

}


,[month,year])

useEffect(function(){
    getdays()
},[selecteddate])



function getyear(){
    var tmpyear=year
var years=[]
for (let i=5;i>0;i--){
    years.push(tmpyear-i)
    if( i==1){
        for( let j=0;j<=5;j++){
            years.push(parseInt(j+tmpyear))
        }
    }
}


return years

}


function set(){

}

  return (
   <div className="container">




    <div className="header">
        <div className="leftside" onClick={()=>setmonth((prev)=>prev-1)}>{"<"}</div>
        <div className="month" >
            <select name="" id=""  value={month} onChange={(obj)=>setmonth(obj.target.value)}>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                 <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                 <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
            </select>
         
        </div>
           <select className="year" name="" id="" value={year} onChange={(obj)=>setyear(Number(obj.target.value))}>

             {getyear().map((data,index)=><option key={data} value={data}>{data}</option>)} 
            </select>
         <div className="rightside"  onClick={()=>setmonth((prev)=>prev+1)}>{">"}</div>

    </div>
    <div className="week">
        <ul>
   
   {weekdays.map((data,ind)=><li>{data}</li>)}



        </ul>
    </div>
    <div className="days">

{getdays().map((data,ind)=><div className="day">{data?data:""}</div>)}

    </div>
   </div>
  );
}

export default Calender;
