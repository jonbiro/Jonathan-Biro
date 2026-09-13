import { useState } from "react";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import SITE_CONFIG from "./config/site";
import portrait from "./assets/headshot.webp";
import portrait128 from "./assets/headshot-128.webp";
import portrait256 from "./assets/headshot-256.webp";

const repo = "https://github.com/jonbiro/BiroMD";
const publicAsset = (assetPath) => `${import.meta.env.BASE_URL}${assetPath.replace(/^\/+/, "")}`;
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
        <a className="eng-wordmark" href="#top" onClick={e => navigate(e, "top")}><span className="eng-monogram" aria-hidden="true">jb.</span>Jonathan Biro</a>
        <nav aria-label="Primary navigation">
          <a href="#experience" onClick={e => navigate(e, "experience")}>Experience</a>
          <a href="#work" onClick={e => navigate(e, "work")}>Work</a>
          <a href="#about" onClick={e => navigate(e, "about")}>Background</a>
          <a href="#contact" onClick={e => navigate(e, "contact")}>Contact</a>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        <section id="top" tabIndex={-1} className="eng-hero">
          <div className="eng-introduction">
          <p className="eng-eyebrow">Software engineering & quality automation</p>
          <p className="eng-greeting">Hi, I’m</p>
          <h1>Jonathan <span>Biro</span></h1>
          <p className="eng-lead">I build software.<br /><span>And figure out why it breaks.</span></p>
          <p className="eng-summary">QA automation and SDET experience at DocMagic and Priceline. A builder’s perspective, a tester’s curiosity, and a focus on software people can rely on.</p>
          <div className="eng-actions">
            <a className="eng-button" href="#work" onClick={e => navigate(e, "work")}>View engineering work</a>
            <External href={SITE_CONFIG.githubUrl}>GitHub</External>
            <External href={SITE_CONFIG.linkedinUrl}>LinkedIn</External>
          </div>
          <p className="eng-delivery-proof">
            This site deploys from <External href={SITE_CONFIG.portfolioRepoUrl}>public GitHub source</External>
            {" "}through <External href={SITE_CONFIG.portfolioActionsUrl}>automated quality checks</External> to Netlify.
          </p>
          </div>
          <figure className="eng-portrait">
            <div className="eng-portrait-frame">
            <img
              src={portrait}
              srcSet={`${portrait128} 128w, ${portrait256} 256w, ${portrait} 400w`}
              sizes="(max-width: 640px) 96px, (max-width: 900px) 220px, 320px"
              alt="Illustrated portrait of Jonathan Biro"
              width="320"
              height="320"
              fetchPriority="high"
            />
            </div>
            <figcaption>Jonathan Biro <span>Engineer · Los Angeles, California</span></figcaption>
          </figure>
        </section>

        <section id="experience" tabIndex={-1} className="eng-section eng-experience">
          <div className="eng-section-heading"><p className="eng-eyebrow"><span className="eng-index">01</span> Career</p><h2>Professional<br />experience.</h2><External href={SITE_CONFIG.linkedinUrl}>Full background on LinkedIn ↗</External></div>
          <ol className="eng-career" aria-label="Employment history, most recent first">
            <li><div className="eng-career-heading"><h3>DocMagic</h3><p className="eng-career-dates"><time dateTime="2022-08">August 2022</time>–present</p></div><p>QA Automation Engineer</p></li>
            <li><div className="eng-career-heading"><h3>Priceline</h3><p className="eng-career-dates">2019–2022 · 3 years, 1 month</p></div><p>Software Development Engineer in Test <span>(2020–2022)</span><br />QA Automation Engineer <span>(2019–2022)</span></p></li>
          </ol>
        </section>

        <section id="work" tabIndex={-1} className="eng-section">
          <div className="eng-section-heading"><p className="eng-eyebrow"><span className="eng-index">02</span> Selected engineering work</p><h2>The product. The code.<br /><em>The checks behind it.</em></h2></div>
          <article className="eng-case">
            <div className="eng-case-overview">
            <div>
            <div className="eng-case-top">
              <div><p className="eng-meta">Independent project / Web application</p><h3>BiroMD <span>— quality engineering</span></h3></div>
            </div>
            <p className="eng-case-intro">I paired frontend development with automated release checks for a medical-practice website. My focus: making sure a patient’s path to a consultation still works after the next change.</p>
            <p className="eng-stack">TypeScript <span> / </span> Next.js <span> / </span> Playwright <span> / </span> GitHub Actions</p>
            <div className="eng-case-source"><External href={repo}>Explore the source code ↗</External></div>
            </div>
            <figure className="eng-project-preview"><img src={publicAsset("projects/biromd.jpg")} srcSet={`${publicAsset("projects/biromd-480.webp")} 480w, ${publicAsset("projects/biromd-640.webp")} 640w, ${publicAsset("projects/biromd-960.webp")} 960w, ${publicAsset("projects/biromd-1440.webp")} 1440w`} sizes="(max-width: 640px) calc(100vw - 112px), (max-width: 900px) calc(100vw - 150px), 540px" alt="BiroMD interface showing the consultation entry point covered by the browser regression tests" width="1440" height="1000" loading="lazy" decoding="async" /><figcaption>BiroMD interface · Project screenshot</figcaption></figure>
            </div>
            <div className="eng-evidence">
              <div><p className="eng-evidence-label">Browser regression</p><h4>Protect the patient journey.</h4><ul><li>Consultation links and mobile navigation</li><li>Keyboard behavior and accessible interactions</li><li>Text contrast across light and dark themes</li></ul><External href={`${repo}/blob/main/tests/site.spec.ts`}>Read the test suite ↗</External></div>
              <div><p className="eng-evidence-label">Release validation</p><h4>Catch what a build can miss.</h4><ul><li>Missing routes and broken internal links</li><li>Sitemap and exported-page mismatches</li><li>Images exceeding the asset budget</li></ul><External href={`${repo}/actions`}>View CI workflows ↗</External></div>
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
          <div><p className="eng-eyebrow"><span className="eng-index">03</span> A bit about me</p><h2>Curious about the why.<br />Practical about the fix.</h2></div>
          <div><p>I’m a QA Automation Engineer and SDET in Los Angeles. I like the part of engineering where a vague “something’s wrong” becomes a clear reproduction, an understood cause, and a fix you can verify.</p><p>Building interfaces alongside their tests keeps me close to both the code and the person using it. My aim is straightforward: useful automation, understandable failures, and fewer surprises when a change ships.</p><External href={SITE_CONFIG.linkedinUrl}>More about my background ↗</External></div>
        </section>

        <section id="contact" tabIndex={-1} className="eng-section eng-contact">
          <div><p className="eng-eyebrow"><span className="eng-index">04</span> Get in touch</p><h2>Let’s build<br /><em>something reliable.</em></h2><p>Software engineering · Automation · SDET</p></div>
          <div className="eng-contact-links"><a className="eng-email" href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a><button type="button" onClick={copyEmail}>Copy email</button><p role="status" aria-live="polite">{copyStatus}</p></div>
        </section>
      </main>
      <footer className="eng-footer"><span>© {new Date().getFullYear()} Jonathan Biro</span><External href={SITE_CONFIG.githubUrl}>GitHub</External><External href={SITE_CONFIG.linkedinUrl}>LinkedIn</External></footer>
    </div>
  </ErrorBoundary>;
}
