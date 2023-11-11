// App.js
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import NoPage from './components/NoPage'
import Contact from './components/Contact'
import NavBar from './components/NavBar'

const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/*" element={<NoPage />} />
      </Routes>
    </>
  )
}

export default App
