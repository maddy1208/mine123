import { useEffect, useState } from 'react';
import '../css/quiz.css'
import ques_data from '../../assets/ques.json'
console.log(ques_data)



function Quiz(){
    const [quesno,setquesno]=useState(0)
const [score,setscore]=useState(0)
    const [showscore,setshowscore]=useState(false)
const [timer,settimer]=useState(10)


useEffect(
    
    function(){
  if(timer==5){
        console.log("oi")
    }


 let mytime=setInterval(function(){

  

    settimer((tim)=>tim-1)
 },1000)

 return ()=>clearInterval(mytime)

},[quesno])

useEffect(function(){
if (timer<=0){
 setquesno((ques)=>{
    if(ques<2){
        return ques+1

    }
    else{
       setshowscore(true)
    }})
    
   
    settimer(10)
    
}

},[timer])

function handleanswer(ans){
    if(quesno < ques_data.length && !showscore){ //0 1 2
        console.log("before",ans,ques_data[quesno].correct)
if(ans==ques_data[quesno].correct){
    console.log(ans,ques_data[quesno].correct)
    setscore((score)=>score+1)

   
}

 setquesno((ques)=>{
    if(ques<2){
        settimer(10)
        return ques+1

    }
    else{
       setshowscore(true)
    }
    
    }) 


    }

    else{
        setshowscore(true)
    }

}

function restart(){
    setquesno(0)
setshowscore(false)
setscore(0)
settimer(10)
}
    return <>
    

    <div className="ques_div">
        {showscore?
            <div className="score">
<h3>Your Score: {score}/3</h3>
<button onClick={restart}>Restart</button>

        </div> :   <>

          <h3>Question {quesno+1}/3</h3>
        <div className="ques">{ques_data[quesno].question}</div>
        <div className="options">

            {ques_data[quesno].options.map((data,index)=>
             <button onClick={(obj)=>handleanswer(data)}>{data}</button>
            )}
           
        </div>
        <div className="timer">Timer: <span>{timer}s</span></div></>
    }

      
    </div>
    
    
    </>
}

export default Quiz;

