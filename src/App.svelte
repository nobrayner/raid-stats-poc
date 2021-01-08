<script lang='ts'>
	import { QueryClientProvider, QueryClient } from '@sveltestack/svelte-query'
	import Stats from './Stats.svelte'

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			}
		}
	})
</script>

<QueryClientProvider>
	<Stats />
</QueryClientProvider>
  