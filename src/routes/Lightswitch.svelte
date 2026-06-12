<script lang="ts">
	import { onMount } from 'svelte';
	import Switch from '$lib/components/ui/Switch.svelte';

	let isChecked = $state(false);
	let darkModeState = $derived(isChecked ? 'dark' : 'light');

	const handleToggleLightswitch = (force = '') => {
		if (force === 'dark') isChecked = true;
		else if (force === 'light') isChecked = false;
		else isChecked = !isChecked;
	};

	// Update Document .dark class
	$effect(() => {
		if (darkModeState === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	});

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
		{#if isChecked}
			<i class="fa-solid fa-sun"></i>
		{:else}
			<i class="fa-solid fa-moon"></i>
		{/if}
	</div>
{/snippet}

<Switch checked={isChecked} onCheckedChange={() => handleToggleLightswitch()} {icon}></Switch>
