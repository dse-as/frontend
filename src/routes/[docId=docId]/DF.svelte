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
		params
	}: {
		docItem: TDocItemsLetters | TDocItemsSmallforms | TDocItemsLongforms | null;
		ceteiData: ProcessedTEI;
		params: any;
	} = $props();

	let urls = $derived(docItem?.manuscript?.iiif_urls ?? []);
	let url = $derived(urls[params.page - 1]);
</script>

<div
	data-fassung="DF"
	class="gap-10 pt-10 xl:grid xl:grid-cols-[auto_45vw_auto] 2xl:grid-cols-[auto_55vw_auto]"
>
	<div></div>
	<aside class="sticky top-0 hidden h-screen w-full flex-col gap-4 overflow-hidden pt-6 xl:block">
		{#if urls.length}
			<IIIF_Viewer {url} />
		{/if}
	</aside>
	<TextPaged {ceteiData} page={params.page} />
</div>
