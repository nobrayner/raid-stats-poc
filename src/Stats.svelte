<script lang='ts'>
  import { useQuery } from '@sveltestack/svelte-query'
  import { getRepoDetails, getAllCommitsSince } from './queries'
  import { getStatsFromCommits } from './utils'

  const repoDetails = useQuery<PullStats, Error>('prDetails', getRepoDetails)
  let createdAt: string
  $: createdAt = $repoDetails.data?.createdAt as string

  const commitResults = useQuery<CommitResult, Error>(
    ['commits', createdAt],
    () => getAllCommitsSince(createdAt),
    {
      enabled: !!createdAt
    }
  )
  $: {
    commitResults.setOptions(
      ['commits', createdAt],
      () => getAllCommitsSince(createdAt),
      {
        enabled: !!createdAt
      }
    )
  }

  let userStats: UserStats[]
  $: userStats = getStatsFromCommits($commitResults.data?.nodes)
</script>

{#if $repoDetails.isLoading}
  <p>Loading...</p>
{:else if $repoDetails.error}
  <p>{$repoDetails.error?.message}</p>
{:else}
  <p>Adds: {$repoDetails.data?.additions}</p>
  <p>Dels: {$repoDetails.data?.deletions}</p>
  <p>Files: {$repoDetails.data?.changedFiles}</p>
{/if}


{#if $commitResults.isIdle}
  <p>Waiting...</p>
{:else if $commitResults.isLoading}
  <p>Loading...</p>
{:else if $commitResults.error}
  <p>{$commitResults.error?.message}</p>
{:else}
  {#each userStats ?? [] as userStat  (userStat.user)}
    <p>{userStat.user}</p>
  {/each}
{/if}