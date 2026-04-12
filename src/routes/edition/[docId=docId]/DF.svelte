<script lang="ts">
	import IIIF_Viewer from './IIIF_Viewer.svelte';
	import TextPaged from './TextPaged.svelte';

	let { docMeta, ceteiData } = $props();
	let urls = $derived(docMeta?.manuscript?.iiif_urls ?? []);
</script>

<div data-fassung="DF" class="grid h-full grid-cols-1 overflow-hidden md:grid-cols-2">
	{#if urls.length}
		<IIIF_Viewer iiif_url={urls[0]} />
	{/if}
	<TextPaged {ceteiData} />
</div>
