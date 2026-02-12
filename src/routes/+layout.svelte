<script lang="ts">
	import './layout.css';
	import '@fortawesome/fontawesome-free/css/solid.min.css';
	import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<i class="fa-solid fa-circle-dot fa-3x"></i>
<i class="fa-solid fa-coffee"></i>
{@render children()}
