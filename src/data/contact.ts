/**
 * What the contact form accepts. The form reads these, and api/contact.ts re-checks the same rules on the server.
 * The server keeps its own copy (a Vercel function may not resolve imports from src/), so a test in
 * tests/portfolio.spec.ts fails if the two ever differ. Change them in both places.
 */
export const contactTopics = ['Job Opportunity', 'Project Collaboration', 'General Inquiry']

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const contactLimits = { name: 100, email: 200, topic: 50, message: 5000 }
