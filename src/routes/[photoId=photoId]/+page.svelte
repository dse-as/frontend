<script lang="ts">
	import { page } from '$app/state';

	import IIIFThumb from '$lib/components/IIIF_Thumb.svelte';
	import { findSeqTypeBySeqKey } from '$lib/functions/ease_of_use/findSeqTypeBySeqKey.js';
	import IIIFViewer from '../[docId=docId]/IIIF_Viewer.svelte';
	import Sequences from '../[docId=docId]/Sequences.svelte';
	let { data } = $props();
	let imgdata = $derived(data.resolvedPhoto?.item);

	import { building } from '$app/environment';

	// Current Sequence
	const currentSeqKey = $derived(building ? null : page.url.searchParams.get('seq'));
	let currentSeq = $derived({ type: findSeqTypeBySeqKey(currentSeqKey), key: currentSeqKey });
</script>

<div class="relative flex h-full flex-col items-center gap-6">
	<!-- Sequences -->
	<Sequences docId={data.resolvedPhoto?.docId} {currentSeq} />

	<!-- Title -->
	<h1 class="h1">{imgdata?.label}</h1>

	<!-- Image -->
	<IIIFThumb
		iiif_imageAPI_width={800}
		url={imgdata?.faksimile.iiif_image_emanuscripta?.replace('/full/304/0/default.jpg', '')}
	/>

	<!-- <IIIFViewer url={imgdata?.faksimile.iiif_manifest_emanuscripta} /> -->

	<!-- Metadata -->
	<p>{imgdata?.metadata.sla_id_coll}/{imgdata?.metadata.sla_id_img}</p>
	<p>{imgdata?.metadata.date_normalised.from}</p>
</div>
