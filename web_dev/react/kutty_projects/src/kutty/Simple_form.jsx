import React, { useState } from 'react';
import '../css/simple_form.css'
const Simple_form = () => {

function change_handler(obj){
    setuser((user)=>
   ( {...user, [obj.target.name]:obj.target.type=="checkbox"?obj.target.checked:obj.target.value})
    
    )


}

    const [user,setuser]=useState({
username:"sam",
userage:12,
usergender:"male",
usermarried:true,
usercountry:"India",
userabout:"Write Something here"

    })
  return (
  <>
  <div className="table">
    <table>
        <tr>
            <td>User Name</td>
            <td>{user.username}</td>
        </tr>
        <tr>
            <td>User Age</td>
            <td>{user.userage}</td>
        </tr>
        <tr>
            <td>User Gender</td>
            <td>{user.usergender}</td>
        </tr>
        <tr>
            <td>Marriage Status</td>
            <td>{user.usermarried?"Yes Married":"Unmarried"}</td>
        </tr>
        <tr>
            <td>User Country</td>
            <td>{user.usercountry}</td>
        </tr>
        <tr>
            <td>User About</td>
            <td>{user.userabout}</td>
      </tr>
    </table>

  </div>

  <div className="form">

    <input type="text" onChange={ change_handler} placeholder='Enter Name' value={user.username}  name="username"/>
    <input type="number" onChange={ change_handler} placeholder='Enter Age'  value={user.userage} name="userage"/>
    <div className="gender">
<input  onChange={ change_handler} type="radio"  id="male_id" checked={user.usergender=="male"?true:false} name="usergender" value="male"/>
<label htmlFor="male_id">Male</label>
<input onChange={ change_handler}  type="radio"  id="female_id" checked={user.usergender=="female"?true:false} name="usergender" value="female"/>
<label htmlFor="female_id">Female</label> </div>
<div className="mrg">
    <input  onChange={ change_handler} type="checkbox" name="usermarried" id="marriage_id" checked={user.usermarried} />
<label htmlFor="marriage_id">Is Married</label>
</div>


<select  onChange={ change_handler} name="usercountry" id="con" value={user.usercountry}>
    <option value="China">China</option>
    <option value="India">India</option>
    <option value="USA">USA</option>
</select>

<textarea  onChange={ change_handler} name="userabout" id="about_id" value={user.userabout}>Enter Somethig</textarea>
    </div>
  

  </>



  );
}

export default Simple_form;
