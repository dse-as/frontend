<script lang="ts">
	import { page } from '$app/state';
	import { register as reg } from '$lib/data/register.json';
	import RegContent from './RegContent.svelte';
	import RegList from './RegList.svelte';
	import { findKeyBySlug } from '$lib/functions/ease_of_use/findKeyBySlug.js';
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

	// Boolean for listGrouping (must survive re-mounting of RegList component)
	let groupByCat = $state(false);

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

	const cheatPageHeightInRegSingleColView = 'height:85vh;';
</script>

{#if firstOrderKeys.includes(regSlug)}
	<!-- Overview with Multi-Column List -->
	<div class="absolute top-60 left-0 w-full px-10">
		<RegList isMultiColumn={true} regType={regSlug} bind:groupByCat />
	</div>
{:else}
	<!-- Detail View with Single-Column List and Content -->
	<div class="relative mt-24 grid h-full w-full grid-cols-[auto_1fr] gap-4">
		<RegList
			isMultiColumn={false}
			{regType}
			{regSlug}
			{cheatPageHeightInRegSingleColView}
			bind:groupByCat
		/>
		<RegContent
			{regType}
			attributes={reg[regType]?.[regSlug]}
			regId={regSlug}
			metadata={data.meta}
			{cheatPageHeightInRegSingleColView}
		/>
	</div>
{/if}
