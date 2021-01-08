export const getStatsFromCommits = (commits: Commit[] | undefined): UserStats[] => {
  if (!commits) return []
  return Object.values(commits.reduce<{ [key: string]: UserStats }>((stats, commit) => {
    if (
      !commit.author?.user?.login // Skip over null users
      || commit.parents.totalCount > 1
      ) {
      console.log(commit)
      return stats
    }

    if (commit.author.user.login in stats) {
      stats[commit.author.user.login].additions += commit.additions
      stats[commit.author.user.login].deletions += commit.deletions
      stats[commit.author.user.login].netDeletions += Math.abs(commit.additions - commit.deletions)
      stats[commit.author.user.login].changedFiles += commit.changedFiles
      stats[commit.author.user.login].commits += 1
    } else {
      stats[commit.author.user.login] = {
        user: commit.author.user.login,
        additions: commit.additions,
        deletions: commit.deletions,
        netDeletions: Math.abs(commit.additions - commit.deletions),
        changedFiles: commit.changedFiles,
        commits: 1,
      }
    }

    return stats
  }, {})).sort((a, b) => b.netDeletions - a.netDeletions)
}