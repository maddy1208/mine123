import { useState } from 'react'
import '../css/filt.css'
import data from '../../assets/data.json'



export const Filt_tab = () => {
    const [search,setsearch]=useState("")
  
  return <>
  <div className="container">
    <h2>Filter Table Data</h2>
    <input value={search} type="text " placeholder='Search Text' onChange={(obj)=>setsearch(obj.target.value)}/>
    <table>
<thead>
    <tr>
        <th>S.No</th>
    <th>Fname</th>
    <th>Lname</th>
    <th>Email</th>
    <th>phone</th></tr>
</thead>

<tbody>

{data.filter((dat,ind)=>
search==""?dat:
 dat.first_name.toLowerCase().includes( search.toLowerCase())||
    dat.last_name.toLowerCase().includes(search.toLowerCase())||
  dat.email.toLowerCase().includes( search.toLowerCase())||
    dat.ip_address.toLowerCase().includes(search.toLowerCase())
    ).map((dta,ind)=> <tr key={dta.id}>
    <td>{ind+1}</td>
    <td>{dta.first_name}</td>
    <td>{dta.last_name}</td>
    <td>{dta.email}</td>
    <td>{dta.ip_address}</td>
</tr> )}

</tbody>

    </table>
  </div>
  
  
  </>
}

