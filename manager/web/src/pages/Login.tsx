import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../components/api'
import { useAuth } from '../components/useAuth'
import '../styles/forms.css'

function Login() {
  const navigate = useNavigate()
  const { saveToken } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    try {
      const response = await apiRequest<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      saveToken(response.token)
      navigate('/')
    } catch (err) {
      const message = err instanceof Error ? err.message : ''
      if (message === 'Invalid credentials.' || message === 'Email and password required.') {
        setError(message)
      } else if (message === 'Failed to fetch') {
        setError('Unable to reach the manager API. Check your connection.')
      } else {
        setError('Login failed. Check credentials.')
      }
    }
  }

  return (
    <div className="login">
      <motion.form
        className="card"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.26, ease: 'easeOut', delay: 0.04 }}
        >
          Exposeu Manager
        </motion.h1>
        <p>Log in to manage projects, deliveries, and workflows.</p>
        {error && <div className="form-error">{error}</div>}
        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button type="submit">Log in</button>
      </motion.form>
    </div>
  )
}

export default Login
