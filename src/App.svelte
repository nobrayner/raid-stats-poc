<script lang='ts'>
	import { QueryClientProvider, QueryClient } from '@sveltestack/svelte-query'
	import StatsView from './StatsView.svelte'

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			}
		}
	})
</script>

<QueryClientProvider>
	<StatsView />
</QueryClientProvider>
  