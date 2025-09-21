import { createContext, useContext, useRef, useState } from 'react'
import './cart.css'
import  {BrowserRouter,Link, Route, Routes } from 'react-router-dom'

const cartcontext=createContext()

function Cart(){
        const [cartitems,setcartitems]=useState([])



return<>
<div className="whole">
       <cartcontext.Provider value={{cartitems:cartitems,setcartitems:setcartitems}}>
  
    <BrowserRouter>

<Header/>

<Routes>
    <Route path="/" element={<Home cartitems={cartitems} setcartitems={setcartitems}/>}></Route>
    <Route path="/cart" element={<Mycart cartitems={cartitems}/>}></Route>
</Routes>

     </BrowserRouter>
       </cartcontext.Provider>
    </div></>

}


function Mycart(){

    const {cartitems,setcartitems}=useContext(cartcontext)
    
   let total=cartitems.reduce((acc,curr)=>acc+Number(curr.amt),0)

function remove(data){

    setcartitems((prev)=>(
    
        prev.filter((prev,ind)=>prev.id!=data.id)
    )
    )
}

    return<>



   <div className="mycart">
<h2>Cart Products</h2>

<div className="items">


    {cartitems?cartitems.map((data,ind)=>
     <div className="item" key={ind}>
        <img src="https://img.icons8.com/?size=100&id=rUbFdhNBSfDi&format=png&color=000000"  alt="" />
     <h3>{data.name}</h3>
     <p>price: Rs.{data.amt}</p>
     <button onClick={()=>remove(data)}>Remove</button>
    </div>
    ):""}
   
    <p style={{textAlign:"left",fontWeight:"800"}}>Total Amount: {total}rs</p>
</div>

   </div>
    </>
}


function Home(){
    const cc=useContext(cartcontext)
console.log(cc.cartitems)


const products = [
  {
    "id": 1,
    "name": "Creamy Alfredo Pasta",
    "amt": "185",
    "shop": "Sam Food",
    "ftype": "Veg",
    "pic": "https://images.unsplash.com/photo-1604908177522-040d5ad0a0ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "latest": "yes"
  },
  {
    "id": 2,
    "name": "Chicken Biryani",
    "amt": "250",
    "shop": "Spice Hub",
    "ftype": "Non-Veg",
    "pic": "https://images.unsplash.com/photo-1627308595183-4d7a4c2af6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "latest": "yes"
  },
  {
    "id": 3,
    "name": "Paneer Butter Masala",
    "amt": "210",
    "shop": "Veggie Delight",
    "ftype": "Veg",
    "pic": "https://images.unsplash.com/photo-1631515243202-f6f6c989a4b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "latest": "yes"
  },
  {
    "id": 4,
    "name": "Cheeseburger",
    "amt": "160",
    "shop": "Burger Corner",
    "ftype": "Non-Veg",
    "pic": "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "latest": "yes"
  },
  {
    "id": 5,
    "name": "Margherita Pizza",
    "amt": "199",
    "shop": "Italiano",
    "ftype": "Veg",
    "pic": "https://images.unsplash.com/photo-1601924928420-8ba1aeb21a4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "latest": "yes"
  },
  {
    "id": 6,
    "name": "Grilled Sandwich",
    "amt": "120",
    "shop": "Cafe Bliss",
    "ftype": "Veg",
    "pic": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "latest": "yes"
  },
  {
    "id": 7,
    "name": "Tandoori Chicken",
    "amt": "280",
    "shop": "BBQ Nation",
    "ftype": "Non-Veg",
    "pic": "https://images.unsplash.com/photo-1604908554024-fc43c6b0e3f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "latest": "yes"
  },
  {
    "id": 8,
    "name": "Veg Fried Rice",
    "amt": "140",
    "shop": "China Bowl",
    "ftype": "Veg",
    "pic": "https://images.unsplash.com/photo-1604909053164-6d33f2a64a79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "latest": "yes"
  },
  {
    "id": 9,
    "name": "Fish Curry",
    "amt": "300",
    "shop": "Coastal Treat",
    "ftype": "Non-Veg",
    "pic": "https://images.unsplash.com/photo-1601924994987-89c0baddad6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "latest": "yes"
  },
  {
    "id": 10,
    "name": "Masala Dosa",
    "amt": "90",
    "shop": "South Tiffins",
    "ftype": "Veg",
    "pic": "https://images.unsplash.com/photo-1603895528651-972afbbd4ab9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "latest": "yes"
  },
  {
    "id": 11,
    "name": "Shawarma Roll",
    "amt": "150",
    "shop": "Middle East Bites",
    "ftype": "Non-Veg",
    "pic": "https://images.unsplash.com/photo-1604908554923-b1b64b69291a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    "latest": "yes"
  }
];
    return <>
     <div className="cart-container">
    {products.map((pr,ind)=>
    <CartElement data={pr} setcartitems={cc.setcartitems} cartitems={cc.cartitems}/>)}
    
    </div>
 
    </>
}



 function Header(){
  return <>


  <div className="header">
    <h3>Food Cart</h3>
<ul>
    <Link to="/"> <li>Home</li></Link>
   <Link to="/cart"><li>View-Cart</li></Link>
    </ul>
  </div>

  </>
}

function CartElement(props){


    function additem(obj){
        console.log(props.cartitems.includes(props.data))
        props.setcartitems((prev)=>([...prev,props.data]))
        console.log(props.cartitems)

    }
function remove(obj){
    props.setcartitems((prev)=>(
       prev.filter((prev)=>(prev.name!=props.data.name))


    ))

}
return <>
<div className="cart-element">
    <img src="https://img.icons8.com/?size=100&id=rUbFdhNBSfDi&format=png&color=000000" alt="" />
    <p>{props.data.name}</p>
    <p>&#8377;
{props.data.amt}</p>
{props.cartitems.some((ele)=>ele.name==props.data.name)?<button className='remove' onClick={remove}>Remove</button>:
<button onClick={additem}>Add to Cart</button>}
    

    </div>
</>
}

 


export default Cart;