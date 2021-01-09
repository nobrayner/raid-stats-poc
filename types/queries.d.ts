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
  oid: string
  message: string
  author: {
    user: {
      login: string
    }
  }
  repository: {
    nameWithOwner: string
  }
  additions: number
  deletions: number
  parents: {
    totalCount: number
  }
}