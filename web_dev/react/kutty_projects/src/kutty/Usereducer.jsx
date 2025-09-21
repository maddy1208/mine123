import { useState ,useReducer} from 'react'
import '../css/usered.css'

const Usereducer = () => {
     const initialstate=[]
    const [task,settask]=useState("")
      const [tasks,dispatch]=useReducer(reducer,initialstate) 
      
      


   function reducer(state,action){

if(action.type=="add_task"){ 
    return [...state,{"id":Math.floor(Math.random()*10000),"task":action.value}]}

if(action.type=="delete_task")
    { return state.filter((data,ind)=>data.id!=action.value)}

if(action.type=="update_task"){
 const newval=prompt("Enter the New Entry",action.value.task);

console.log(newval)

return state.map((data,ind)=> {
 if(data.id==action.value.id){ return {"id":data.id,"task":newval}} else return data})}


   }  
   


      
function handleadd(obj){ dispatch({"type":"add_task","value":obj}) }

function handledelete(id){ dispatch({"type":"delete_task","value":id})}

function handleupdate(obj){ dispatch({"type":"update_task","value":obj})} 


return (<div>  
     <div class="task-container">
        <div class="in"> 
             <input type="text" onChange={(obj)=>settask(obj.target.value)} onKeyDown={(obj)=>{
                  
                if(obj.key=="Enter"){
                    handleadd(obj.target.value)
                   
                }
             }}/>
             <button onClick={()=>handleadd(task)}>Add</button>
             </div><h3>Your Tasks : {tasks.length}</h3> <ul>
 {tasks.map((task1,ind)=>   
 <li key={task1.id}><p>{task1.task}</p> <button onClick={(obj)=>handleupdate(task1)}>Update</button> <button  onClick={(obj)=>handledelete(task1.id)}>Delete</button></li> )}

  </ul></div></div>   );  }

export default Usereducer;
