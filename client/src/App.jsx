// App.js
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import NoPage from './components/NoPage'
import Contact from './components/Contact'
import NavBar from './components/NavBar'
import Gamblin from './components/Gamblin'
import Sports from './components/Sports'
import { CFBProvider } from './contexts/cfbContext'

const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/gamblin' element={<Gamblin />} />

        <Route
          path='/sports'
          element={
            <CFBProvider>
              <Sports />
            </CFBProvider>
          }
        />

        <Route path='/*' element={<NoPage />} />
      </Routes>
    </>
  )
}

export default App
