import '../css/route.css'

import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider,NavLink,Link, useNavigate, replace, useLoaderData } from 'react-router-dom';

const Modern_route = () => {
    const router =createBrowserRouter(
        createRoutesFromElements(

            <Route path='/' element={<Root/>}>
               <Route index element={<Home></Home>}></Route>
               <Route path='home' element={<Home></Home>}></Route>
               <Route path='services' element={<Services/>}></Route>

               <Route path='contact' element={<Contact/>}>
                  <Route index element={<Ind/>}></Route>
         
                   <Route path='info' element={<Contact_info/>}></Route>
                   <Route path='form' element={<Contact_form/>}></Route>
                                                 </Route>


         <Route path='about' element={<About/>}></Route>
         <Route path='login' element={<Login/>}></Route>
         <Route path='users' element={<Users/>} loader={loaduser}>
         
         
         </Route>
         <Route path="*" element={<F404/>} ></Route>
            </Route>
        )
    )
  return <>
  <RouterProvider router={router}></RouterProvider>
  </>
}

function loaduser(){

  const data=  fetch("https://dummyjson.com/users").then((res)=>res.json()).then((res)=>res)
  console.log("data",data)
  return data;
}

function Root(){
    return <>
    <Nav/>
    <Outlet/>
    
    </>
}

function Users(){
    const data=useLoaderData()
    console.log(data)

    return <>Users
    {data.users.map((data,ind)=>
    <ul>

        <li>{data.firstName}</li>
        <li>{data.lastName}</li>
        <li>{data.age}</li>
  



    </ul>
    
    )}


    
    
    
    </>
}

function Nav(){
    const navigate=useNavigate()
    return <>
    <div className="nav">
    <div className="logo">Maddy's hub</div>
    <ul>
        <NavLink to="/home" ><li>Home</li></NavLink>
       <Link to={"/services"}> <li>Services</li></Link>
       <Link to={"/contact"}> <li>Contact</li></Link>
          <Link to={"/users"}> <li>Users</li></Link>


      <li onClick={()=>navigate('/about')}>About</li>

    </ul>

    <button onClick={(obj)=>navigate('/login',{replace:true})}>log in</button>
    </div>
    
    </>
}

function F404(){
    const nav=useNavigate()
    return <>
    <p>Um...</p>
<p onClick={()=>nav("/")} style={{cursor:"pointer"}}>Return to Home Page</p>
    </>

}

function Home(){
    return <>Home</>
}

function About(){
    return <>About</>
}

function Services(){
    return <>Services</>
}

function Ind(){
    return <>CC</>
}
function Contact(){
    return <>
    <Contact_root/>
    <Outlet/>
    
    
    </>
}

function Contact_root(){
    return<>
    <NavLink to={"form"}>Contact</NavLink>
    <NavLink to={"info"}>Details</NavLink>
    
    </>
}


function Contact_info(){
    return <>
    <p>email: sam@maddy.com</p>
    <p>phone: 733940567</p>
    <p>soc media: link1</p>
    
    
    </>
}

function Contact_form(){
    return <>
    <label htmlFor="name">Name</label>
    <input id='name' type="text" />
    <label htmlFor="email">Name</label>
    <input id='email' type="email" />
    <label htmlFor="num">Name</label>
    <input id='num' type="number" />
    <button>Submit</button>

    
    </>
}

function Login(){
    return <>LOGIN PAGE</>
}

export default Modern_route;
