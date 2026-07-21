<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	import LF from './LF.svelte';
	import Gallery from './Gallery.svelte';
	import DF from './DF.svelte';
	import DocHeader from './DocHeader.svelte';
	import Sequences from './Sequences.svelte';
	import { Tabs } from 'bits-ui';

	import { onMount } from 'svelte';
	import { findSeqTypeBySeqKey } from '$lib/functions/ease_of_use/findSeqTypeBySeqKey.js';

	import { building } from '$app/environment';

	let { data } = $props();

	type TDFLF = 'DF' | 'LF';
	let dflf_default = 'LF' as const;
	// let dflf: TDFLF = $state(dflf_default);
	let dflf: TDFLF = $derived.by(() =>
		building ? dflf_default : page.url.searchParams?.get('mode') === 'DF' ? 'DF' : dflf_default
	);

	// Current Page
	let currentPage = $derived(building ? 1 : Number(page.url.searchParams?.get('page')) || 1);

	// Current Sequence
	const currentSeqKey = $derived(building ? null : page.url.searchParams.get('seq'));
	let currentSeq = $derived({ type: findSeqTypeBySeqKey(currentSeqKey), key: currentSeqKey });

	onMount(() => {
		// get mode from URL
		if (page.url.searchParams?.get('mode') === 'DF') {
			dflf = 'DF';
		} else if (page.url.searchParams?.get('mode') === 'LF') {
			dflf = 'LF';
		} else {
			dflf = dflf_default;
			page.url.searchParams.set('mode', dflf_default);
			goto(page.url, { replaceState: true });
		}
	});
	// Sync 'dflf' state changes to the URL
	$effect(() => {
		if (building) return;
		page.url.searchParams.set('mode', dflf);

		// Use replaceState to avoid adding history entries for every tab switch
		// replaceState('', page.state);
	});
</script>

<div class="relative flex h-full flex-col items-center gap-6">
	<!-- Sequences -->
	<Sequences docId={data.resolvedDoc?.docId} {currentSeq} />

	<!-- Metadata -->
	<DocHeader
		docId={data.resolvedDoc?.docId}
		resDoc={data.resolvedDoc}
		ceteiData={data.ceteiData}
		crossRef={data.crossRef}
		{currentPage}
	/>

	<!-- DFLF Toggle -->
	<Tabs.Root bind:value={dflf} class="sticky top-10 z-90000 max-w-160 xl:static">
		<Tabs.List class="preset-tabs-list --lg">
			<Tabs.Trigger value="LF" class=" preset-tabs-trigger --left">Lesefassung</Tabs.Trigger>
			<Tabs.Trigger value="DF" class="preset-tabs-trigger --right">
				Diplomatische Fassung
			</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>

	<!-- Thumbnail Gallery -->
	{#if dflf === 'DF'}
		<Gallery docItem={data.resolvedDoc?.item} {currentPage} />
	{/if}

	<!-- Content -->
	<div class="w-full grow">
		{#if dflf === 'LF'}
			<LF docItem={data.resolvedDoc?.item} ceteiData={data.ceteiData} />
		{:else if dflf === 'DF'}
			<DF docItem={data.resolvedDoc?.item} ceteiData={data.ceteiData} {currentPage} />
		{/if}
	</div>
</div>
