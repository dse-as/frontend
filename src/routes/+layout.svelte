<script lang="ts">
	import './layout.css';
	import '@fortawesome/fontawesome-free/css/solid.min.css';
	import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
	import favicon from '$lib/assets/favicon.svg';
	import Nav from './Nav.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex flex-col">
	<Nav />
</div>

{@render children()}
