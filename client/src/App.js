import React, { useState } from 'react'
import Button from './button'
function App() {
  const [queryData, setQueryData] = useState()
  
  const fetchData = () => {  
      fetch("/getDies")
      .then (response => response.json())
      .then (data => {setQueryData(data)})
  }

  return (
    <div>
      <h1>Die List</h1>
      <pre>
      <Button onClick={fetchData}></Button>
      {JSON.stringify(queryData, null, 2)}
      </pre>
    </div>
  )
}

export default App