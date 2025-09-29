import { createBrowserRouter, createRoutesFromElements, NavLink, Outlet ,Route,Router, RouterProvider, useLoaderData, useNavigate, useParams, useRouteError} from 'react-router-dom'
import  { getspecusers,getusers } from './deps'
import '../css/route.css'



export default  function  RRouter  () {
    


    

    const router=createBrowserRouter (
       createRoutesFromElements(

        <Route path="/" element={<Root_home/>}>
            <Route index element={<In/>}></Route>
            <Route path="services" element={<Services/>}></Route>
            <Route path="about" element={<About/>}></Route>
            <Route path='contact' element={<Contact_root/>}>
              <Route path='info' element={<Contact_info/>}></Route>
              <Route path='form' element={<Contact_form/>}></Route>
            </Route>
            <Route path='users' element={<Index_user/>} errorElement={<F_404/>}>
            <Route index element={<Users/>}  loader={getusers}></Route>
            <Route path=':id' element={<Spec_user/> } loader={getspecusers}></Route>
           
            </Route>
            <Route path='*' element={<F_404/>}></Route>
        </Route>
       )
    )

    function Index_user(){
        return <>
        
        <Outlet/>
        </>
    }
    function In(){
        return <>Maddy's</>
    }
    function Spec_user(){
        const err=useRouteError()
        console.log("error",err)
        const {id}=useParams()
        const dat=useLoaderData()

      

        return <><h2>Specific User</h2>
        { err?`${err.message}`:
            <ul>
                <li>{dat.firstName}</li>
                <li>{dat.lastName}</li>
                <li>{dat.age}</li>
                <li>{dat.gender}</li>
                <li>{dat.email}</li>
                <li>{dat.phone}</li>
                <li>{dat.username}</li>
                <li>{dat.address.address}</li>
            </ul>
        }
        </>
    }
    function Users(){
         const err=useRouteError()
         console.log("user error",err)
        const navi=useNavigate()
        const users_data=useLoaderData()
      
        return <><p>users</p>

        {err?``:users_data.users.map((data,ind)=>
        <ul style={{cursor:"pointer"}}
        onClick={()=>navi(`/users/${data.id}`)}>
            <li>{data.firstName}</li>
            <li>{data.lastName}</li>
            <li>{data.age}</li>
        </ul>

        
        )}

        </>
    }

function Root_home(){
    return <><Main/>
    <Outlet/>
    </>
}

function Main(){
    return <>    <div className='container'>
<div className="nav">
    <div className="logo">Maddy's hub</div>
    <ul>
        <NavLink to={"/"} ><li>Home</li></NavLink>
       <NavLink to={"/services"}> <li>Services</li></NavLink>
         <NavLink to={"/contact"}> <li>Contact</li></NavLink>
       
         <NavLink to={"/about"}> <li>About</li></NavLink>
         <NavLink to={"/users"}> <li>Users</li></NavLink>
    </ul>
    <div className="content">
        
    </div>
</div>



    </div></>
}
function Contact_root(){
    return<>
    <p>Contact page</p>
    <Outlet/>
    </>

}

function Contact_info(){
    return <>Some Info</>
}
function Contact_form(){
    return <>Some contact form</>
}

function About(){
    return <>About</>
}
function Services(){
    return <>Services</>
}

function F_404({error}){
     
    console.log("error:",error)
    return <>Page Not found
    <h3>{error.message}</h3>
    </>
}

  return (
    <RouterProvider router={router}/>

  )
}
