// App.js
import { Routes, Route } from 'react-router-dom'
import Home from './components/Pages/Home'
import NoPage from './components/Pages/NoPage'
import NavBar from './components/SubComponents/NavBar'
import Gamblin from './components/Pages/Gamblin'
import GameView from './components/Pages/GameView'
import Portfolio from './components/Pages/Portfolio'
import LoginForm from './components/Pages/LoginForm'
import { GamesProvider } from './contexts/GamesContext'
import { useAuth } from './contexts/AuthContext'
import Rankings from './components/Pages/Rankings'

const App = () => {
  const { authenticated } = useAuth()

  return (
    <>
      <NavBar />

      <Routes>
        {/* {authenticated ? (
          <Route path='/' element={<Home />} />
        ) : (
          <Route path='/' element={<LoginForm />} />
        )} */}
        <Route path='/login' element={<LoginForm />} />
        <Route
          path='/'
          element={
            <GamesProvider>
              <Rankings />
            </GamesProvider>
          }
        />
        <Route path='/gamblin' element={<Gamblin />} />
        {authenticated ? (
          <>
            {/* move this back to the authenticated when done developing */}
            <Route
              path='/gameView'
              element={
                <GamesProvider>
                  <GameView />
                </GamesProvider>
              }
            />
            <Route
              path='/portfolio'
              element={
                <GamesProvider>
                  <Portfolio />
                </GamesProvider>
              }
            />
          </>
        ) : null}

        {/* Add a route for the login page */}
        {/* <Route path='/login' element={<LoginForm />} /> */}
        <Route path='/*' element={<NoPage />} />
      </Routes>
    </>
  )
}

export default App
