import { useState } from 'react';
import '../css/bmi.css'
const BMI_app = () => {
const [bmi,setbmi]=useState()
const [bmistatus,setbmistatus]=useState()
const [height,setheight]=useState()
const [weight,setweight]=useState()
const [err,seterr]=useState(false)
function getbmi(){
  if(height && weight){
      seterr(false)


    var bmi1=weight/((height/100)*2)
    setbmi(bmi1.toFixed(2))

    // if(bmi1 <18.5){
    //     setbmistatus("UnderWeight")
    // }
    // else if(bmi1>=18.5 && bmi1<24.9){
    //    setbmistatus("Healthy")
    // }

    //  else if (bmi1>=25 && bmi1<29.9 ){
    //   setbmistatus("OverWeight")
    //  }

    //  else{
    //      setbmistatus("Obesity")
    //  }
    switch(true){
      case (bmi1<18.5):
        setbmistatus("UnderWeight")
        break;
      case (bmi1>=18.5 && bmi1<24.9):
        setbmistatus("Healthy")
        break;
      case (bmi1>=25 && bmi1<29.9):
        setbmistatus("OverWeight")
        break;
      case (bmi1>=30):
        setbmistatus("Obesity")
        break;      
    }
  
  }
  else{
    seterr(true)
    setbmi()

  }
}
  return (
    <>

<div className="container">

    <div className="image">
      
    </div>
    <div className="contents">

        <h2>BMI claculator</h2>
       {err && <p className='error'>Please Enter correct details</p>} 
        <label htmlFor="">Height (cm)</label>
        <input value={height} type="text" onChange={(obj)=>{setheight(obj.target.value)}}/>
        <label htmlFor="">Weight (kgs)</label>
        <input  value={weight} type="text" onChange={(obj)=>{setweight(obj.target.value)}}/>
        <button onClick={getbmi}>Calculate BMI</button>
       {bmi &&  <div className="result">
            <p>Your BMI is {bmi}</p>
            <p>Status: {bmistatus}</p>
        </div>} 
    </div>
</div>

    </>
  );
}

export default BMI_app;
