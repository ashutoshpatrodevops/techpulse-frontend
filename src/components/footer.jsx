import { FaArrowUp, FaEnvelope, FaGithub, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="tp-footer">
      <div className="tp-footer__shell">
        <div className="tp-footer__topline" />
        <div className="tp-footer__grid">
          <section className="tp-footer__brand">
            <Link className="tp-footer__logo" to="/">TechPulse<span>.</span></Link>
            <p>Thoughtful technology stories for people building what comes next.</p>
            <div className="tp-footer__socials" aria-label="Social links">
              <a href="https://x.com/CoderAshu" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://github.com/ashutoshpatrodevops" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
              <a href="https://www.linkedin.com/in/ashutosh-patro-2054b7239" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            </div>
          </section>

          <nav className="tp-footer__links" aria-label="Quick links">
            <h2>Explore</h2>
            <Link to="/">Home</Link><Link to="/blogs">Articles</Link><Link to="/about">About</Link>
          </nav>

          <nav className="tp-footer__links" aria-label="Topics">
            <h2>Topics</h2>
            <Link to="/category/ai">Artificial intelligence</Link><Link to="/category/web-dev">Web development</Link><Link to="/category/mobile">Mobile apps</Link><Link to="/category/blockchain">Blockchain</Link>
          </nav>

          <section className="tp-footer__contact">
            <h2>Get in touch</h2>
            <a href="mailto:ashutoshpatro9087@gmail.com"><FaEnvelope />ashutoshpatro9087@gmail.com</a>
            <a href="tel:+917847810210"><FaPhone />+91 78478 10210</a>
            <span><FaMapMarkerAlt />Berhampur, Ganjam, Odisha</span>
          </section>
        </div>

        <div className="tp-footer__bottom">
          <span>© 2026 TechPulse. All rights reserved.</span>
          <div className="tp-footer__legal"><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms of Service</Link></div>
          <button type="button" onClick={scrollToTop}><FaArrowUp aria-hidden="true" /> Back to top</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;