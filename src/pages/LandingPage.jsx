import { Link } from 'react-router-dom';
import HeroThreeReplica from '../components/HeroThreeReplica';

export default function LandingPage() {
  const logoNames = ['Acme Corp', 'Altshift', 'Biosynthesis', 'Boltshift', 'Capsule', 'Catalog', 'Cloudwatch', 'Commandr'];

  const testimonials = [
    { name: 'Jennifer Walsh', quote: 'This platform transformed our support process. Response times dropped dramatically and customer satisfaction is at an all-time high.' },
    { name: 'Michael Torres', quote: 'From onboarding to full deployment, everything felt smooth. Team productivity improved by 40% in the first month.' },
    { name: 'Amanda Chen', quote: 'The analytics are clear, fast, and practical. We can finally make decisions in real time.' },
    { name: 'David Patterson', quote: 'Reliable infrastructure and easy collaboration made rollout effortless across every department.' },
  ];

  return (
    <div className="lp-page">
      <header className="lp-topbar">
        <a href="#" className="lp-brand">QuizFlow</a>
        <nav className="lp-nav">
          <button type="button" className="lp-nav-dd">Products <span>▾</span></button>
          <button type="button" className="lp-nav-dd">Resources <span>▾</span></button>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className="lp-nav-actions">
          <Link to="/login" className="lp-link-btn">Sign in</Link>
          <Link to="/login" className="lp-cta-btn">Try for free <span>→</span></Link>
        </div>
      </header>

      <main className="lp-main" id="main-content">
        <HeroThreeReplica />

        <section className="lp-preview" aria-label="dashboard preview">
          <div className="lp-preview-window">
            <div className="lp-preview-header">
              <span />
              <span />
              <span />
            </div>
            <div className="lp-preview-grid alt">
              <div className="lp-preview-main">
                <div className="lp-kpi-row">
                  <div>
                    <p>Revenue this month</p>
                    <h3>$84,220</h3>
                  </div>
                  <strong>+18.4%</strong>
                </div>
                <div className="lp-chart-grid">
                  <i style={{ height: '36%' }} />
                  <i style={{ height: '52%' }} />
                  <i style={{ height: '60%' }} />
                  <i style={{ height: '41%' }} />
                  <i style={{ height: '75%' }} />
                  <i style={{ height: '58%' }} />
                  <i style={{ height: '80%' }} />
                  <i style={{ height: '68%' }} />
                </div>
              </div>
              <div className="lp-preview-side">
                <p>Active projects</p>
                <h4>24 running</h4>
                <div className="lp-pill-row">
                  <span>Deploy</span>
                  <span>Build</span>
                  <span>Test</span>
                </div>
                <div className="lp-status">All passing ✓ 100%</div>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-logo-strip" aria-label="trusted logos">
          <p>Trusted by teams worldwide</p>
          <div className="lp-logo-row">
            {logoNames.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
          <div className="lp-logo-row muted">
            {logoNames.map((name) => (
              <span key={`${name}-muted`}>{name}</span>
            ))}
          </div>
        </section>

        <p className="lp-storyline">
          Modern teams use our platform to elevate every customer touchpoint, blending human expertise with AI
          capabilities in one unified system that drives continuous improvement across all channels.
        </p>

        <section className="lp-features" id="features">
          <article className="lp-feature-card tall">
            <h3>Guided Onboarding For Every Team</h3>
            <p>Get your team up and running in minutes with step-by-step walkthroughs.</p>
            <div className="lp-mock-card">
              <h4>Your workspace is ready!</h4>
              <p>Invite your team and start collaborating instantly.</p>
              <small>PRJ • 2024 • LIVE</small>
            </div>
          </article>

          <article className="lp-feature-card tall">
            <h3>Real-time Data</h3>
            <p>Monitor metrics, analytics, and team activity instantly.</p>
            <div className="lp-mock-panel">
              <div className="lp-search">Search projects...</div>
              <div className="lp-progress-row"><span>Deploy</span><strong>74%</strong></div>
              <div className="lp-progress-row"><span>Build</span><strong>88%</strong></div>
              <div className="lp-progress-row"><span>Test</span><strong>100%</strong></div>
            </div>
          </article>

          <article className="lp-feature-card">
            <h3>Trusted By 254k+ Users</h3>
            <p>4.9 from 48k+ reviews with enterprise-grade reliability.</p>
            <div className="lp-metric">5+ average rating</div>
          </article>

          <article className="lp-feature-card">
            <h3>Built to Scale</h3>
            <p>Enterprise-ready infrastructure that grows with you.</p>
            <div className="lp-metric-grid">
              <div><span>🚀 2,598 Deploys</span><strong>+24%</strong></div>
              <div><span>⚡ 99.9% Uptime</span><strong>+0.2%</strong></div>
            </div>
          </article>
        </section>

        <section className="lp-testimonials" id="testimonials">
          <h2>Trusted by teams worldwide</h2>
          <div className="lp-tabs">
            {testimonials.map((item, index) => (
              <button key={item.name} type="button" className={index === 1 ? 'active' : ''}>{item.name}</button>
            ))}
          </div>
          <blockquote>“{testimonials[1].quote}”</blockquote>
          <p className="lp-quote-meta">{testimonials[1].name}, Head of Operations @ Interlock</p>
          <div className="lp-company-row">
            <span>Commandr</span>
            <span>Interlock</span>
            <span>Focalpoint</span>
            <span>Acme Corp</span>
          </div>
        </section>

        <section className="lp-how">
          <div className="lp-how-head">
            <h2>How it works</h2>
            <p>Your platform, configured by experts and launched on an Enterprise plan, ready to grow with you.</p>
            <a href="#">Schedule kickoff</a>
          </div>
          <ol>
            <li>
              <h3>Schedule kickoff</h3>
              <p>Align on scope, structure, and timeline. Quick setup or full migration, we take it from there.</p>
            </li>
            <li>
              <h3>Real-time collaboration</h3>
              <p>Work alongside our team with full visibility and robust QA best practices.</p>
            </li>
            <li>
              <h3>Launch and scale</h3>
              <p>Go live with confidence. AI continuously improves outcomes as your usage expands.</p>
            </li>
          </ol>
        </section>

        <section className="lp-pricing" id="pricing">
          <div className="lp-pricing-head">
            <p>Pricing</p>
            <h2>Simple, transparent pricing</h2>
            <span>Choose the plan that works best for your team. All plans include a 14-day free trial.</span>
          </div>
          <div className="lp-pricing-grid">
            <article className="lp-price-card">
              <h3>Starter</h3>
              <p className="lp-price">$24<span>/month</span></p>
              <em>Billed annually, or $40/mo billed monthly</em>
              <ul>
                <li>2 Team Members</li>
                <li>10GB Storage</li>
                <li>Basic Analytics</li>
                <li>Email support</li>
              </ul>
              <Link to="/login" className="lp-ghost-btn">Get Started</Link>
            </article>
            <article className="lp-price-card popular">
              <p className="lp-popular">Most Popular</p>
              <h3>Premium</h3>
              <p className="lp-price">$99<span>/month</span></p>
              <em>Billed annually, or $120/mo billed monthly</em>
              <ul>
                <li>10 Team Members</li>
                <li>50GB Storage</li>
                <li>Advanced Analytics</li>
                <li>Priority Support</li>
              </ul>
              <Link to="/login" className="lp-cta-btn">Get Started</Link>
            </article>
            <article className="lp-price-card">
              <h3>Enterprise</h3>
              <p className="lp-price">$125<span>/month</span></p>
              <em>Billed annually, or $150/mo billed monthly</em>
              <ul>
                <li>Unlimited Members</li>
                <li>2TB Storage</li>
                <li>Custom Integrations</li>
                <li>Dedicated Support</li>
              </ul>
              <Link to="/login" className="lp-ghost-btn">Get Started</Link>
            </article>
          </div>
        </section>

        <section className="lp-faq">
          <div>
            <p>Frequently Asked Questions</p>
            <h2>Everything you need to know</h2>
            <span>Can't find the answer you're looking for? Reach out!</span>
          </div>
          <div className="lp-faq-list">
            <details open>
              <summary>How does the 14-day free trial work?</summary>
              <p>Start using the platform immediately with full access to all features. No credit card required.</p>
            </details>
            <details>
              <summary>Can I switch plans at any time?</summary>
              <p>Yes, upgrade or downgrade whenever your team requirements change.</p>
            </details>
            <details>
              <summary>What integrations do you support?</summary>
              <p>We support API-based integrations for CRM, LMS, SSO, and analytics tools.</p>
            </details>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <p>© {new Date().getFullYear()} QuizFlow. All rights reserved</p>
        <Link to="/login">Dashboard Access</Link>
      </footer>
    </div>
  );
}
