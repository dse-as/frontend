<script lang="ts">
	import IIIF_Viewer from './IIIF_Viewer.svelte';
	import TextPaged from './TextPaged.svelte';

	let { docMeta, ceteiData, currentPage } = $props();
	let urls = $derived(docMeta?.manuscript?.iiif_urls ?? []);
	let url = $derived(urls[currentPage - 1]);
	$inspect(url); //! FIX: when removed, the IIIF_Viewer stops updating... strange.
</script>

<div data-fassung="DF" class="grid h-[70vh] grid-cols-1 overflow-hidden md:grid-cols-2">
	{#if urls.length}
		<IIIF_Viewer iiif_url={url} />
	{/if}
	<TextPaged {ceteiData} />
</div>
