<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	import { dict_docs as dictDoc } from '$lib/dictionaries/dict_docs.json';
	import { documents as allDocs } from '$lib/data/documents.json';
	const allDocsTyped = allDocs as TDocuments['documents'];
	import type { TDocTypes, TDocuments } from '$lib/types/documents/TDocuments.js';

	import DocumentsNav from '$lib/components/DocumentsNav.svelte';
	import IIIFThumb from '$lib/components/IIIF_Thumb.svelte';
	import List from '$lib/components/List.svelte';

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
<h1 class="h1 mb-5 pl-10 whitespace-nowrap transition-all duration-400">
	{dictDoc[docType as TDocTypes]?.label_plural}
</h1>

<!-- Content -->
<div class="h-[calc(100vh-45*4px)] w-full px-10">
	<!-- <List
		itemVariant="documents"
		isMultiColumn={true}
		itemData={allDocsTyped[docType as TDocTypes]}
		itemDict={dictDoc[docType as TDocTypes]}
		itemType={docType as TDocTypes}
		itemKey={null}
	/> -->
	<div
		class="grid h-full w-full grid-cols-1 gap-sm overflow-y-scroll lg:grid-cols-3 xl:grid-cols-5"
	>
		{#each Object.keys(allDocsTyped.photos).slice(100, 150) as photo_key}
			{@const item = allDocsTyped[docType][photo_key]}
			<a
				href={resolve(`/${photo_key}`)}
				class="m-10 flex items-center justify-center gap-5 rounded-card hover:bg-dark-10 lg:flex-col"
			>
				<IIIFThumb
					url={item.faksimile.iiif_image_emanuscripta?.replace('/full/304/0/default.jpg', '')}
					classes="w-[200px] h-[200px]"
				/>
				<p class="text-left lg:text-center">{item.label}</p>
				<p class="text-left lg:text-center">{photo_key}</p>
			</a>
		{/each}
	</div>
</div>
