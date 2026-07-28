<script lang="ts">
	import LF from './LF.svelte';
	import Gallery from './Gallery.svelte';
	import DF from './DF.svelte';
	import DocHeader from './DocHeader.svelte';
	import Sequences from './Sequences.svelte';
	import { Tabs } from 'bits-ui';

	import { page } from '$app/state';
	import { useSearchParams } from 'runed/kit';

	import { schema, validSeqKeys } from './schemas';
	import { cleanupSearchParams } from '$lib/functions/searchParams/cleanupSearchParams.js';

	const params = useSearchParams(schema, { noScroll: true });

	$effect(() => {
		cleanupSearchParams(page.url, schema, validSeqKeys);
	});

	let { data } = $props();
</script>

<div class="relative flex h-full flex-col items-center gap-6">
	<!-- Sequences -->
	<Sequences docId={data.resolvedDoc?.docId} {params} {validSeqKeys} />

	<!-- Metadata -->
	<DocHeader
		docId={data.resolvedDoc?.docId}
		resDoc={data.resolvedDoc}
		ceteiData={data.ceteiData}
		crossRef={data.crossRef}
		{params}
	/>

	<!-- DFLF Toggle -->
	<Tabs.Root bind:value={params.mode} class="sticky top-10 z-90000 max-w-160 xl:static">
		<Tabs.List class="preset-tabs-list --lg">
			<Tabs.Trigger value="LF" class=" preset-tabs-trigger --left">Lesefassung</Tabs.Trigger>
			<Tabs.Trigger value="DF" class="preset-tabs-trigger --right">
				Diplomatische Fassung
			</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>

	<!-- Thumbnail Gallery -->
	{#if params.mode === 'DF'}
		<Gallery docItem={data.resolvedDoc?.item} {params} />
	{/if}

	<!-- Content -->
	<div class="w-full grow">
		{#if params.mode === 'LF'}
			<LF docItem={data.resolvedDoc?.item} ceteiData={data.ceteiData} {params} />
		{:else if params.mode === 'DF'}
			<DF docItem={data.resolvedDoc?.item} ceteiData={data.ceteiData} {params} />
		{/if}
	</div>
</div>
