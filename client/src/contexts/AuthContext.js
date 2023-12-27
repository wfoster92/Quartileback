import React, { createContext, useContext, useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  // const [authenticated, setAuthenticated] = useState(false)

  // useEffect(() => {
  //   // Check for the presence of the session cookie
  //   const sessionID = document.cookie.replace(
  //     /(?:(?:^|.*;\s*)sessionID\s*=\s*([^;]*).*$)|^.*$/,
  //     '$1'
  //   )

  //   if (sessionID) {
  //     setAuthenticated(true)
  //   }
  // }, [])
  // const login = () => {
  //   setAuthenticated(true)
  // }

  // const logout = () => {
  //   setAuthenticated(false)
  // }

  const [authToken, setAuthToken] = useState(
    localStorage.getItem('authToken') || null
  )
  const [expirationTime, setExpirationTime] = useState(
    Number(localStorage.getItem('expirationTime')) || null
  )

  const login = (token, expirationTime) => {
    setAuthToken(token)
    setExpirationTime(expirationTime)

    localStorage.setItem('authToken', token)
    localStorage.setItem('expirationTime', expirationTime)
    // Redirect or perform additional actions on successful login
    navigate('/')
  }

  const logout = () => {
    setAuthToken(null)
    setExpirationTime(null)

    localStorage.removeItem('authToken')
    localStorage.removeItem('expirationTime')

    // Redirect or perform additional actions on logout
    navigate('/login')
  }

  const isTokenValid = () => {
    // Check if expirationTime is set and if the current time is past the expiration time
    // console.log(new Date(expirationTime).getTime(), Date.now())
    // console.log(expirationTime, new Date(expirationTime).getTime(), Date.now())
    return expirationTime && new Date(expirationTime).getTime() > Date.now()
  }

  return (
    <AuthContext.Provider value={{ authToken, login, logout, isTokenValid }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
