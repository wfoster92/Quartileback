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

  const login = (token) => {
    setAuthToken(token)
    localStorage.setItem('authToken', token)
    // Redirect or perform additional actions on successful login
    navigate('/')
  }

  const logout = () => {
    setAuthToken(null)
    localStorage.removeItem('authToken')
  }

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
