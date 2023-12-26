import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(
          username
        )}&password=${encodeURIComponent(password)}`,
        credentials: 'include', // Include credentials (cookies) with the request
      })

      if (response.ok) {
        console.log('Login successful!')

        // Set a session cookie with secure and httpOnly flags (if needed)
        // document.cookie = 'token=value; path=/; secure; httpOnly'
        const authToken = 'authenticatesasfe2098adflj23123'

        // Call the login function to store the token
        login(authToken)
        // login()
      } else {
        console.error('Login failed.')
      }
    } catch (error) {
      console.error('Error during login:', error)
    }
  }

  // const handleLogin = async (event) => {

  //   // Perform authentication logic, and if successful, obtain the authentication token
  //   const authToken = 'authenticatesasfe2098adflj23123'

  //   // Call the login function to store the token
  //   login(authToken)
  //   navigate('/')
  // }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor='username'>Username:</label>
        <input
          type='text'
          id='username'
          name='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <label htmlFor='password'>Password:</label>
        <input
          type='password'
          id='password'
          name='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default LoginForm
