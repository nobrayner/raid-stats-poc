import { GraphQLClient, gql } from 'graphql-request'
import { getStatsFromCommits } from './utils'

const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    authorization: 'bearer 66019d362b9bc2e56975c2149ff670f2dd034596'
  }
})

export const getRepoDetails = async () => {
  const result = await client.request(
    gql`
      query pr($name: String!, $owner: String!, $prid: Int!) {
        repository(name: $name, owner: $owner) {
          pullRequest(number: $prid) {
            createdAt
            additions
            deletions
            changedFiles
          }
        }
      }
    `,
    {
      name: 'hospitalrun-frontend',
      owner: 'hospitalrun',
      prid: 2516,
    }
  )

  return result.repository.pullRequest as PullStats
}

export const getAllUserStatsSince = async(since: string, after: string | null): Promise<Commit[]> => {
  const result: CommitResult = (await client.request(
    gql`
    query commits($since: GitTimestamp!, $repo: String!, $owner: String!) {
      repository(name: $repo, owner: $owner) {
        defaultBranchRef  {
          target {
            ... on Commit {
              history(since: $since${after ? `, after: "${after}"` : ''}) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                nodes {
                  abbreviatedOid
                  author {
                    user {
                      login
                    }
                  }
                  additions
                  deletions
                  changedFiles
                  parents(first: 10) {
                    totalCount
                    nodes {
                      repository {
                        nameWithOwner
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    `,
    {
      since,
      repo: 'hospitalrun-frontend',
      owner: 'kcdraidgroup'
    }
  )).repository.defaultBranchRef.target.history

  return result.pageInfo.hasNextPage ? [...result.nodes, ...(await getAllUserStatsSince(since, result.pageInfo.endCursor))] : result.nodes
}