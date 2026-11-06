/**
 * Claims that appear in more than one place on the site. Change them here.
 * Each one must stay checkable against a repo, a commit history, or a transcript.
 */
export const facts = {
  gpa: '88%',
  hackathon: { name: 'Hack the Break 2026', placement: 'Top 6 of 36', teams: 36 },
  /** SkillMatch team repo: my commits out of the whole team's. */
  skillmatch: { myCommits: 114, teamCommits: '~245', teamSize: 3 },
} as const

export const hackathonLine = `${facts.hackathon.placement} teams at ${facts.hackathon.name}`
export const commitsLine = `${facts.skillmatch.myCommits} of ${facts.skillmatch.teamCommits} commits`
