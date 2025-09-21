const http1=require('http')
const fs1=require('fs')

try{
http1.createServer((req,res)=>{

   
    fs1.readFile('./index.html',(err,data)=>{

        if(err){
            res.writeHead(404)
            res.write("file not found")
           res.end()
        }
        else{
            res.writeHead(200,{'content-type':'text/html'})
            res.write(data)
            res.end()
        }
    })
   


}).listen(9000,()=>{

   
    console.log("server running,")
})}

catch (err){

    console.log(err)
}


