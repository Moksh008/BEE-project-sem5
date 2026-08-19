import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function HeroThreeReplica() {
  const rootRef = useRef(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) {
      return undefined;
    }

    function handleMove(event) {
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      node.style.setProperty('--mx', `${x}`);
      node.style.setProperty('--my', `${y}`);
    }

    node.addEventListener('pointermove', handleMove);
    return () => node.removeEventListener('pointermove', handleMove);
  }, []);

  return (
    <section className="rb-hero3" ref={rootRef}>
      <div className="rb-hero3-nav">
        <p>Neural__Lab</p>
        <span>Experiments</span>
        <Link to="/login" className="rb-hero3-small-btn">Get Started</Link>
      </div>

      <div className="rb-hero3-content">
        <h1>
          <span>Neural Network</span>
          <span>Visualization Engine</span>
        </h1>
        <ul>
          <li><Link to="/login">Documentation ↗</Link></li>
          <li><Link to="/login">API Reference ↗</Link></li>
          <li><Link to="/login">Get Started ↗</Link></li>
        </ul>
      </div>

      <div className="rb-hero3-glow" aria-hidden="true" />
      <div className="rb-hero3-grid" aria-hidden="true" />
    </section>
  );
}
