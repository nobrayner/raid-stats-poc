<script lang='ts'>
  import { useQuery } from '@sveltestack/svelte-query'
  import { getRepoDetails, getAllUserStatsFromRepoSince } from './queries'
  import { getStatsFromCommits } from './utils'

  const originalOwner = 'hospitalrun'
  const prId = 2516

  const raidRepoOwner = 'kcdraidgroup'
  const raidRepo = 'hospitalrun-frontend'

  const repoDetails = useQuery<PullStats, Error>('prDetails', () => getRepoDetails(originalOwner, raidRepo, prId))
  let createdAt: string
  $: createdAt = $repoDetails.data?.createdAt as string

  const commits = useQuery<Commit[], Error>(
    ['commits', createdAt],
    () => getAllUserStatsFromRepoSince(raidRepoOwner, raidRepo, createdAt, null),
    {
      enabled: !!createdAt
    }
  )
  $: {
    commits.setOptions(
      ['commits', createdAt],
      () => getAllUserStatsFromRepoSince(raidRepoOwner, raidRepo, createdAt, null),
      {
        enabled: !!createdAt
      }
    )
  }

  let userStats: UserStats[]
  $: userStats = getStatsFromCommits(`${raidRepoOwner}/${raidRepo}`, $commits.data)
</script>

<style>
  article {
    margin-top: 1rem;
  }

  #user-stats {
    overflow-y: auto;
    height: 80rem;
  }
</style>

{#if $repoDetails.isLoading}
  <p>Loading...</p>
{:else if $repoDetails.error}
  <p>{$repoDetails.error?.message}</p>
{:else}
  <p>Adds: {$repoDetails.data?.additions}</p>
  <p>Dels: {$repoDetails.data?.deletions}</p>
  <p>Files: {$repoDetails.data?.changedFiles}</p>
  <p>Created: {$repoDetails.data?.createdAt}</p>
{/if}


{#if $commits.isIdle}
  <p>Waiting...</p>
{:else if $commits.error}
  <p>{$commits.error?.message}</p>
{:else if $commits.isLoading}
  <p>Loading...</p>
{:else}
  <div id="user-stats">
    {#each userStats ?? [] as userStat, index (userStat.user)}
      <article>
        <p>#{index + 1} {userStat.user}</p>
        <p>Additions: {userStat.additions}</p>
        <p>Deletions: {userStat.deletions}</p>
        <p>Net &nbsp; Dels: {userStat.netDeletions}</p>
        <p># Commits: {userStat.commits}</p>
      </article>
    {/each}
  </div>
{/if}