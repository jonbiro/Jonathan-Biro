import { motion } from "framer-motion";
import headshot from "../assets/headshot.jpg";
import headshotWebp from "../assets/headshot.webp";
import MagneticButton from "./ui/MagneticButton";
import SITE_CONFIG from "../config/site";

const About = ({ motionEnabled = true, pointerEffectsEnabled = true }) => {
    const leftRevealProps = {
        initial: motionEnabled ? { opacity: 0, x: -50 } : false,
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: motionEnabled ? 0.8 : 0 },
    };

    const rightRevealProps = {
        initial: motionEnabled ? { opacity: 0, x: 50 } : false,
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: motionEnabled ? 0.8 : 0 },
    };

    return (
        <section id="about" className="py-20 md:py-32 px-4 max-w-7xl mx-auto" style={{ contentVisibility: 'auto' }}>
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                <motion.div {...leftRevealProps} className="w-full md:w-5/12 flex justify-center md:justify-end">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <picture>
                            <source srcSet={headshotWebp} type="image/webp" />
                            <img
                                src={headshot}
                                alt="Jonathan Biro"
                                loading="eager"
                                decoding="async"
                                fetchPriority="high"
                                className="relative w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-500"
                                width="320"
                                height="320"
                            />
                        </picture>
                    </div>
                </motion.div>

                <motion.div {...rightRevealProps} className="w-full md:w-7/12">
                    <div className="mb-6">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white block">About Me</h2>
                    </div>

                    <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                        <p>
                            Hello! I'm {SITE_CONFIG.fullName}, a <span className="text-white font-semibold">QA Automation Engineer & SDET</span> based in Los Angeles, California.
                        </p>
                        <p>
                            I am driven by the pursuit of flawless digital experiences. To me, Quality Assurance isn't just about finding bugs—it's about <span className="text-secondary">engineering confidence</span>. I thrive on the challenge of dissecting complex systems and building automated safety nets that allow teams to innovate without fear.
                        </p>
                        <p>
                            My passion for automation stems from a desire to make software resilient and scalable. I believe that a robust test infrastructure is the backbone of any successful product, ensuring that every deployment is better than the last.
                        </p>

                        <div className="py-4">
                            <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Tech Stack</h3>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { name: "Playwright", category: "automation", url: "https://playwright.dev" },
                                    { name: "Webdriver.io", category: "automation", url: "https://webdriver.io" },
                                    { name: "Cypress", category: "automation", url: "https://www.cypress.io" },
                                    { name: "Selenium", category: "automation", url: "https://www.selenium.dev" },
                                    { name: "Appium", category: "automation", url: "https://appium.io" },
                                    { name: "TypeScript", category: "language", url: "https://www.typescriptlang.org" },
                                    { name: "JavaScript", category: "language", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
                                    { name: "Jenkins", category: "tool", url: "https://www.jenkins.io" },
                                    { name: "GitHub Actions", category: "tool", url: "https://github.com/features/actions" },
                                    { name: "Docker", category: "tool", url: "https://www.docker.com" },
                                    { name: "Cucumber", category: "testing", url: "https://cucumber.io" },
                                    { name: "Jest", category: "testing", url: "https://jestjs.io" },
                                    { name: "Postman", category: "testing", url: "https://www.postman.com" },
                                    { name: "SQL", category: "language", url: "https://www.postgresql.org" },
                                    { name: "React.js", category: "frontend", url: "https://react.dev" },
                                ].map((skill, index) => {
                                    const categoryStyles = {
                                        automation: "hover:border-primary/60 hover:text-primary hover:bg-primary/5",
                                        testing: "hover:border-secondary/60 hover:text-secondary hover:bg-secondary/5",
                                        language: "hover:border-accent/60 hover:text-accent hover:bg-accent/5",
                                        tool: "hover:border-white/40 hover:text-white hover:bg-white/10",
                                        frontend: "hover:border-white/40 hover:text-white hover:bg-white/10",
                                    };
                                    return (
                                        <a
                                            key={index}
                                            href={skill.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 transition-all duration-300 hover:scale-105 active:scale-95 ${categoryStyles[skill.category] || "hover:border-white/40"}`}
                                        >
                                            {skill.name}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        <MagneticButton enabled={pointerEffectsEnabled} className="inline-block mt-8">
                            <a
                                href={SITE_CONFIG.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-all text-sm uppercase tracking-wider"
                            >
                                Download Resume
                            </a>
                        </MagneticButton>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
