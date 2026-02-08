const DEFAULT_SITE_URL = "https://yonibiro.dev";
const normalizedSiteUrl = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");

const SITE_CONFIG = {
    siteUrl: normalizedSiteUrl,
    fullName: "Jonathan Biro",
    title: "Jonathan Biro | QA Automation Engineer & SDET",
    description:
        "Portfolio of Jonathan Biro, a QA Automation Engineer and SDET based in Los Angeles, CA. Specializing in test automation, full-stack development, and building robust software frameworks.",
    location: "Los Angeles, CA",
    email: "jonathan@biro.dev",
    githubUrl: "https://github.com/jonbiro",
    linkedinUrl: "https://www.linkedin.com/in/jonathan-biro/",
    resumeUrl: "https://www.kickresume.com/cv/biro-cv/",
};

export default SITE_CONFIG;
