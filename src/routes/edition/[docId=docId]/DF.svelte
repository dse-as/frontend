<script lang="ts">
	import IIIF_Viewer from './IIIF_Viewer.svelte';
	import TextPaged from './TextPaged.svelte';

	let { meta, ceteiData, annot, docId, currentPage } = $props();
	let urls = meta[docId].manuscript.iiif_urls;
</script>

<div data-fassung="DF" class="grid h-full grid-cols-1 overflow-hidden md:grid-cols-2">
	<IIIF_Viewer iiif_url={urls[0]} />
	<TextPaged {docId} {currentPage} />
</div>
