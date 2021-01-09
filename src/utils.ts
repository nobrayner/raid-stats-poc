export const getStatsFromCommits = (raidRepoWithOwner: string, commits: Commit[] | undefined): UserStats[] => {
  if (!commits) return []
  return Object.values(commits.reduce<{ [key: string]: UserStats }>((stats, commit) => {
    if (commit.author?.user?.login === 'jackcmeyer') console.log(commit)

    if (
      !commit.author?.user?.login // Exclude null users
      || commit.message.startsWith('Merge') // Exclude Merge commits
      || commit.repository.nameWithOwner !== raidRepoWithOwner // Exclude commits not to the raid repo
    ) {
      return stats
    }

    if (commit.author.user.login in stats) {
      stats[commit.author.user.login].additions += commit.additions
      stats[commit.author.user.login].deletions += commit.deletions
      stats[commit.author.user.login].netDeletions += commit.deletions - commit.additions
      stats[commit.author.user.login].commits += 1
    } else {
      stats[commit.author.user.login] = {
        user: commit.author.user.login,
        additions: commit.additions,
        deletions: commit.deletions,
        netDeletions: commit.deletions - commit.additions,
        commits: 1,
      }
    }

    return stats
  }, {})).sort((a, b) => b.netDeletions - a.netDeletions)
}