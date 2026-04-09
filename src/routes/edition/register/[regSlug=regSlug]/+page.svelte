<script lang="ts">
	import { page } from '$app/state';
	import { register as reg } from '$lib/data/register.json';
	import RegContent from './RegContent.svelte';
	import RegList from './RegList.svelte';
	import { findKeyBySlug } from '$lib/functions/findKeyBySlug';
	import { onMount } from 'svelte';

	let regSlug: string = $derived(page.params.regSlug);
	const firstOrderKeys = Object.keys(reg) as Array<keyof typeof reg>;

	let regType: string | null = $derived(findKeyBySlug(reg, regSlug));
	// const secondOrderKeys = [regType].flatMap((key) => Object.keys(reg[key]) as Array<string>);

	let { data } = $props();

	function preventVerticalScroll() {
		// Get the current horizontal position
		const scrollX = window.scrollX;

		// Force the window to scroll vertically to 0
		window.scrollTo(scrollX, 0);
	}
	onMount(() => {
		preventVerticalScroll(); // Call when component mounts

		// Prevent vertical scroll on hash change
		window.addEventListener('hashchange', preventVerticalScroll);
	});

	$effect(() => {
		// Prevent scroll on initial hash load
		const hash = window.location.hash;
		if (hash) {
			const targetElement = document.getElementById(hash.substring(1));
			if (targetElement) {
				// Get horizontal scroll position and scroll back to top
				const scrollX = targetElement.getBoundingClientRect().left + window.scrollX;
				window.scrollTo(scrollX, 0);
			}
		}
	});
</script>

{#if firstOrderKeys.includes(regSlug)}
	<div class="absolute top-50 left-0 h-full w-full px-5">
		<RegList isMultiColumn={true} regType={regSlug} />
	</div>
{:else}
	<div class="absolute mt-10 grid h-full w-full grid-cols-[auto_1fr] overflow-y-auto">
		<RegList isMultiColumn={false} {regType} {regSlug} />
		<RegContent
			{regType}
			attributes={reg[regType]?.[regSlug]}
			regId={regSlug}
			metadata={data.meta}
		/>
	</div>
{/if}
