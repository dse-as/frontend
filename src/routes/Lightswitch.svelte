<script lang="ts">
	import { onMount } from 'svelte';
	import Switch from '$lib/components/ui/Switch.svelte';

	let isDark = $state(false);
	let darkModeState = $derived(isDark ? 'dark' : 'light');

	const handleToggleLightswitch = (force = '') => {
		if (force === 'dark') isDark = true;
		else if (force === 'light') isDark = false;
		else isDark = !isDark;
		document.documentElement.setAttribute('data-darkModeState', darkModeState);
	};

	onMount(() => {
		// Check the user's preferred color scheme
		const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
		if (prefersDarkScheme) {
			handleToggleLightswitch('dark');
		} else {
			handleToggleLightswitch('light');
		}
	});
</script>

{#snippet icon()}
	<div class="flex h-full w-full items-center justify-center">
		{#if isDark}
			<i class="fa-solid fa-sun"></i>
		{:else}
			<i class="fa-solid fa-moon"></i>
		{/if}
	</div>
{/snippet}

<Switch checked={isDark} onCheckedChange={() => handleToggleLightswitch()} {icon}></Switch>
