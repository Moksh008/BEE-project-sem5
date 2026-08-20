import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getStoredLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem('quiz-master-leaderboard')) || [];
  } catch (error) {
    return [];
  }
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    setLeaderboard(getStoredLeaderboard());
  }, []);

  const rawUsername = user?.username || 'Player';
  const username = rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1).toLowerCase();

  const userScores = leaderboard.filter(entry => entry.name === username);

  const quizzesCompleted = userScores.length;
  const bestScore = quizzesCompleted > 0 ? Math.max(...userScores.map(s => s.percentage)) + '%' : '—';
  const averageScore = quizzesCompleted > 0
    ? Math.round(userScores.reduce((acc, curr) => acc + curr.percentage, 0) / quizzesCompleted) + '%'
    : '—';
  const streak = '0'; // Not tracked in current data model

  const categories = [
    { id: 'general', name: 'General Knowledge', icon: '🧠', desc: 'Test your overall trivia skills.' },
    { id: 'science', name: 'Science', icon: '🔬', desc: 'From biology to physics and beyond.' },
    { id: 'technology', name: 'Technology', icon: '💻', desc: 'Computers, programming, and tech history.' },
    { id: 'sports', name: 'Sports', icon: '⚽', desc: 'Athletes, teams, and sporting events.' },
    { id: 'history', name: 'History', icon: '🏛️', desc: 'Events and figures from the past.' },
    { id: 'geography', name: 'Geography', icon: '🌍', desc: 'Countries, capitals, and landmarks.' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', desc: 'Movies, music, television, and more.' }
  ];

  return (
    <div className="qm-landing qm-dashboard">
      <header className="qm-navbar">
        <div className="qm-nav-brand">Quiz Master</div>
        <nav className="qm-nav-links">
          <Link to="/dashboard" className="active">Dashboard</Link>
          <a href="#leaderboard">Leaderboard</a>
        </nav>
        <div className="qm-nav-actions">
          <div className="qm-user-profile">
            <span className="qm-user-avatar">{username.charAt(0).toUpperCase()}</span>
            <span className="qm-username">{username}</span>
          </div>
          <button type="button" onClick={logout} className="qm-btn-outline-purple">Logout</button>
        </div>
      </header>

      <main className="qm-dash-main">
        {/* WELCOME / HERO AREA */}
        <section className="qm-dash-hero">
          <div className="qm-dash-hero-content">
            <h1>Good evening, {username} 👋</h1>
            <p>Ready to challenge yourself today?</p>
            <Link to="/quiz" className="qm-btn-primary large mt-4">Start New Quiz</Link>
          </div>
        </section>

        {/* PERFORMANCE SUMMARY */}
        <section className="qm-dash-section">
          <h2>Performance Summary</h2>
          <div className="qm-stats-grid">
            <div className="qm-stat-card">
              <div className="qm-stat-header">
                <span className="qm-stat-icon">🏆</span>
                <span className="qm-stat-label">Best Score</span>
              </div>
              <span className="qm-stat-value">{bestScore}</span>
              <span className="qm-stat-desc">Your personal best</span>
            </div>
            <div className="qm-stat-card">
              <div className="qm-stat-header">
                <span className="qm-stat-icon">🎯</span>
                <span className="qm-stat-label">Quizzes Completed</span>
              </div>
              <span className="qm-stat-value">{quizzesCompleted > 0 ? quizzesCompleted : '0'}</span>
              <span className="qm-stat-desc">Total attempts</span>
            </div>
            <div className="qm-stat-card">
              <div className="qm-stat-header">
                <span className="qm-stat-icon">📊</span>
                <span className="qm-stat-label">Average Score</span>
              </div>
              <span className="qm-stat-value">{averageScore}</span>
              <span className="qm-stat-desc">Across all quizzes</span>
            </div>
            <div className="qm-stat-card">
              <div className="qm-stat-header">
                <span className="qm-stat-icon">🔥</span>
                <span className="qm-stat-label">Current Streak</span>
              </div>
              <span className="qm-stat-value">{streak}</span>
              <span className="qm-stat-desc">Days in a row</span>
            </div>
          </div>
        </section>

        <div className="qm-dash-grid">
          <div className="qm-dash-main-col">
            {/* CHOOSE YOUR CHALLENGE */}
            <section className="qm-dash-section">
              <h2>Choose Your Challenge</h2>
              <div className="qm-categories-grid dash-variant">
                {categories.map((cat) => (
                  <Link to="/quiz" key={cat.id} className="qm-category-card">
                    <div className="qm-category-icon">{cat.icon}</div>
                    <h3>{cat.name}</h3>
                    <p>{cat.desc}</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* RECENT QUIZZES */}
            <section className="qm-dash-section">
              <h2>Recent Quizzes</h2>
              <div className="qm-recent-list">
                {userScores.length > 0 ? (
                  userScores.map((score, index) => (
                    <div key={index} className="qm-recent-item">
                      <div className="qm-recent-info">
                        <span className="qm-recent-cat">—</span>
                        <span className="qm-recent-diff">—</span>
                      </div>
                      <div className="qm-recent-score">
                        <strong>{score.score}/{score.total}</strong>
                        <span className="qm-badge">{score.percentage}%</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="qm-empty-state">
                    <h3>No quizzes completed yet</h3>
                    <p>Take your first quiz and your results will appear here.</p>
                    <Link to="/quiz" className="qm-btn-primary small">Start Your First Quiz</Link>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="qm-dash-side-col" id="leaderboard">
            {/* LEADERBOARD PREVIEW */}
            <section className="qm-dash-section">
              <h2>🏆 Leaderboard</h2>
              <div className="qm-leaderboard-preview">
                {leaderboard.length > 0 ? (
                  <ol className="qm-lb-list">
                    {leaderboard.slice(0, 5).map((entry, idx) => (
                      <li key={idx} className={`qm-lb-item ${entry.name === username ? 'highlight' : ''}`}>
                        <div className="qm-lb-rank">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                        </div>
                        <div className="qm-lb-name">{entry.name}</div>
                        <div className="qm-lb-score">{entry.percentage}%</div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="qm-empty-state">No scores recorded yet.</div>
                )}
                <div className="mt-4 text-center">
                  <a href="#leaderboard" className="qm-btn-ghost w-full justify-center">View Full Leaderboard &rarr;</a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
