<script lang='ts'>
	import { QueryClientProvider } from '@sveltestack/svelte-query'
	import Stats from './Stats.svelte'
</script>
  
<style>
:global(body) {
	margin: 0;
	font-family: Arial, Helvetica, sans-serif;
	background-color: #f9f6f6;
	color: #333;
	min-height: 100vh;
	font-size: 1.75rem;
}
</style>

<QueryClientProvider>
	<Stats />
</QueryClientProvider>
  