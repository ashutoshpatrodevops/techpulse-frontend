import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import './Hero.css';

const TOPICS = [
  'Artificial intelligence',
  'Generative AI',
  'Software development',
  'Future tech',
];

// Placeholder articles. Pass real ones as <Hero articles={...} /> once your
// blogs API is wired in: { id, tag, title, readTime, to }.
const SAMPLE_ARTICLES = [
  { id: 1, tag: 'AI', title: 'What AI agents can and can’t do yet', readTime: 6 },
  { id: 2, tag: 'Generative AI', title: 'Prompting is turning into software engineering', readTime: 5 },
  { id: 3, tag: 'Software development', title: 'Why small teams are shipping faster with typed APIs', readTime: 4 },
];

const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

const Hero = ({ articles = SAMPLE_ARTICLES }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setMessage('Enter your email address.');
      return;
    }
    if (!isValidEmail(email)) {
      setStatus('error');
      setMessage('Enter a valid email address, like name@example.com.');
      return;
    }

    setStatus('sending');
    setMessage('');

    try {
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          user_email: email,
          user_name: email.split('@')[0],
          subscription_date: new Date().toLocaleDateString(),
          subscription_time: new Date().toLocaleTimeString(),
          message: `New newsletter subscription from ${email}`,
          to_name: 'TechPulse Team',
          from_name: 'TechPulse Newsletter System',
        },
        EMAILJS_CONFIG.publicKey
      );

      if (response.status !== 200) throw new Error('Send failed');

      setStatus('success');
      setMessage("You're subscribed. The next weekly update will land in your inbox.");
      setEmail('');
      setTimeout(() => setStatus('idle'), 6000);
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
      setMessage("We couldn't subscribe you. Check your connection and try again.");
    }
  };

  const sending = status === 'sending';
  const buttonLabel =
    status === 'sending' ? 'Subscribing…' : status === 'success' ? 'Subscribed' : 'Subscribe';

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <h1 id="hero-title" className="hero__title">
          Follow the ideas shaping what&rsquo;s next in tech.
        </h1>

        <p className="hero__lede">
          TechPulse publishes articles on AI, software development and the technology
          coming next, written by people who build it.
        </p>

        <ul className="topics" aria-label="Topics we cover">
          {TOPICS.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>

        {/* Calls to action */}
        <div className="cta-row">
          <Link className="cta cta--primary" to="/blogs">
            Read articles
            <ArrowIcon />
          </Link>
          <a className="cta cta--secondary" href="#newsletter">
            <span className="cta__icon">
              <MailIcon />
            </span>
            Get the weekly digest
          </a>
        </div>

        {/* Preview card */}
        <div className="preview" role="region" aria-labelledby="feed-title">
          <div className="preview__header">
            <h2 id="feed-title" className="preview__title">
              <span className="preview__dot" aria-hidden="true" />
              Latest on TechPulse
            </h2>
            <svg className="preview__ecg" viewBox="0 0 64 20" aria-hidden="true" focusable="false">
              <path d="M0 10 H18 L23 10 L27 2 L33 18 L37 10 H46 L49 7 L52 10 H64" />
            </svg>
          </div>

          <ol className="preview__list">
            {articles.map((a) => (
              <li key={a.id}>
                <Link className="preview__item" to={a.to || '/blogs'}>
                  <span className="preview__tag">{a.tag}</span>
                  <span className="preview__headline">{a.title}</span>
                  <span className="preview__meta">{a.readTime} min read</span>
                </Link>
              </li>
            ))}
          </ol>

          <form id="newsletter" className="signup" onSubmit={handleSubscribe} noValidate>
            <label className="signup__label" htmlFor="newsletter-email">
              Get the weekly digest
            </label>
            <div className="signup__body">
              <div className={`signup__field${status === 'error' ? ' is-error' : ''}`}>
                <input
                  id="newsletter-email"
                  className="signup__input"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={sending}
                  aria-invalid={status === 'error'}
                  aria-describedby="signup-status"
                />
                <button
                  className={`signup__button${status === 'success' ? ' is-success' : ''}`}
                  type="submit"
                  disabled={sending}
                >
                  {buttonLabel}
                </button>
              </div>
              <p
                id="signup-status"
                className={`signup__status signup__status--${status}`}
                role="status"
                aria-live="polite"
              >
                {message}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;