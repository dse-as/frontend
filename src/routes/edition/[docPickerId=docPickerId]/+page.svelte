<script lang="ts">
	import DocSummarypage from './DocSummarypage.svelte';
	import List from '$lib/components/List.svelte';
	import { dict_docs as dictDoc } from '$lib/dictionaries/dict_docs.json';
	import { documents as allDocs } from '$lib/data/documents.json';

	import type { TDocTypes, TDocKeys, TDocuments } from '$lib/types/documents/TDocuments.js';

	const allDocsTyped = allDocs as TDocuments['documents'];
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

	//! FIX: This is a workaround to pass the same *absolute* value to List and DocSummarypage
	// Ideally the height would be relative (e.g. h-full).
	// However, this will make overflow its flex content (i.e. the list and linked items).
	const cheatPageHeightInRegSingleColView = 'height:85vh;';
</script>

{#if docType && docSlug}
	{#if data.edView === 'edView2'}
		<!-- Overview with Multi-Column List -->
		<div class="absolute top-45 left-0 w-full px-10">
			<List
				itemVariant="documents"
				isMultiColumn={true}
				itemData={allDocsTyped[docType]}
				itemDict={dictDoc[docType]}
				itemType={docSlug as TDocTypes}
				itemKey={null}
			/>
		</div>
	{:else}
		<!-- Detail View with Single-Column List and Content -->
		<div class="relative mt-24 grid h-full w-full grid-cols-[auto_1fr] gap-4">
			<List
				itemVariant="documents"
				isMultiColumn={false}
				itemData={allDocsTyped[docType]}
				itemDict={dictDoc[docType]}
				itemType={docType}
				itemKey={docSlug as TDocKeys}
				{cheatPageHeightInRegSingleColView}
			/>
			{#if data.resDoc}
				<DocSummarypage
					resDoc={data.resDoc}
					crossRef={data.crossRef}
					{cheatPageHeightInRegSingleColView}
				/>
			{/if}
		</div>
	{/if}
{/if}
