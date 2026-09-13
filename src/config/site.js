const DEFAULT_SITE_URL = "https://jonathanbiro.com";
const normalizedSiteUrl = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");

const SITE_CONFIG = {
    siteUrl: normalizedSiteUrl,
    fullName: "Jonathan Biro",
    title: "Jonathan Biro | QA Automation Engineer & SDET",
    description:
        "QA Automation Engineer & SDET building reliable Playwright and TypeScript test systems, CI quality gates, and accessible web experiences.",
    location: "Los Angeles, CA",
    email: "jonathan@biro.dev",
    githubUrl: "https://github.com/jonbiro",
    portfolioRepoUrl: "https://github.com/jonbiro/Jonathan-Biro",
    portfolioActionsUrl: "https://github.com/jonbiro/Jonathan-Biro/actions",
    linkedinUrl: "https://www.linkedin.com/in/jonathanbiro/",
};

export default SITE_CONFIG;
