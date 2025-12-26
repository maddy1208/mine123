import React from 'react';
import './assets/app.css'
import axios from 'axios'
import { useState } from 'react';
import { useEffect } from 'react';



const App = () => {
    const [data,setdata]=useState([])
    const [search,setsearch]=useState("")
    const [filtered,setfiltered]=useState([])

    useEffect(()=> {get_data()},[])
    useEffect(()=>{filter()},[search,data])


async function get_data(){

await axios.get("http://localhost:9000/user/data").then(res=>setdata(res.data.data))
filter()

}

function search_fun(obj){
 if(obj.key=="Enter"){
  console.log("executed")
  setsearch(obj.target.value)
 }
   
}

function filter(){

  const filtered=data.filter((dat,ind)=>
  dat.name.includes(search) || dat.address.includes(search)||dat._id.includes(search)||dat.email.includes(search)||dat.occupation.includes(search))
 setfiltered(filtered)
}

async function   delete_entry(id){
  const del=await axios.delete(`http://localhost:9000/user/data/${id}`)
  if(del.status==200){
    alert("delete success")
    get_data() }
}

async function edit_entry(id,d_needs){
  const name=prompt("Enter name")
  const email=prompt("Enter email")

  

  const edit=await axios.patch(`http://localhost:9000/user/data/${id}`,{name,email})

  get_data()
}

async function add_ebtry(){
  const name=prompt("Enter name")
    const email=prompt("Enter email")
      const address=prompt("Enter location")
        const occupation=prompt("Enter occupation")
          const phone_number=prompt("Enter mobile")
        
        const add=  await axios.post(`http://localhost:9000/user/data`,{name,email,address,occupation,phone_number})
        get_data()

}
  return (
    <div className="container">

        <h1>SIMPLE CRUD</h1>
       <div className='search'> <input onChange={(obj)=>setsearch(obj.target.value)} onKeyDown={search_fun} type="text" placeholder='Search here'/>
        <button>Search</button>
           <button onClick={add_ebtry}>Add</button>
           </div>
        <table>

<thead>
            <tr>
                <th>S.No</th>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>OCCUPATION</th>
            <th>ADDRESS</th>
            <th>EDIT</th>
            <th>DELETE</th></tr>
   </thead>

   <tbody>

    { data.length<=0?<tr><td>"Nothing"</td></tr>:filtered.map((dat,index)=>{ 
      return    <tr>
                <td>{index+1}</td>
            <td>{dat._id}</td>
            <td>{dat.name}</td>
            <td>{dat.email}</td>
            <td>{dat.occupation}</td>
            <td>{dat.address}</td>
            <td><button onClick={()=>edit_entry(dat._id,dat)}>Edit</button></td><td><button onClick={()=>delete_entry(dat._id)}>Delete</button></td></tr>

    })}
   </tbody>
        </table>

 

    </div>
  );
}

export default App;
