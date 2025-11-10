import React, { useState } from 'react';

const Servicing = () => {

  const [toolNumber, setToolNumber] = useState('');
  const [detailNumber, setDetailNumber] = useState('');
  const [buildNumber, setBuildNumber] = useState('');
  const [componentNumber, setComponentNumber] = useState('');
  const [materialRemoved, setMaterialRemoved] = useState('');
  const [error, setError] = useState('');
  const [numberOfHits, setNumberOfHits] = useState('')
  const [toolNumber2, setToolNumber2] = useState('')
 
    const handleSubmit = async (e) => { 
      e.preventDefault(); 

    try {
      const response = await fetch("/grindComponent", {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({tool_number: toolNumber, detail_number: detailNumber, build_number: buildNumber, component_number: componentNumber, material_removed: materialRemoved})
      })
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      console.log(result)     
    }   
    catch (error) {
      console.error(error.message)
    }   
  }
  

    const startProduction = async (e) => { 
      e.preventDefault(); 

    try {
      const response = await fetch("/startProductionRun", {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({tool_number: toolNumber}) 
      })
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      console.log(result)     
    }   
    catch (error) {
      console.error(error.message)
    }   
  }

    const endProduction = async (e) => { 
      e.preventDefault(); 

    try {
      const response = await fetch("/endProductionRun", {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({tool_number: toolNumber2, number_of_hits: numberOfHits}) 
      })
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      console.log(result)     
    }   
    catch (error) {
      console.error(error.message)
    }   
  }
  return (
    <div>
    <div className='main-container' style={{justifyContent: 'center', alignItems: 'center'}}>
        <div className='container'>
            <h2>Grind Component</h2>
            <p>fill out component to grind</p>
            <form onSubmit={handleSubmit}>
                <h5>Tool Number</h5>
                <input
                type="text"
                placeholder="Tool Number"
                value={toolNumber}
                onChange={(e) => setToolNumber(e.target.value)}
                required
                />
                <h5>Detail Number</h5>
                <input
                type="text"
                placeholder="Detail Number"
                value={detailNumber}
                onChange={(e) => setDetailNumber(e.target.value)}
                required
                />
                <h5>Build Number</h5>
                <input
                type="text"
                placeholder="Build Number"
                value={buildNumber}
                onChange={(e) => setBuildNumber(e.target.value)}
                required
                />
                <h5>Component Number</h5>
                <input
                type="text"
                placeholder="Component Number"
                value={componentNumber}
                onChange={(e) => setComponentNumber(e.target.value)}
                required
                />
                <h5>Material Removed</h5>
                <input
                type="text"
                placeholder="Material Removed"
                value={materialRemoved}
                onChange={(e) => setMaterialRemoved(e.target.value)}
                required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p className='error'>{error}</p>}
        </div>
    </div>

    <div className='main-container' style={{justifyContent: 'center', alignItems: 'center'}}>
        <div className='container'>
            <h2>Start Production Run</h2>
            <p>fill out Tool Number</p>
            <form onSubmit={startProduction}>
                <h5>Tool Number</h5>
                <input
                type="text"
                placeholder="Tool Number"
                value={toolNumber}
                onChange={(e) => setToolNumber(e.target.value)}
                required
                />
                
                <button type="submit">Submit</button>
            </form>
            {error && <p className='error'>{error}</p>}
        </div>
    </div>

    <div className='main-container' style={{justifyContent: 'center', alignItems: 'center'}}>
        <div className='container'>
            <h2>End Production Run</h2>
            <p>Enter Tool Number</p>
            <form onSubmit={endProduction}>
                <h5>Tool Number</h5>
                <input
                type="text"
                placeholder="Tool Number"
                value={toolNumber2}
                onChange={(e) => setToolNumber2(e.target.value)}
                required
                />
                <h5>Number of Hits</h5>
                <input
                type="text"
                placeholder="Tool Number"
                value={numberOfHits}
                onChange={(e) => setNumberOfHits(e.target.value)}
                required
                />
                
                <button type="submit">Submit</button>
            </form>
            {error && <p className='error'>{error}</p>}
        </div>
    </div>
  </div>
  );
}

export default Servicing;