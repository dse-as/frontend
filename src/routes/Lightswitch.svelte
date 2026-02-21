<script lang="ts">
	import { onMount } from 'svelte';
	import { Switch } from '@skeletonlabs/skeleton-svelte';

	let isDark = $state(false);
	let darkModeState = $derived(isDark ? 'dark' : 'light');

	const handleToggleLightswitch = (force = '') => {
		if (force == 'dark') isDark = true;
		else if (force == 'light') isDark = false;
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

<Switch class="**:text-lg" name="mode" checked={isDark} onCheckedChange={handleToggleLightswitch}>
	<Switch.Control class="bg-surface-200 data-[state=checked]:bg-secondary-300">
		<Switch.Thumb>
			<Switch.Context>
				{#snippet children(switch_)}
					{#if switch_().checked}
						<i class="fa-solid fa-sun"></i>
					{:else}
						<i class="fa-solid fa-moon"></i>
					{/if}
				{/snippet}
			</Switch.Context>
		</Switch.Thumb>
	</Switch.Control>
	<Switch.HiddenInput />
</Switch>
