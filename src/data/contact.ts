/**
 * What the contact form accepts. The form reads these, and api/contact.ts re-checks the same rules on the server.
 * The server keeps its own copy (a Vercel function may not resolve imports from src/), so a test in
 * tests/portfolio.spec.ts fails if the two ever differ. Change them in both places.
 */
/** The choices in the form's topic field. */
export const contactTopics = ['Job Opportunity', 'Project Collaboration', 'General Inquiry']

/** A loose email check: some text, an @, more text, a dot, more text, with no spaces. */
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** The most characters each field may hold. */
export const contactLimits = { name: 100, email: 200, topic: 50, message: 5000 }
