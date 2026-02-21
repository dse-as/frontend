<script lang="ts">
	import IIIF from './IIIF.svelte';
	import TextPaged from './TextPaged.svelte';

	let { meta, docId, currentPage } = $props();
</script>

<div data-fassung="DF" class="grid h-full grid-cols-2 overflow-hidden">
	<IIIF {docId} {currentPage} />
	<TextPaged {docId} {currentPage} />
</div>
