<script lang="ts">
	import OverviewContent from '$lib/components/OverviewContent.svelte';
	import OverviewList from '$lib/components/OverviewList.svelte';
	import { dict_docs as dictDoc } from '$lib/dictionaries/dict_docs.json';

	import type { TDocTypes, TDocKeys, TDocuments } from '$lib/types/documents/TDocuments.js';
	import { onMount } from 'svelte';

	let { data } = $props();

	const docType = $derived(data.docType || null);
	const docSlug = $derived(data.docSlug || null);

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

	//! FIX: This is a workaround to pass the same *absolute* value to OverviewList and OverviewContent
	// Ideally the height would be relative (e.g. h-full).
	// However, this will make overflow its flex content (i.e. the list and linked items).
	const cheatPageHeightInRegSingleColView = 'height:85vh;';
</script>

{#if docType && docSlug}
	{#if data.edView === 'edView2'}
		<!-- Overview with Multi-Column List -->
		<div class="absolute top-45 left-0 w-full px-10">
			<OverviewList
				ovVariant="documents"
				isMultiColumn={true}
				ovMeta={data.allDocs[docType]}
				ovDict={dictDoc[docType]}
				ovType={docSlug as TDocTypes}
				ovItem={null}
			/>
		</div>
	{:else}
		<!-- Detail View with Single-Column List and Content -->
		<div class="relative mt-24 grid h-full w-full grid-cols-[auto_1fr] gap-4">
			<OverviewList
				ovVariant="documents"
				isMultiColumn={false}
				ovMeta={data.allDocs[docType]}
				ovDict={dictDoc[docType]}
				ovType={docType}
				ovItem={docSlug as TDocKeys}
				{cheatPageHeightInRegSingleColView}
			/>
			{#if data.docItem && data.docId}
				<OverviewContent
					allDocs={data.allDocs}
					{docType}
					docId={data.docId}
					docItem={data.docItem}
					{cheatPageHeightInRegSingleColView}
				/>
			{/if}
		</div>
	{/if}
{/if}
