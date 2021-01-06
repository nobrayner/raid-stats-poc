interface PullStats {
  createdAt: string
  additions: number
  deletions: number
  changedFiles: number
}

interface CommitResult {
  pageInfo: {
    hasNextPage: boolean
    endCursor: string | null
  }
  nodes: Commit[]
}

interface Commit {
  abbreviatedOid: string
  author: {
    user: {
      login: string
    }
  }
  additions: number
  deletions: number
  changedFiles: number
  parents: {
    totalCount: number
    nodes: {
      repository: {
        nameWithOwner: string
      }
    }[]
  }
}