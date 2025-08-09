import React from 'react';
import '../css/profile-card.css'
const Profile_card = () => {
  return (
    <div>
      <Card/>
   
    </div>
  );
}

export default Profile_card;

function Card(){
    return <>
<div className="card-container">
    <span className="online ">ONLINE</span>
    <img src="https://www.justbake.in/userfiles/chotta-bheem-laddo-photo-theme-cake.jpg" alt="profile" />
<h3 className='name'>Chotta Bheem</h3>
<h3 className='native'>Dholakpur</h3>
<div className="design">Protector</div>
<div className="buttons">
    <button>Message</button>
    <button className='follow'>Following</button>

</div>
    <h4>Skills</h4>
    <ul>
        <li> skilhfyyyyyyyyyyyyyyyl 1</li>
        <li> skill 2</li>
        <li>skill 3</li>
        <li>skill 4</li>
              <li> skill 1</li>
        <li> skill 2</li>
        <li>skill 3</li>
        <li>skill 4</li>
    </ul>
    
    </div>
    
    </>
}