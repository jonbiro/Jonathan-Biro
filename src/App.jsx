import { useState } from "react";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import SITE_CONFIG from "./config/site";

const repo = "https://github.com/jonbiro/BiroMD";
const External = ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}<span className="sr-only"> (opens in a new tab)</span></a>;

export default function App() {
  const [copyStatus, setCopyStatus] = useState("");
  const navigate = (event, id) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const section = document.getElementById(id);
    section?.scrollIntoView({ block: "start", behavior: "auto" });
    section?.focus({ preventScroll: true });
    window.history.replaceState(null, "", `#${id}`);
  };
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(SITE_CONFIG.email); setCopyStatus("Email copied."); }
    catch { setCopyStatus("Copy unavailable. Use the email link or select the address below."); }
  };

  return <ErrorBoundary>
    <div className="engineering">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className="eng-header">
        <a className="eng-wordmark" href="#top" onClick={e => navigate(e, "top")}>Jonathan Biro</a>
        <nav aria-label="Primary navigation">
          <a href="#work" onClick={e => navigate(e, "work")}>Work</a>
          <a href="#about" onClick={e => navigate(e, "about")}>Background</a>
          <a href="#contact" onClick={e => navigate(e, "contact")}>Contact</a>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        <section id="top" tabIndex={-1} className="eng-hero">
          <p className="eng-eyebrow">Software engineering · Test automation · SDET</p>
          <h1>Jonathan Biro</h1>
          <p className="eng-lead">Reliable software.<br />Repeatable verification.</p>
          <p className="eng-summary">I build web applications and automated checks with TypeScript and Playwright. My work connects implementation, regression testing, and release validation.</p>
          <div className="eng-actions">
            <a className="eng-button" href="#work" onClick={e => navigate(e, "work")}>View engineering work</a>
            <External href={SITE_CONFIG.githubUrl}>GitHub</External>
            <External href={SITE_CONFIG.linkedinUrl}>LinkedIn</External>
          </div>
          <p className="eng-location">Los Angeles, California</p>
        </section>

        <section id="work" tabIndex={-1} className="eng-section">
          <div className="eng-section-heading"><p className="eng-eyebrow">Selected engineering work</p><h2>Implementation. Tests. Release checks.</h2></div>
          <article className="eng-case">
            <div className="eng-case-top">
              <div><p className="eng-meta">Independent project / Web application</p><h3>BiroMD — quality engineering</h3></div>
              <External href={repo}>View repository ↗</External>
            </div>
            <p className="eng-case-intro">Frontend implementation and automated validation for a medical-practice website. The engineering work focuses on navigation, consultation paths, accessibility, and static-release integrity.</p>
            <p className="eng-stack">TypeScript <span> / </span> Next.js <span> / </span> Playwright <span> / </span> GitHub Actions</p>
            <div className="eng-evidence">
              <div><h4>Browser regression coverage</h4><p>Exercise consultation links, mobile navigation, keyboard behavior, and theme-dependent contrast in a real browser.</p><External href={`${repo}/blob/main/tests/site.spec.ts`}>Read the test suite ↗</External></div>
              <div><h4>Build and release validation</h4><p>Verify exported routes, internal links, sitemap entries, and image budgets alongside the production build.</p><External href={`${repo}/actions`}>View CI workflows ↗</External></div>
            </div>
            <details className="eng-details">
              <summary>Technical example: preventing a dark-mode contrast regression</summary>
              <div className="eng-detail-body">
                <p>A consultation-button fix explicitly corrected its dark-mode foreground. The browser regression checks the computed text contrast in both themes against a 4.5:1 minimum.</p>
                <pre><code>{`const cta = page.getByRole("link", {
  name: "Request a Consultation"
}).first();

await expect(cta).toBeVisible();
expect(await textContrast(cta))
  .toBeGreaterThanOrEqual(4.5);`}</code></pre>
                <p className="eng-meta">Excerpt from the repository test suite; not a live test result.</p>
                <External href={`${repo}/commit/3427224bcca966b8de74a6c5f038ef811783af24`}>Inspect the implementation change ↗</External>
              </div>
            </details>
          </article>
        </section>

        <section id="about" tabIndex={-1} className="eng-section eng-background">
          <div><p className="eng-eyebrow">Background</p><h2>Software development,<br />with quality built in.</h2></div>
          <div><p>I’m a QA Automation Engineer and SDET based in Los Angeles. I work across frontend implementation, automated testing, and release validation.</p><p>I focus on reproducible failures, maintainable checks, and useful CI feedback. The case study above links directly to source code so the implementation can be evaluated on its own merits.</p><External href={SITE_CONFIG.linkedinUrl}>Professional background on LinkedIn ↗</External></div>
        </section>

        <section id="contact" tabIndex={-1} className="eng-section eng-contact">
          <div><p className="eng-eyebrow">Contact</p><h2>Let’s talk engineering.</h2><p>For software engineering, automation, and SDET opportunities.</p></div>
          <div className="eng-contact-links"><a className="eng-email" href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a><button type="button" onClick={copyEmail}>Copy email</button><p role="status" aria-live="polite">{copyStatus}</p></div>
        </section>
      </main>
      <footer className="eng-footer"><span>© {new Date().getFullYear()} Jonathan Biro</span><External href={SITE_CONFIG.githubUrl}>GitHub</External><External href={SITE_CONFIG.linkedinUrl}>LinkedIn</External></footer>
    </div>
  </ErrorBoundary>;
}
