
async function  getusers(){

    const users_data=await fetch("https://dummyjson.com/users").then((res)=>
        
        
        {  if(!res.ok){
            throw new Error("User details can't fetched");
            return ;
            
        } 
        
        else  return res.json()})

    return users_data;
    

}

async function  getspecusers({params}){
const id=parseInt(params.id)

    const users_data=await fetch("https://dummyjson.com/users/"+id.toString()).then((res)=>
        
            {  if(!res.ok){
            throw Error("User details can't fetched");
            return;
            
        } 
        
        else  return res.json()})
console.log(users_data)
    return users_data;
    

}


export  {getusers};
export {getspecusers};
