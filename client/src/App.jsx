// App.js
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import NoPage from './components/NoPage'
import Contact from './components/Contact'
import NavBar from './components/NavBar'
import Gamblin from './components/Gamblin'
import Sports from './components/Sports'
import LoginForm from './components/LoginForm'
import { CFBProvider } from './contexts/cfbContext'
import { useAuth } from './contexts/AuthContext'

const App = () => {
  const { authenticated } = useAuth()

  return (
    <>
      <NavBar />

      <Routes>
        {authenticated ? (
          <Route path='/' element={<Home />} />
        ) : (
          <Route path='/' element={<LoginForm />} />
        )}
        <Route path='/' element={<LoginForm />} />
        <Route path='/gamblin' element={<Gamblin />} />
        {authenticated ? (
          <Route
            path='/sports'
            element={
              <CFBProvider>
                <Sports />
              </CFBProvider>
            }
          />
        ) : null}

        {/* Add a route for the login page */}
        {/* <Route path='/login' element={<LoginForm />} /> */}
        <Route path='/*' element={<NoPage />} />
      </Routes>
    </>
  )
}

export default App
