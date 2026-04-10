<script lang="ts">
	import IIIF_Viewer from './IIIF_Viewer.svelte';
	import TextPaged from './TextPaged.svelte';

	let { meta, docId } = $props();
	let urls = $derived(meta[docId]?.manuscript?.iiif_urls ?? []);
</script>

<div data-fassung="DF" class="grid h-full grid-cols-1 overflow-hidden md:grid-cols-2">
	{#if urls.length}
		<IIIF_Viewer iiif_url={urls[0]} />
	{/if}
	<TextPaged {docId} />
</div>
