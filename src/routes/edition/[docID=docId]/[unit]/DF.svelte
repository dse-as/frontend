<script lang="ts">
	import IIIF from './IIIF.svelte';
	import TextPaged from './TextPaged.svelte';

	let { meta, text, annot, docID, currentPage } = $props();
</script>

<div class="h-full w-full bg-surface-800-200 text-surface-200-800">
	<h1 class="h1">DF</h1>
	<div class="grid grid-cols-2">
		<IIIF {docID} {currentPage} />
		<TextPaged text={text[docID].text} {currentPage} />
	</div>
</div>
