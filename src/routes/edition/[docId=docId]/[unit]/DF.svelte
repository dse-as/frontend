<script lang="ts">
	import IIIF from './IIIF.svelte';
	import TextPaged from './TextPaged.svelte';

	let { meta, annot, docId, currentPage } = $props();
</script>

<div data-fassung="DF" class="grid h-full grid-cols-1 overflow-hidden md:grid-cols-2">
	<IIIF {docId} {currentPage} />
	<TextPaged {docId} {currentPage} />
</div>
