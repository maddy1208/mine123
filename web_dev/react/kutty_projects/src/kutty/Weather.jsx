import { useState } from 'react';
import '../css/weather.css'
const Weather = () => {
const [temp,settemp]=useState(0)
const [city,setcity]=useState("london")
const [country,setcountry]=useState("In")
const [latt,setlatt]=useState(0)
const [long,setlong]=useState(0)
const [wind,setwind]=useState(0)
const [humidity,sethumidity]=useState(0)
const [des,setdes]=useState("sunny")

  const images= {sunny:"https://img.icons8.com/?size=100&id=119011&format=png&color=000000",rainy:"https://img.icons8.com/?size=100&id=undefined&format=png&color=000000",}
  
 async  function search(){


 const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1c3b8372593c61e34f84c25771c21716&units=metric`
  console.log(url)
  console.log(city)

const res=await fetch(url).then((res)=>res.json())
console.log(res)

if(res.cod=="404"){
  alert("City Not found")
}

else{
console.log(res)
setlatt(res.coord.lat)
setlong(res.coord.lon)
setwind(res.wind.speed)
sethumidity(res.main.humidity)
setcountry(res.sys.country)
settemp(res.main.temp)
setdes(res.weather[0].main)
}



}




  
  
  return (

    <>
    <div className="container">
<div className="search">
  <input type="text" placeholder='Search City..' onChange={(obj)=>setcity(obj.target.value)} onKeyDown={(obj)=>{if(obj.key=="Enter"){search()}}}/>
  <img onClick={search} src="https://img.icons8.com/?size=100&id=kLey780kTsdG&format=png&color=000000" alt="" />
</div>



  <Weather_div images={images} temp={temp} des={des} city={city} country={country} latt={latt} long={long} humidity={humidity} wind={wind}/>
    </div>


    </>
 
  );
}




function Weather_div(props){

return <div className="whole">
<div className="weather_img">
  <img src={props.images.sunny} alt="weather_img" />
  
</div>

<div className="temp">{props.temp}&#176; Celsius ({props.des})</div>
<div className="city">{props.city}</div>
<div className="country">{props.country}</div>
<div className="l">
<div className="latt"><label htmlFor="lattitude">lattitude</label><span>{props.latt}</span></div>
<div className="long"><label htmlFor="longitude">longitude</label><span>{props.long}</span></div>

</div>

<div className="hw">
<div className="humidity">
  <img src="https://img.icons8.com/?size=100&id=18504&format=png&color=000000" alt="humididty_img" />
  <span>{props.humidity}%</span>
  <label htmlFor="">Humidity</label>
</div>

<div className="windspeed">
  <img src="https://img.icons8.com/?size=100&id=64216&format=png&color=000000" alt="windspeed_img" />
  <span>{props.wind} km/hr</span>
  <label htmlFor="">Wind Speed</label>
</div>
</div>


<div className="copyright">Designed by <span>Maddy</span></div>





</div>
}

export default Weather;
