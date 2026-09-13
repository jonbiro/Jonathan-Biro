import { FaArrowRight, FaFileDownload, FaGithub, FaLinkedin } from "react-icons/fa";
import SITE_CONFIG from "../config/site";
import headshot from "../assets/headshot.webp";

const Hero = ({ onNavigate }) => (
    <section id="top" tabIndex={-1} className="hero-intro">
        <div className="hero-plane hero-plane-teal" aria-hidden="true" />
        <div className="hero-plane hero-plane-blue" aria-hidden="true" />
        <div className="hero-inner">
            <div>
                <p className="hero-hello">Hello, I’m</p>
                <h1>Jonathan Biro</h1>
                <p className="hero-role">QA Automation Engineer &amp; SDET</p>
                <p className="hero-description">I build web products and the tests that keep them reliable. My focus is practical automation, accessible interfaces, and the details that matter to users.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                    <a href="#work" className="action-primary" onClick={(event) => {
                        if (onNavigate && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                            event.preventDefault(); onNavigate("work");
                        }
                    }}>View selected work <FaArrowRight aria-hidden="true" /></a>
                    <a href={`${import.meta.env.BASE_URL}Jonathan-Biro-Resume.pdf`} download className="action-secondary"><FaFileDownload aria-hidden="true" /> Project résumé</a>
                </div>
                <nav aria-label="Professional profiles" className="hero-socials">
                    <a href={SITE_CONFIG.githubUrl} target="_blank" rel="me noopener noreferrer"><FaGithub aria-hidden="true" /> GitHub<span className="sr-only"> (opens in a new tab)</span></a>
                    <a href={SITE_CONFIG.linkedinUrl} target="_blank" rel="me noopener noreferrer"><FaLinkedin aria-hidden="true" /> LinkedIn<span className="sr-only"> (opens in a new tab)</span></a>
                    <a href={`mailto:${SITE_CONFIG.email}`}>Email me</a>
                </nav>
            </div>
            <figure className="hero-portrait">
                <div className="hero-portrait-frame"><img src={headshot} alt="Jonathan Biro" width="320" height="320" fetchPriority="high" /></div>
                <figcaption>Based in Los Angeles<br /><span>Playwright · TypeScript · React</span></figcaption>
            </figure>
        </div>
    </section>
);
export default Hero;
