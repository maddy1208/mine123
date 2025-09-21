import {BrowserRouter,Routes,Route,Link,NavLink} from 'react-router-dom'
import '../css/route.css'
const Simple_router = () => {
  return <>
  <BrowserRouter>
  <Nav/>
  
  
  <Routes>
    <Route path='/home' element={<Home/>}></Route>
    <Route path='/services' element={<Services/>}></Route>
    <Route path='/contact' element={<Contact/>}></Route>
    <Route path='/about' element={<About/>}></Route>



  </Routes>
  </BrowserRouter>

  </>
}

function Nav(){
    return <>
    <div className="nav">
    <div className="logo">Maddy's hub</div>
    <ul>
        <NavLink to="/home" ><li>Home</li></NavLink>
       <Link to={"/services"}> <li>Services</li></Link>
       <Link to={"/contact"}> <li>Contact</li></Link>
        <Link to={"\about"}><li>About</li></Link>

    </ul>

    <button>log in</button>
    </div>
    
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

function Contact(){
    return <>Contact</>
}



export default Simple_router;
