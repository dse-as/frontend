<script lang="ts">
	import { page } from '$app/state';

	import { smallforms_meta } from '$lib/data/smallforms_meta.json';

	import IIIF_Thumb from './IIIF_Thumb.svelte';
	import IIIF_Viewer from './IIIF_Viewer.svelte';
	let docId = page.params.docId;
	let urls = smallforms_meta[docId].manuscript.iiif_urls;
</script>

{#each urls as url}
	<IIIF_Thumb iiif_url={url} size="100" />
{/each}

<IIIF_Viewer iiif_url={urls[0]} />
