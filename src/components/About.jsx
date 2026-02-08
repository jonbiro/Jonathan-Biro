import { motion } from "framer-motion";
import headshot from "../assets/headshot.jpg";
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
        <section id="about" className="py-20 md:py-32 px-4 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                <motion.div {...leftRevealProps} className="w-full md:w-5/12 flex justify-center md:justify-end">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <img
                            src={headshot}
                            alt="Jonathan Biro"
                            loading="lazy"
                            decoding="async"
                            className="relative w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-500"
                        />
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
                            I'm passionate about technology and its role in our future. My varied employment background gives me a unique insight into multiple fields, such as medical technology, retail sales, and IT support. I am a proud graduate of <span className="text-accent">The Flatiron School</span>.
                        </p>
                        <p>
                            Currently, I specialize in building robust automation frameworks and ensuring software quality.
                        </p>

                        <div className="py-4">
                            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Tech Stack</h3>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    "React.js", "Node.js", "Express.js", "Redux", "React Native",
                                    "Ruby on Rails", "TypeScript", "JavaScript", "HTML", "CSS",
                                    "Bootstrap", "Gatsby.js", "GraphQL"
                                ].map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 hover:bg-white/10 hover:border-primary/50 hover:text-white transition-all cursor-default"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <MagneticButton enabled={pointerEffectsEnabled} className="inline-block mt-8">
                            <a
                                href={SITE_CONFIG.resumeUrl}
                                target="_blank"
                                rel="noreferrer"
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
