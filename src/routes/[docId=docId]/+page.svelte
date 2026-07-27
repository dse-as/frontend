<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	import LF from './LF.svelte';
	// import Gallery from './Gallery.svelte';
	import DF from './DF.svelte';
	import DocHeader from './DocHeader.svelte';
	// import Sequences from './Sequences.svelte';
	import { Tabs } from 'bits-ui';

	// import { onMount } from 'svelte';
	// import { findSeqTypeBySeqKey } from '$lib/functions/ease_of_use/findSeqTypeBySeqKey.js';

	import { building } from '$app/environment';
	import { useSearchParams } from 'runed/kit';
	import { schema } from './schemas';

	const params = useSearchParams(schema);

	let { data } = $props();

	let currentMode = $derived(params.mode ?? 'LF');
	// type TDFLF = 'DF' | 'LF';
	// let dflf_default = 'LF' as const;
	// let dflf: TDFLF = $state(dflf_default);
	// let dflf: TDFLF = $derived.by(() =>
	// 	building ? dflf_default : params.mode === 'DF' ? 'DF' : dflf_default
	// );
	$inspect('params.mode: ', params.mode);

	// Current Page
	let currentPage = $derived(building ? 1 : params.page || 1);

	// Current Sequence
	// const currentSeqKey = $derived(building ? null : params.seq);
	// let currentSeq = $derived({ type: findSeqTypeBySeqKey(currentSeqKey), key: currentSeqKey });

	// onMount(() => {
	// 	// get mode from URL
	// 	if (params.mode === 'DF') {
	// 		dflf = 'DF';
	// 	} else if (params.mode === 'LF') {
	// 		dflf = 'LF';
	// 	} else {
	// 		dflf = dflf_default;
	// 		params.mode = dflf_default;
	// 		goto(page.url, { replaceState: true });
	// 	}
	// });
	// Sync 'dflf' state changes to the URL
	// $effect(() => {
	// 	if (building) return;
	// 	params.mode = dflf;
	// 	console.log('updated', params.mode, params.page, params.seq);

	// 	// Use replaceState to avoid adding history entries for every tab switch
	// 	// replaceState('', page.state);
	// });
</script>

<div class="relative flex h-full flex-col items-center gap-6">
	<!-- Sequences -->
	<!-- <Sequences docId={data.resolvedDoc?.docId} {currentSeq} /> -->

	<!-- Metadata -->
	<DocHeader
		docId={data.resolvedDoc?.docId}
		resDoc={data.resolvedDoc}
		ceteiData={data.ceteiData}
		crossRef={data.crossRef}
		{currentPage}
	/>

	<input class="bg-blue-300" type="text" bind:value={params.filter} />
	<p>Value: {params.filter}</p>
	{#if params.mode === 'LF'}
		<p>Hi from LF</p>
	{:else if params.mode === 'DF'}
		<p>Hi from DF</p>
	{/if}

	<!-- DFLF Toggle -->
	<Tabs.Root
		bind:value={params.mode}
		onValueChange={(value) => {
			console.log('new value', value);
		}}
		class="sticky top-10 z-90000 max-w-160 xl:static"
	>
		<Tabs.List class="preset-tabs-list --lg">
			<Tabs.Trigger value="LF" class=" preset-tabs-trigger --left">Lesefassung</Tabs.Trigger>
			<Tabs.Trigger value="DF" class="preset-tabs-trigger --right">
				Diplomatische Fassung
			</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>

	<!-- Thumbnail Gallery -->
	{#if currentMode === 'DF'}
		<!-- <Gallery docItem={data.resolvedDoc?.item} {currentPage} /> -->
	{/if}

	<!-- Content -->
	<div class="w-full grow">
		{#if currentMode === 'LF'}
			<LF docItem={data.resolvedDoc?.item} ceteiData={data.ceteiData} />
		{:else if currentMode === 'DF'}
			<DF docItem={data.resolvedDoc?.item} ceteiData={data.ceteiData} {currentPage} />
		{/if}
	</div>
</div>
