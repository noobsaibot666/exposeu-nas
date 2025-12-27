import { useState } from 'react'
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
    } catch {
      setError('Login failed. Check credentials.')
    }
  }

  return (
    <div className="login">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Exposeu Manager</h1>
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
      </form>
    </div>
  )
}

export default Login
