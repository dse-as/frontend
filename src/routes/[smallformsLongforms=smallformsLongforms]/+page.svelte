<script lang="ts">
	import List from '$lib/components/List.svelte';
	import { dict_docs as dictDoc } from '$lib/dictionaries/dict_docs.json';
	import { documents as allDocs } from '$lib/data/documents.json';
	import { resolve } from '$app/paths';

	import type { TDocTypes, TDocuments } from '$lib/types/documents/TDocuments.js';

	const allDocsTyped = allDocs as TDocuments['documents'];
	import { onMount } from 'svelte';

	let { data } = $props();

	const docType = $derived(data.docType || null);

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
<nav
	class={[
		'flex transition-all duration-200',
		data.edView === 'edView1'
			? 'mx-auto mt-40  w-2/3 max-w-200 flex-wrap items-center justify-center gap-4 p-2'
			: 'ml-10 h-full w-full gap-2'
	]}
>
	{#each ['smallforms', 'longforms', 'letters', 'images'] as docType (docType)}
		<a
			class={[
				'preset-btn-round',
				data.edView === 'edView1' ? '--2xl' : '--sm',
				data.docType === docType && '--active'
			]}
			href={resolve(`/${docType}`)}
		>
			{dictDoc[docType as TDocTypes]?.label_plural}
		</a>
	{/each}
</nav>

<!-- Large docPicker-Menu  -->
<!-- The animated transition uses the width of the element -->
<h1
	class="h1 absolute top-35 left-0 w-1 pl-10 text-center whitespace-nowrap transition-all duration-400"
>
	{dictDoc[docType as TDocTypes]?.label_plural}
</h1>

<!-- Content -->
<div class="absolute top-45 left-0 w-full px-10">
	<List
		itemVariant="documents"
		isMultiColumn={true}
		itemData={allDocsTyped[docType as TDocTypes]}
		itemDict={dictDoc[docType as TDocTypes]}
		itemType={docType as TDocTypes}
		itemKey={null}
	/>
</div>
