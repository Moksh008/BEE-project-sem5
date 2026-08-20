import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      return;
    }

    login(username);
    navigate('/dashboard', { replace: true });
  }

  return (
    <div className="qm-landing qm-login-page">
      <div className="qm-login-container">
        <div className="qm-login-header">
          <div className="qm-login-brand">🎯 Quiz Master</div>
        </div>

        <div className="qm-login-card">
          <div className="qm-login-titles">
            <h1>Welcome Back!</h1>
            <p>Sign in to continue your quiz journey.</p>
          </div>

          <form className="qm-login-form" onSubmit={handleSubmit}>
            <div className="qm-form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                maxLength="20"
                required
              />
            </div>

            <div className="qm-form-group">
              <label htmlFor="password">Password</label>
              <div className="qm-password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  className="qm-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="submit" className="qm-btn-primary large qm-login-btn">
              Login
            </button>
          </form>

          <div className="qm-login-footer">
            <Link to="/" className="qm-btn-ghost">
              &larr; Back to Landing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
