import React, { useState, useEffect } from 'react'

function App() {

  const [data, setData] = useState([{}])

  useEffect(() => {
      fetch("/getDies")
      .then (res => res.json())
      .then (data => {
        setData(data)
        console.log(data)
      })
  }, []) //only runs once

  return (
    <div>
      <h1>Die List</h1>
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}

export default App