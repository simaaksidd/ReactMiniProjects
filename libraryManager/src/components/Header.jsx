import { useState } from "react"




export default function Header() {

  const [count, setCount] = useState(0)

  function incrementCount() {
    setCount(prevCount => prevCount + 1)
  }

  return (
    <>
      <button onClick={incrementCount}>Click Me!</button>
      <h1>{count}</h1>
    </>
  )

}