import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    // Check for the presence of the session cookie
    const sessionID = document.cookie.replace(
      /(?:(?:^|.*;\s*)sessionID\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    )

    if (sessionID) {
      setAuthenticated(true)
    }
  }, [])
  const login = () => {
    setAuthenticated(true)
  }

  const logout = () => {
    setAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
