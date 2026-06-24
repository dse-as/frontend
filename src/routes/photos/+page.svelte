<script lang="ts">
	import List from '$lib/components/List.svelte';
	import { dict_docs as dictDoc } from '$lib/dictionaries/dict_docs.json';
	import { documents as allDocs } from '$lib/data/documents.json';

	import type { TDocTypes, TDocuments } from '$lib/types/documents/TDocuments.js';

	const allDocsTyped = allDocs as TDocuments['documents'];
	import { onMount } from 'svelte';
	import DocumentsNav from '$lib/components/DocumentsNav.svelte';
	import IIIFThumb from '$lib/components/IIIF_Thumb.svelte';

	const docType = 'photos';

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
</script>

<!-- Navigation -->
<DocumentsNav docType={'photos'} />
<!-- Large docPicker-Menu  -->
<!-- The animated transition uses the width of the element -->
<h1
	class="h1 absolute top-35 left-0 w-1 pl-10 text-center whitespace-nowrap transition-all duration-400"
>
	{dictDoc[docType as TDocTypes]?.label_plural}
</h1>

<!-- Content -->
<div class="absolute top-45 left-0 w-full px-10">
	<!-- <List
		itemVariant="documents"
		isMultiColumn={true}
		itemData={allDocsTyped[docType as TDocTypes]}
		itemDict={dictDoc[docType as TDocTypes]}
		itemType={docType as TDocTypes}
		itemKey={null}
	/> -->
	<div class="flex h-full w-full flex-wrap gap-sm overflow-y-scroll">
		{#each Object.keys(allDocsTyped.photos) as photo_key}
			{@const item = allDocsTyped[docType][photo_key]}
			<!-- <h1>{item.label}</h1> -->
			<p>
				{item.facsimile.iiif_manifest_emanuscripta
					?.replace(/\/manifest$/, '')
					.replace('/v20/', '/v21/')}
			</p>
			<IIIFThumb
				url={item.facsimile.iiif_manifest_emanuscripta
					?.replace(/\/manifest$/, '')
					.replace('/v20/', '/v21/')}
				classes="min-h-40 min-h-30"
			/>
		{/each}
	</div>
</div>
