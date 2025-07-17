import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Props from './props'
import { Advice_com } from '../sources/advice'

function App() {
  const [count, setCount] = useState(0)

  return (
   <>
   {/* <Props name="maddy" age="90" ismarried="false"></Props>
   <Props name="maddy" age={78} ismarried={false}></Props>
   <Props name="maddy" age={78} ismarried={false}></Props>
   <Props name="maddy" age={78} ismarried={false}></Props>
    */}
    <Advice_com/>
   
   </>

  )
}

export default App
