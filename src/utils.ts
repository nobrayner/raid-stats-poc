export const getStatsFromCommits = (commits: Commit[] | undefined): UserStats[] => {
  if (!commits) return []
  return Object.values(commits.reduce<{ [key: string]: UserStats }>((stats, commit) => {
    if (commit.author.user.login in stats) {
      // No op
    } else {
      stats[commit.author.user.login] = {
        user: commit.author.user.login,
        additions: commit.additions,
        deletions: commit.deletions,
        changedFiles: commit.changedFiles,
        commits: 1,
      }
    }

    return stats
  }, {}))
}