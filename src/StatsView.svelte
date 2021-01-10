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
  #stats-view {
    --padding-amount: 1rem;
    max-width: 700px;
    height: calc(100vh - (2 * var(--padding-amount)));
    padding: var(--padding-amount);
    margin: 0 auto;
    display: grid;
    grid-template-rows: auto 1fr;
    grid-row-gap: 2rem;
  }

  article {
    background-color: white;
    border: 1px solid hsl(0, 0%, 78%);
    border-radius: 8px;
    padding: 1rem 2rem;
    display: grid;
    grid-gap: 2rem;
    grid-template-columns: 3.75rem auto 8.365rem 3fr;
    grid-template-areas:
      "rank avatar name stats"
    ;
  }
  article:not(:first-child) {
    margin-top: 1rem;
  }

  .rank {
    font-size: 2rem;
    opacity: 0.8;
    grid-area: rank;
    align-self: center;
  }

  .avatar {
    border-radius: 50%;
    width: 6rem;
    height: 6rem;
    grid-area: avatar;
    align-self: center;
  }

  .name {
    grid-area: name;
    align-self: center;
  }

  .stat-block {
    grid-area: stats;
    align-self: center;
  }

  #user-stats {
    overflow-y: auto;
  }

  .emoji-stat {
    font-size: 1.5rem;
    margin-right: 1rem;
  }
  .emoji-stat-light {
    font-size: 1.25rem;
    margin-right: 1rem;
    opacity: 0.8;
  }
</style>

<main id="stats-view">
  <header>
    {#if $repoDetails.isLoading}
      <p>Loading...</p>
    {:else if $repoDetails.error}
      <p>{$repoDetails.error?.message}</p>
      {:else}
      <p><span class="emoji-stat">🚀</span>{$commits.status === 'success' ? `${userStats.length} Contributors` : 'Loading...'}</p>
      <p><span class="emoji-stat">⚔️</span>+{$repoDetails.data?.additions}&emsp;-{$repoDetails.data?.deletions}</p>
      <p><span class="emoji-stat">🔥</span>{($repoDetails.data?.additions ?? 0) - ($repoDetails.data?.deletions ?? 0)} Net Deletions</p>
      <p><span class="emoji-stat">📃</span>{$repoDetails.data?.changedFiles} Changed Files</p>
      <p><span class="emoji-stat">💾</span>{$repoDetails.data?.commits.totalCount} {$repoDetails.data?.commits.totalCount === 1 ? 'Commit' : 'Commits'}</p>
      <!-- <p>Created: {$repoDetails.data?.createdAt}</p> -->
    {/if}
  </header>
  
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
          <p class="rank">#{index + 1}</p>
          <img class="avatar" src="{userStat.avatarUrl}" alt="{userStat.user}'s Profile Image">
          <p class="name">{userStat.user}</p>
          <div class="stat-block">
            <p><span class="emoji-stat-light">⚔️️️️️️</span>+{userStat.additions}&emsp;-{userStat.deletions}</p>
            <p><span class="emoji-stat-light">🔥</span>{userStat.netDeletions} Net Deletions</p>
            <p><span class="emoji-stat-light">💾</span>{userStat.commits} {userStat.commits === 1 ? 'Commit' : 'Commits'}</p>
          </div>
        </article>
      {/each}
    </div>
  {/if}
</main>