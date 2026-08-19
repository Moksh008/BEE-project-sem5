import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('Player');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      return;
    }

    login(username);
    navigate('/dashboard', { replace: true });
  }

  return (
    <div className="auth-shell">
      <section className="auth-card">
        <h1>Login</h1>
        <p className="section-subtext">Sign in to continue to your dashboard.</p>

        <form className="setup-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              maxLength="20"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <button type="submit" className="primary-btn">Login</button>
        </form>

        <div className="page-actions">
          <Link to="/" className="secondary-btn link-btn">Back to Landing</Link>
        </div>
      </section>
    </div>
  );
}
