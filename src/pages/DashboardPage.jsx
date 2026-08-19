import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="auth-shell">
      <section className="auth-card dashboard-card">
        <p className="eyebrow">Dashboard</p>
        <h1>Hello, {user?.username || 'Player'}</h1>
        <p className="hero-copy">Choose your next action and launch the quiz module.</p>

        <div className="dashboard-grid">
          <article className="mini-card">
            <h3>Quiz Module</h3>
            <p>Start the interactive quiz page with category, difficulty, timer, and leaderboard.</p>
            <Link to="/quiz" className="primary-btn link-btn">Open Quiz Page</Link>
          </article>

          <article className="mini-card">
            <h3>Session</h3>
            <p>You can log out now and return through the login flow anytime.</p>
            <button type="button" className="secondary-btn" onClick={logout}>Logout</button>
          </article>
        </div>
      </section>
    </div>
  );
}
