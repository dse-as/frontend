<script lang="ts">
	import IIIF_Viewer from './IIIF_Viewer.svelte';
	import TextPaged from './TextPaged.svelte';

	let { docItem, ceteiData, currentPage } = $props();
	let urls = $derived(docItem?.manuscript?.iiif_urls ?? []);
	let url = $derived(urls[currentPage - 1]);
</script>

<div data-fassung="DF" class="grid h-[70vh] grid-cols-1 overflow-hidden md:grid-cols-2">
	{#if urls.length}
		<div class="flex h-full w-full items-center justify-center">
			<IIIF_Viewer {url} {currentPage} />
		</div>
	{/if}
	<TextPaged {ceteiData} />
</div>
