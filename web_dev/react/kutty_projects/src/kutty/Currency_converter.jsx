import '../css/currency.css'
import logo from '../assets/curr.jpg'
import { useEffect, useState } from 'react';
const Currency_converter = () => {
const [fromcurr,setfromcurr]=useState("INR")
const [tocurr,settocurr]=useState("USD")
const [convertedamount,setconvertedamount]=useState(0.8)
const [amount,setamount]=useState(1)
const [exchangerate,setexchangerate]=useState()

async function find_rate(){
   const res= await fetch(`https://api.exchangerate-api.com/v4/latest/${fromcurr}`).then((res)=>res.json())
  setexchangerate(res.rates[tocurr]);
  console.log(res.rates[tocurr])
 setconvertedamount(amount*exchangerate)

}

useEffect(function(){
 find_rate()
    

 

},[fromcurr,tocurr])

useEffect(function(){

     setconvertedamount(amount*exchangerate)
        
},[amount])

  return (
    <div className='container'>
        <h3>Currency Converter</h3>
        <img src={logo} alt="logo" />
        <label htmlFor="amount">Amount:</label>
        <input type="text" id='amount' value={amount} onChange={(obj)=>{
            
            setamount(obj.target.value)
            
        }
            
            }/>
      <label htmlFor="fromcurrency"></label>
   <select name="currency" id="fromcurrency" value={fromcurr} onChange={(obj)=>setfromcurr(obj.target.value)}>
  <option value="USD">US Dollar (USD)</option>
  <option value="EUR">Euro (EUR)</option>
  <option value="JPY">Japanese Yen (JPY)</option>
  <option value="GBP">British Pound (GBP)</option>
  <option value="AUD">Australian Dollar (AUD)</option>
  <option value="CAD">Canadian Dollar (CAD)</option>
  <option value="CHF">Swiss Franc (CHF)</option>
  <option value="CNY">Chinese Yuan Renminbi (CNY)</option>
  <option value="HKD">Hong Kong Dollar (HKD)</option>
  <option value="NZD">New Zealand Dollar (NZD)</option>
      <option value="INR">India (IND)</option>
</select>

      <label htmlFor="tocurrency"></label>
   <select name="currency" id="tocurrency" value={tocurr} onChange={(obj)=>settocurr(obj.target.value)}>
  <option value="USD">US Dollar (USD)</option>
  <option value="EUR">Euro (EUR)</option>
  <option value="JPY">Japanese Yen (JPY)</option>
  <option value="GBP">British Pound (GBP)</option>
  <option value="AUD">Australian Dollar (AUD)</option>
  <option value="CAD">Canadian Dollar (CAD)</option>
  <option value="CHF">Swiss Franc (CHF)</option>
  <option value="CNY">Chinese Yuan Renminbi (CNY)</option>
  <option value="HKD">Hong Kong Dollar (HKD)</option>
  <option value="NZD">New Zealand Dollar (NZD)</option>
    <option value="INR">India (IND)</option>

</select>

<div className="result">{amount} {fromcurr} is equal to {convertedamount} {tocurr}</div>



    </div>
  );
}

export default Currency_converter;
