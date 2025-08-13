import React from 'react';
import '../css/profile-card.css'



const Profile_card = () => {

  const users_data=[

    { "username":"Chotta Bheem", "user_online":"true","user_image":"https://www.justbake.in/userfiles/chotta-bheem-laddo-photo-theme-cake.jpg","user_native":"Dholakpur","user_design":"Protector","skills":["skill1","skill2","skill3","skill4"]},
        { "username":"Chotta Bheem", "user_online":"true","user_image":"https://www.justbake.in/userfiles/chotta-bheem-laddo-photo-theme-cake.jpg","user_native":"Dholakpur","user_design":"Protector","skills":["skill1","skill2","skill3","skill4"]},
    { "username":"Chotta Bheem", "user_online":"true","user_image":"https://www.justbake.in/userfiles/chotta-bheem-laddo-photo-theme-cake.jpg","user_native":"Dholakpur","user_design":"Protector","skills":["skill1","skill2","skill3","skill4"]},
    { "username":"Chotta Bheem", "user_online":"true","user_image":"https://www.justbake.in/userfiles/chotta-bheem-laddo-photo-theme-cake.jpg","user_native":"Dholakpur","user_design":"Protector","skills":["skill1","skill2","skill3","skill4"]},
    { "username":"Chotta Bheem", "user_online":"true","user_image":"https://www.justbake.in/userfiles/chotta-bheem-laddo-photo-theme-cake.jpg","user_native":"Dholakpur","user_design":"Protector","skills":["skill1","skill2","skill3","skill4"]},
  ]
  return (
    <div>

{users_data.map((data,index)=><Card key="index" data={data}/>)}
    </div>
  );
}


function Card(props){
    return <>
<div className="card-container">
    <span className="online ">{props.data.online?"ONLINE":"OFFLINE"}</span>
    <img src={props.data.user_image} alt="profile" />
<h3 className='name'>{props.data.username}</h3>
<h3 className='native'>{props.data.user_native}</h3>
<div className="design">{props.data.user_design}</div>
<div className="buttons">
    <button>Message</button>
    <button className='follow'>Following</button>

</div>
    <h4>Skills</h4>
    <ul>
       {props.data.skills.map((data,index)=> <li key={index}>{data}</li>)}
    </ul>
    
    </div>
    
    </>
}

export default Profile_card;
