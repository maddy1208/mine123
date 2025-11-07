// // express=require('express')
// // const path=require('path')
// // const app=express()

// // app.get("/",(req,res,next)=>{
// // res.sendFile(path.join(__dirname,'package.json'));next()},
// // (req1,res1,next1)=>{
// //     console.log("function1 exec");next1()
// // },(req1,res1)=>{
// //     console.log("function2 exec")
// // },
// // ).listen('5000')

// // server.js
// import express from "express";
// import fs from "fs";
// import path from "path";

// const app = express();
// const PORT = process.env.PORT || 3000;
// const INFO_FILE = path.join(process.cwd(), "info"); // file named "info" in project root

// app.use(express.static("public")); // serves index.html from ./public

// // Endpoint that the page calls; server will fetch https://myspi and append result to file
// app.get("/", async (req, res) => {
//   try {
//     // Use global fetch (Node 18+) or fallback to node-fetch if needed
//     const response = await fetch("https://api.woox.io/usercenter/account/v2/ip_info", {
//       // you can add headers here if required, e.g. { "User-Agent": "MyAgent" }
//       // mode and credentials don't apply to server-side fetch
//     });

//     const text = await response.text();

//     // Try to parse JSON, but keep raw text if parsing fails
//     let parsed;
//     try {
//       parsed = JSON.parse(text);
//     } catch (e) {
//       parsed = { parseError: true, raw: text };
//     }

//     // Prepare log entry: include timestamp and the fetched content
//     const logEntry = {
//       loggedAt: new Date().toISOString(),
//       status: response.status,
//       body: parsed
//     };

//     // Append to file as a single line (JSON) plus newline so every visit is preserved
//     fs.appendFile(INFO_FILE, JSON.stringify(logEntry) + "\n", (err) => {
//       if (err) {
//         console.error("Failed to append to info file:", err);
//       }

//       // We respond to the client anyway
//       res.setHeader("Content-Type", "application/json");
//       res.status(200).sendFile(path.join("/home/maddy/techiee/web_dev/node/Express/sam.html"))
//     });


//   } catch (err) {
//     console.error("Error fetching https://myspi:", err);
//     res.status(500).json({ ok: false, error: String(err) });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });


import express, { json } from 'express'
const app=express()


let users_data=[
  {"id":1,"name":"sam"},
  {"id":3,"name":"sam1"},
  {"id":3,"name":"sam2"},
  {"id":4,"name":"sam3"},
]
app.get("/",
  (req,res)=>{
    res.contentType('text/html')
    res.status(200).send("<h1>HOme</h1>")
   
   
  }
)

app.get('/users',(req,res)=>{

  
  res.send((users_data))
})

app.get('/users/:id',(req,res)=>{
  const _id=Number(req.params.id)

  if(false){}
  else{

    if( isNaN(_id) |_id==null | _id<=0 |_id >users_data.length){
      res.status(400).send("Invalid data")
    }
    else{
res.status(200).send(users_data.find((obj)=>obj.id==_id))}

  }
})



app.get("/123",
  (req,res,next)=>{
    res.contentType('text/html')
    res.status(200).send("<h1>123</h1>")
   
   
  }
)




app.use(express.json())

app.post("/users",(req,res)=>{

  const newuesr={"id":users_data.length===0?1:users_data[(users_data.length)-1].id+1,...req.body}
  users_data.push(newuesr)
  res.status(201).send(users_data)


})


function getindex(req,res,next){
  const data=req.body
console.log(req.body)
const _id=req.params.id


    if( isNaN(_id) |_id==null | _id<=0 |_id >users_data.length){
      res.status(400).send("Invalid data")
    }
    else{
      
const obj_index=users_data.findIndex((obj)=>obj.id==_id)

if(obj_index==null ||  obj_index==-1){
  res.status(400).send("user not found")

}
else{  req.obj_index=obj_index;
  next();
}}
}


app.put("/users/:id",getindex,(req,res)=>{
  const obj_index=req.obj_index

users_data[obj_index]={"id":req.params.id,...req.body}
res.status(200).send([{"msg":"user updated"},{"uu":users_data[obj_index]}])
})



app.patch("/users/:id",getindex,(req,res)=>{
const obj_index=req.obj_index
users_data[obj_index]={...users_data[obj_index],...req.body}
res.status(200).send([{"msg":"user updated"},{"uu":users_data[obj_index]}])

})


app.delete("/users/:id",getindex,(req,res)=>{
const obj_index=req.obj_index
users_data=users_data.filter((obj,index)=>index!==obj_index)
res.status(200).send([{"msg":"delete updated"},{users_data}])
})


app.use((req,res)=>{
  res.contentType('text/json')
  res.status(404).send("Something have LOst!")
  res.end()
})

app.listen(3000,(err)=>{
  console.log("server running at 3000")
})




