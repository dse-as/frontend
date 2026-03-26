<script lang="ts">
	import IIIF_Viewer from './IIIF_Viewer.svelte';
	import TextPaged from './TextPaged.svelte';
	import { page } from '$app/state';
	import { smallforms_meta } from '$lib/data/smallforms_meta.json';

	let { meta, ceteiData, annot, docId, currentPage } = $props();
	let urls = smallforms_meta[docId].manuscript.iiif_urls;
</script>

<div data-fassung="DF" class="grid h-full grid-cols-1 overflow-hidden md:grid-cols-2">
	<IIIF_Viewer iiif_url={urls[0]} />
	<TextPaged {docId} {currentPage} />
</div>
