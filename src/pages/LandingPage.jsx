import { Link } from 'react-router-dom';

export default function LandingPage() {
  const categories = [
    { id: 'general', name: 'General Knowledge', icon: '🧠', desc: 'Test your overall trivia skills.' },
    { id: 'science', name: 'Science', icon: '🔬', desc: 'From biology to physics and beyond.' },
    { id: 'technology', name: 'Technology', icon: '💻', desc: 'Computers, programming, and tech history.' },
    { id: 'sports', name: 'Sports', icon: '⚽', desc: 'Athletes, teams, and sporting events.' },
    { id: 'history', name: 'History', icon: '🏛️', desc: 'Events and figures from the past.' },
    { id: 'geography', name: 'Geography', icon: '🌍', desc: 'Countries, capitals, and landmarks.' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', desc: 'Movies, music, television, and more.' }
  ];

  const features = [
    { title: 'Open Trivia DB', desc: 'Powered by a vast, community-driven database of questions.', icon: '📚' },
    { title: 'Multiple Difficulties', desc: 'Choose between easy, medium, and hard challenges.', icon: '⚖️' },
    { title: 'Countdown Timer', desc: 'Feel the pressure with our built-in question timer.', icon: '⏱️' },
    { title: 'Instant Scoring', desc: 'Get your results immediately after finishing.', icon: '💯' },
    { title: 'Answer Review', desc: 'Learn from your mistakes with a detailed review.', icon: '📝' },
    { title: 'Local Leaderboard', desc: 'Track your high scores directly on your device.', icon: '🏆' }
  ];

  return (
    <div className="qm-landing">
      <header className="qm-navbar">
        <div className="qm-nav-brand">Quiz Master</div>
        <nav className="qm-nav-links">
          <a href="#categories">Categories</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#features">Features</a>
        </nav>
        <div className="qm-nav-actions">
          <Link to="/login" className="qm-btn-ghost">Login</Link>
          <Link to="/quiz" className="qm-btn-primary">Start Quiz</Link>
        </div>
      </header>

      <main>
        <section className="qm-hero">
          <div className="qm-hero-content">
            <span className="qm-badge">INTERACTIVE QUIZ PLATFORM</span>
            <h1>Test your knowledge.<br />Beat the clock.</h1>
            <p>
              Challenge yourself across Science, Technology, History, Sports and more with timed quizzes powered by real-time questions.
            </p>
            <div className="qm-hero-buttons">
              <Link to="/quiz" className="qm-btn-primary large">Start Quiz</Link>
              <a href="#categories" className="qm-btn-secondary large">Explore Categories</a>
            </div>
          </div>
          <div className="qm-hero-visual">
            <div className="qm-preview-card">
              <div className="qm-preview-header">
                <span>Science • Question 5/10</span>
                <span className="qm-preview-timer">00:45</span>
              </div>
              <div className="qm-preview-body">
                <h3>Which planet has the most moons?</h3>
                <div className="qm-preview-options">
                  <div className="qm-preview-option">Jupiter</div>
                  <div className="qm-preview-option selected">Saturn</div>
                  <div className="qm-preview-option">Uranus</div>
                  <div className="qm-preview-option">Neptune</div>
                </div>
              </div>
              <div className="qm-preview-footer">
                <div className="qm-btn-primary small">Next Question</div>
              </div>
            </div>
          </div>
        </section>

        <section id="categories" className="qm-categories-section">
          <div className="qm-section-header">
            <h2>Explore Categories</h2>
            <p>Choose from a wide variety of topics for your customized quiz session.</p>
          </div>
          <div className="qm-categories-grid">
            {categories.map(cat => (
              <div key={cat.id} className="qm-category-card">
                <div className="qm-category-icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="qm-steps-section">
          <div className="qm-section-header">
            <h2>How It Works</h2>
            <p>Get started in seconds with four simple steps.</p>
          </div>
          <div className="qm-steps-grid">
            <div className="qm-step-card">
              <div className="qm-step-number">1</div>
              <h3>Choose Category</h3>
              <p>Pick a topic that interests you.</p>
            </div>
            <div className="qm-step-card">
              <div className="qm-step-number">2</div>
              <h3>Pick Difficulty</h3>
              <p>Select easy, medium, or hard mode.</p>
            </div>
            <div className="qm-step-card">
              <div className="qm-step-number">3</div>
              <h3>Answer Questions</h3>
              <p>Beat the countdown timer.</p>
            </div>
            <div className="qm-step-card">
              <div className="qm-step-number">4</div>
              <h3>Check Score</h3>
              <p>Review answers and top the leaderboard.</p>
            </div>
          </div>
        </section>

        <section id="features" className="qm-features-section">
          <div className="qm-section-header">
            <h2>Platform Features</h2>
            <p>Everything you need for a competitive trivia experience.</p>
          </div>
          <div className="qm-features-grid">
            {features.map((feat, idx) => (
              <div key={idx} className="qm-feature-card">
                <div className="qm-feature-icon">{feat.icon}</div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="qm-cta-section">
          <h2>Ready to challenge yourself?</h2>
          <p>Put your knowledge to the ultimate test and establish your high score.</p>
          <Link to="/quiz" className="qm-btn-primary large">Start Quiz</Link>
        </section>
      </main>

      <footer className="qm-footer">
        <div className="qm-footer-content">
          <div className="qm-footer-brand">Quiz Master Platform</div>
          <p>&copy; {new Date().getFullYear()} Quiz Master. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
