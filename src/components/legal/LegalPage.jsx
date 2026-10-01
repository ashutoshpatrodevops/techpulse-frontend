import { Link } from 'react-router-dom';
import './LegalPage.css';

const privacySections = [
  ['Information we collect', <><p>When you create an account, TechPulse may collect your username, email address, profile information, and authentication details. When you publish or interact with articles, we store the content, reactions, comments, bookmarks, and follow relationships needed to provide those features.</p><p>We may also receive technical information such as browser type, device information, approximate usage data, and server logs.</p></>],
  ['How we use information', <p>We use information to operate TechPulse, authenticate accounts, publish and display community content, personalize account features, protect the service, respond to requests, and improve reliability and user experience.</p>],
  ['Cookies and sessions', <p>TechPulse uses session cookies to keep you signed in and protect authenticated actions. You can control cookies through your browser, but disabling them may prevent login and account features from working.</p>],
  ['Service providers', <p>TechPulse may use infrastructure and service providers for hosting, database storage, image delivery, authentication, email, and analytics. These providers process information only as needed to provide their services and may have their own privacy policies.</p>],
  ['Your choices', <p>You may update account information through available profile settings, stop using the service, or contact us about access, correction, or deletion requests. Some information may need to be retained for security, legal, or operational reasons.</p>],
  ['Security and retention', <p>We use reasonable safeguards for the information handled by TechPulse. No online service can guarantee absolute security. We retain information for as long as needed to operate the service, meet legal obligations, resolve disputes, and enforce agreements.</p>],
  ['Changes and contact', <p>We may update this policy as TechPulse changes. The latest version will be published on this page. Questions about privacy can be sent to <a href="mailto:ashutoshpatro9087@gmail.com">ashutoshpatro9087@gmail.com</a>.</p>],
];

const termsSections = [
  ['Using TechPulse', <p>TechPulse is a community publishing platform for technology articles and discussions. You agree to use the service lawfully, respect other members, protect your account, and provide accurate information when creating an account.</p>],
  ['Your content', <p>You keep ownership of articles, comments, images, and other material you submit. By publishing content on TechPulse, you grant TechPulse a non-exclusive license to host, display, format, distribute, and promote that content as part of the service.</p>],
  ['Content standards', <p>Do not publish content that is unlawful, deceptive, abusive, hateful, invasive of privacy, infringing, malicious, or intended to disrupt the service. Do not upload content or links that contain malware or attempt to bypass security controls.</p>],
  ['Moderation and account actions', <p>TechPulse may review, restrict, remove, or report content that violates these terms or creates risk for the community. Accounts may be suspended or closed when necessary to protect users, the service, or legal rights.</p>],
  ['Copyright and reports', <p>If you believe content on TechPulse infringes your rights, contact us with enough information to identify the material and explain the issue. Do not submit content you do not have permission to publish.</p>],
  ['Third-party services', <p>TechPulse may link to or use third-party services. Those services are governed by their own terms and policies. TechPulse is not responsible for the availability, content, or practices of third-party services.</p>],
  ['Disclaimers and changes', <p>TechPulse is provided on an as-available basis. Articles represent their authors and are not professional, legal, financial, medical, or security advice. We may change the service or these terms as the product evolves. Continued use after an update means you accept the revised terms.</p>],
  ['Contact', <p>Questions about these terms can be sent to <a href="mailto:ashutoshpatro9087@gmail.com">ashutoshpatro9087@gmail.com</a>.</p>],
];

const LegalPage = ({ type }) => {
  const isPrivacy = type === 'privacy';
  const sections = isPrivacy ? privacySections : termsSections;
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
  const intro = isPrivacy
    ? 'How TechPulse handles account, publishing, and community information.'
    : 'The rules for using TechPulse and participating in its technology community.';

  return (
    <main className="tp-legal">
      <div className="tp-legal__shell">
        <header className="tp-legal__hero">
          <Link className="tp-legal__back" to="/">Back to TechPulse</Link>
          <p className="tp-legal__eyebrow">TechPulse / {isPrivacy ? 'Trust' : 'Community'}</p>
          <h1>{title}</h1>
          <p>{intro}</p>
          <small>Last updated: October 1, 2026</small>
        </header>
        <div className="tp-legal__body">
          {sections.map(([heading, content]) => <section key={heading}><h2>{heading}</h2>{content}</section>)}
        </div>
        <footer className="tp-legal__footer"><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms of Service</Link><Link to="/">Return home</Link></footer>
      </div>
    </main>
  );
};

export default LegalPage;