import { useEffect, useState } from 'react'
import './todo.css'
export const To_do_list = () => {
const [task,settask]=useState("sam")
const [tasks,settasks]=useState(
    localStorage.getItem("todo")?JSON.parse(localStorage.getItem("todo")):[])

 
const [setlocal,getlocal]=useState([])

useEffect(function(){

    localStorage.setItem("todo", JSON.stringify(tasks))

},
[tasks])

 // todos=[]
function add(task1){
console.log(tasks,task1)
    settasks((prev)=>([...prev,{"id":Math.floor(Math.random()*1000),"taskname":task1,"iscomplete":false }]))

}
 
 return <>  
 
 <div className="container"> 
    <h3>To-do-list</h3>   
   <div className="input">
    <input value={task} onChange={(obj)=>settask(obj.target.value)}  type="text" placeholder='Add your task ..' name="" id="" />
    <button onClick={(obj)=>add(obj.target.parentElement.querySelector('input').value)}>Add Task</button>    </div>   <div className="tasks">   
         <h3>List of tasks</h3>
         {tasks.map((data,ind)=>
         
         < Taskitem data={data} set={settasks}/>)}   </div> 
          </div>  </>}



function Taskitem(props){

    function checkstatus(data1){
        

        props.set((prev)=> 
          
     (  
        

        prev.map((data,ind)=>
                    
                    {  
                        if(data.id===data1.id){
                           
                return {...data,"iscomplete":!(data["iscomplete"])}}

          else return data}
        
        )
 
                
    )
            
        )

    }

    function remove(data1){
        props.set((prev)=>
        
( prev.filter((data,ind)=> data.id!=data1.id))

        )

    }

    return<>
            <div className="task" onClick={(obj)=>checkstatus(props.data)}>
        <p className={props.data.iscomplete?'strike':''}>{props.data.taskname}</p>
        <img src="https://img.icons8.com/?size=100&id=71200&format=png&color=000000" alt="" onClick={(obj)=>remove(props.data)}/>
    </div>
    </>

}
