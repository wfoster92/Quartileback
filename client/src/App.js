import logo from './logo.svg'
import './App.css'
import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState()

  useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => setData(data.message))
  })
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{data ? data : 'Loading...'}</p>
      </header>
    </div>
  )
}

export default App
