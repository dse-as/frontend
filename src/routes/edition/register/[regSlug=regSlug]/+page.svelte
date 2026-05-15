<script lang="ts">
	import RegContent from './RegContent.svelte';
	import { dict_register as dictReg } from '$lib/dictionaries/dict_register.json';

	import type { TRegister, TRegKeysFlat, TRegTypes } from '$lib/types/register/TRegister.js';
	import { onMount } from 'svelte';
	import OverviewList from '$lib/components/OverviewList.svelte';

	let { data } = $props();

	const fullMetaRecord = $derived(data.reg as TRegister['register']);

	const regType = $derived(data.regType || null);
	const regSlug = $derived(data.regSlug || null);

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

	//! FIX: This is a workaround to pass the same *absolute* value to RegList and RegContent
	// Ideally the height would be relative (e.g. h-full).
	// However, this will make overflow its flex content (i.e. the list and linked items).
	const cheatPageHeightInRegSingleColView = 'height:85vh;';
</script>

{#if data.regView === 'regView2'}
	<!-- Overview with Multi-Column List -->
	<div class="absolute top-45 left-0 w-full px-10">
		<OverviewList
			ovVariant="register"
			isMultiColumn={true}
			ovMeta={fullMetaRecord[regType]}
			ovDict={dictReg[regType]}
			ovType={regSlug as TRegTypes}
			ovItem={null}
		/>
	</div>
{:else}
	<!-- Detail View with Single-Column List and Content -->
	<div class="relative mt-24 grid h-full w-full grid-cols-[auto_1fr] gap-4">
		<OverviewList
			ovVariant="register"
			isMultiColumn={false}
			ovMeta={fullMetaRecord[regType]}
			ovDict={dictReg[regType]}
			ovType={regType}
			ovItem={regSlug as TRegKeysFlat}
			{cheatPageHeightInRegSingleColView}
		/>
		<!-- <RegContent
			ovType={regType}
			ovMeta={data.fullMeta}
			regAttributes={data.regAttributes}
			{cheatPageHeightInRegSingleColView}
		/> -->
	</div>
{/if}
