const DEFAULT_SITE_URL = "https://biro.dev";
const normalizedSiteUrl = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");

const SITE_CONFIG = {
    siteUrl: normalizedSiteUrl,
    fullName: "Jonathan Biro",
    title: "Jonathan Biro | QA Automation Engineer & SDET",
    description:
        "QA Automation Engineer & SDET specializing in building robust test frameworks with Playwright and Cypress. Engineering confidence through scalable automation architecture and CI/CD integration.",
    location: "Los Angeles, CA",
    email: "jonathan@biro.dev",
    githubUrl: "https://github.com/jonbiro",
    linkedinUrl: "https://www.linkedin.com/in/jonathanbiro/",
    resumeUrl: "https://www.kickresume.com/cv/biro-cv/",
};

export default SITE_CONFIG;
