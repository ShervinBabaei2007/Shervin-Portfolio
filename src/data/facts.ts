/**
 * Claims that appear in more than one place on the site. Change them here.
 * Each one must stay checkable against a repo, a commit history, or a transcript.
 */
export const facts = {
  gpa: '88%',
  hackathon: { name: 'Hack the Break 2026', placement: 'Top 6 of 36', teams: 36 },
  /** SkillMatch team repo (checked against the GitHub API, 2026-05-22 snapshot): my commits and merged PRs out of the team's. */
  skillmatch: { myCommits: 105, teamCommits: '199', myMergedPrs: 28, teamMergedPrs: 64, teamSize: 3 },
} as const

export const hackathonLine = `${facts.hackathon.placement} teams at ${facts.hackathon.name}`
export const mergedPrsLine = `${facts.skillmatch.myMergedPrs} of ${facts.skillmatch.teamMergedPrs} merged PRs`
export const commitsLine = `${facts.skillmatch.myCommits} of ${facts.skillmatch.teamCommits} commits`
