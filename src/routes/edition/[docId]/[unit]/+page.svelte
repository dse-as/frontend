<script lang="ts">
	import { page } from '$app/state';

	import IIIF from './IIIF.svelte';
	let { data } = $props();
</script>

<IIIF meta={data.meta} docId={page.params.docId} />
