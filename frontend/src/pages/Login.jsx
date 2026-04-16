import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../context/StoreContext'

const Login = () => {
  const { login } = useContext(StoreContext)
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [identifier, setIdentifier] = useState("user@flipkart.com") // email or phone
  const [password, setPassword] = useState("password")
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await login(identifier, password)
      navigate(-1)
    } catch (err) {
      setError("Invalid email/mobile or password. Please try again.")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-left">
          <h2>{mode === 'login' ? 'Login' : "Looks like you're new here!"}</h2>
          <p>{mode === 'login'
            ? 'Get access to your Orders, Wishlist and Recommendations'
            : 'Sign up with your mobile number or email to get started'}
          </p>
          <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" alt="Login" />
        </div>

        <div className="auth-right">
          {error && (
            <div style={{color:'red', background:'#fff3f3', padding:'10px', borderRadius:'4px', marginBottom:'16px', fontSize:'13px', border:'1px solid #ffcccc'}}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <>
                <label className="auth-label">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </>
            )}

            <label className="auth-label">Email address or Mobile number</label>
            <input
              type="text"
              placeholder="Enter email or 10-digit mobile number"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              required
            />

            <label className="auth-label">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <p className="terms">
              By continuing, you agree to Flipkart's{' '}
              <a href="#" style={{color:'var(--fk-blue)'}}>Terms of Use</a> and{' '}
              <a href="#" style={{color:'var(--fk-blue)'}}>Privacy Policy</a>.
            </p>

            <button type="submit" className="auth-submit">
              {mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider"><span>OR</span></div>

          <button
            className="auth-switch-btn"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError("") }}
          >
            {mode === 'login' ? 'New to Flipkart? Create an account' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
