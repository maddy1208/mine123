import './cart.css'
import  {BrowserRouter,Link, Route, Routes } from 'react-router-dom'

function Cart(){


return<>
<div className="whole">
    <BrowserRouter>

<Header/>

<Routes>
    <Route path="/" element={<Home/>}></Route>
    <Route path="/cart" element={<Mycart/>}></Route>
</Routes>

     </BrowserRouter>
    </div></>

}


function Mycart(){
    return<>
   <div className="mycart">
<h2>Cart Products</h2>

<div className="items">
    <div className="item">
        <img src="https://img.icons8.com/?size=100&id=rUbFdhNBSfDi&format=png&color=000000" alt="" />
     <h3>Product Name</h3>
     <p>price: Rs.76</p>
    </div>
        <div className="item">
        <img src="https://img.icons8.com/?size=100&id=rUbFdhNBSfDi&format=png&color=000000" alt="img" />
     <h3>Product Name</h3>
     <p>price: Rs.76</p>
    </div>
        <div className="item">
        <img src="https://img.icons8.com/?size=100&id=rUbFdhNBSfDi&format=png&color=000000" alt="img" />
     <h3>Product Name</h3>
     <p>price: Rs.76</p>
    </div>

    <p style={{textAlign:"left",fontWeight:"800"}}>Total Amount: 70rs</p>
</div>

   </div>
    </>
}


function Home(){
      const products=[
  {"id":1,"name":"Alfredo Pasta","amt":"185","shop":"Sam Food","ftype":"Veg","pic":"https://images.unsplash.com/photo-1604908177522-040d5ad0a0ec","latest":"yes"},
  {"id":2,"name":"Chicken Biryani","amt":"250","shop":"Spice Hub","ftype":"Non-Veg","pic":"https://images.unsplash.com/photo-1627308595183-4d7a4c2af6b0","latest":"yes"},
  {"id":3,"name":"Paneer Butter Masala","amt":"210","shop":"Veggie Delight","ftype":"Veg","pic":"https://images.unsplash.com/photo-1631515243202-f6f6c989a4b6","latest":"yes"},
  {"id":4,"name":"Cheeseburger","amt":"160","shop":"Burger Corner","ftype":"Non-Veg","pic":"https://images.unsplash.com/photo-1550547660-d9450f859349","latest":"yes"},
  {"id":5,"name":"Margherita Pizza","amt":"199","shop":"Italiano","ftype":"Veg","pic":"https://images.unsplash.com/photo-1601924928420-8ba1aeb21a4a","latest":"yes"},
  {"id":6,"name":"Grilled Sandwich","amt":"120","shop":"Cafe Bliss","ftype":"Veg","pic":"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38","latest":"yes"},
  {"id":7,"name":"Tandoori Chicken","amt":"280","shop":"BBQ Nation","ftype":"Non-Veg","pic":"https://images.unsplash.com/photo-1604908554024-fc43c6b0e3f6","latest":"yes"},
  {"id":8,"name":"Veg Fried Rice","amt":"140","shop":"China Bowl","ftype":"Veg","pic":"https://images.unsplash.com/photo-1604909053164-6d33f2a64a79","latest":"yes"},
  {"id":9,"name":"Fish Curry","amt":"300","shop":"Coastal Treat","ftype":"Non-Veg","pic":"https://images.unsplash.com/photo-1601924994987-89c0baddad6a","latest":"yes"},
  {"id":10,"name":"Dosa","amt":"90","shop":"South Tiffins","ftype":"Veg","pic":"https://images.unsplash.com/photo-1603895528651-972afbbd4ab9","latest":"yes"},
  {"id":11,"name":"Shawarma Roll","amt":"150","shop":"Middle East Bites","ftype":"Non-Veg","pic":"https://images.unsplash.com/photo-1604908554923-b1b64b69291a","latest":"yes"}
]
    return <>
     <div className="cart-container">
    {products.map((pr,ind)=>
    <CartElement data={pr}/>)}
    
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
    console.log(props.data)
return <>
<div className="cart-element">
    <img src="https://img.icons8.com/?size=100&id=rUbFdhNBSfDi&format=png&color=000000" alt="" />
    <p>{props.data.name}</p>
    <p>&#8377;
{props.data.amt}</p>
    <button>Add to Cart</button>

    </div>
</>
}

 


export default Cart;