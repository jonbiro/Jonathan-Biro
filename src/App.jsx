import { useState } from "react";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import SITE_CONFIG from "./config/site";
import portrait from "./assets/headshot.webp";

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
          <div className="eng-introduction">
          <p className="eng-eyebrow">Software engineering · Test automation · SDET</p>
          <p className="eng-greeting">Hi, I’m</p>
          <h1>Jonathan Biro</h1>
          <p className="eng-lead">I build software—and figure out<br className="eng-desktop-break" /> why it breaks.</p>
          <p className="eng-summary">I bring QA automation and SDET experience from Priceline and DocMagic. Alongside that work, I build web products and regression tests with TypeScript and Playwright.</p>
          <div className="eng-actions">
            <a className="eng-button" href="#work" onClick={e => navigate(e, "work")}>View engineering work</a>
            <External href={SITE_CONFIG.githubUrl}>GitHub</External>
            <External href={SITE_CONFIG.linkedinUrl}>LinkedIn</External>
          </div>
          </div>
          <figure className="eng-portrait">
            <img src={portrait} alt="Illustrated portrait of Jonathan Biro" width="320" height="320" fetchPriority="high" />
            <figcaption>Jonathan Biro <span>Los Angeles, California</span></figcaption>
          </figure>
        </section>

        <section id="work" tabIndex={-1} className="eng-section">
          <div className="eng-section-heading"><p className="eng-eyebrow">Selected engineering work</p><h2>A closer look at my work.</h2></div>
          <article className="eng-case">
            <div className="eng-case-top">
              <div><p className="eng-meta">Independent project / Web application</p><h3>BiroMD — quality engineering</h3></div>
              <External href={repo}>View repository ↗</External>
            </div>
            <p className="eng-case-intro">I paired frontend development with automated release checks for a medical-practice website. My focus: making sure a patient’s path to a consultation still works after the next change.</p>
            <p className="eng-stack">TypeScript <span> / </span> Next.js <span> / </span> Playwright <span> / </span> GitHub Actions</p>
            <div className="eng-evidence">
              <div><h4>What I check in the browser</h4><p>Consultation links, mobile navigation, keyboard behavior, and contrast across themes. These need working user journeys, not just a successful build.</p><External href={`${repo}/blob/main/tests/site.spec.ts`}>Read the test suite ↗</External></div>
              <div><h4>What I catch before release</h4><p>Missing routes, broken internal links, sitemap mismatches, and oversized images. Automated export checks make these repeatable rather than a manual checklist.</p><External href={`${repo}/actions`}>View CI workflows ↗</External></div>
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
          <div><p className="eng-eyebrow">A bit about me</p><h2>Curious about the why.<br />Practical about the fix.</h2></div>
          <div><p>I’m a QA Automation Engineer and SDET in Los Angeles. I like the part of engineering where a vague “something’s wrong” becomes a clear reproduction, an understood cause, and a fix you can verify.</p><p>Building interfaces alongside their tests keeps me close to both the code and the person using it. My aim is straightforward: useful automation, understandable failures, and fewer surprises when a change ships.</p><External href={SITE_CONFIG.linkedinUrl}>More about my background ↗</External></div>
          <div className="eng-experience">
            <h3>Professional experience</h3>
            <ol className="eng-career" aria-label="Employment history, most recent first">
              <li><h4>DocMagic</h4><p className="eng-career-dates"><time dateTime="2022-08">August 2022</time>–present</p><p>QA Automation Engineer</p></li>
              <li><h4>Priceline</h4><p className="eng-career-dates">2019–2022 · 3 years, 1 month</p><p>Software Development Engineer in Test <span>(2020–2022)</span><br />QA Automation Engineer <span>(2019–2022)</span></p></li>
            </ol>
          </div>
        </section>

        <section id="contact" tabIndex={-1} className="eng-section eng-contact">
          <div><p className="eng-eyebrow">Get in touch</p><h2>Tell me what you’re building.</h2><p>Let’s talk about software engineering, automation, or an SDET role.</p></div>
          <div className="eng-contact-links"><a className="eng-email" href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a><button type="button" onClick={copyEmail}>Copy email</button><p role="status" aria-live="polite">{copyStatus}</p></div>
        </section>
      </main>
      <footer className="eng-footer"><span>© {new Date().getFullYear()} Jonathan Biro</span><External href={SITE_CONFIG.githubUrl}>GitHub</External><External href={SITE_CONFIG.linkedinUrl}>LinkedIn</External></footer>
    </div>
  </ErrorBoundary>;
}
