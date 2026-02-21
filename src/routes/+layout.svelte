<script lang="ts">
	import './layout.css';
	import '@fortawesome/fontawesome-free/css/solid.min.css';
	import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
	import favicon from '$lib/assets/favicon.svg';
	import Nav from './Nav.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen flex-col">
	<Nav />
</div>
{@render children()}

<style>
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";

	:global(*:focus) {
		@apply ring-2 ring-secondary-200;
		outline: none; /* Overwrite default focus-marker */
	}
</style>
