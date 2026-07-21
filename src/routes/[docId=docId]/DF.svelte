<script lang="ts">
	import IIIF_Viewer from './IIIF_Viewer.svelte';
	import TextPaged from './TextPaged.svelte';
	import type {
		TDocItemsLetters,
		TDocItemsLongforms,
		TDocItemsSmallforms
	} from '$lib/types/documents/TDocuments';
	import type { ProcessedTEI } from './processTEI';

	let {
		docItem,
		ceteiData,
		currentPage
	}: {
		docItem: TDocItemsLetters | TDocItemsSmallforms | TDocItemsLongforms | null;
		ceteiData: ProcessedTEI;
		currentPage: number;
	} = $props();

	let urls = $derived(docItem?.manuscript?.iiif_urls ?? []);
	let url = $derived(urls[currentPage - 1]);
</script>

<div data-fassung="DF" class="grid h-[70vh] grid-cols-1 overflow-hidden md:grid-cols-2">
	{#if urls.length}
		<div class="container-centered">
			<IIIF_Viewer {url} />
		</div>
	{/if}
	<TextPaged {ceteiData} />
</div>
