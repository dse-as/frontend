<script lang="ts">
	import { page } from '$app/state';
	import { goto, replaceState } from '$app/navigation';

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
	<Sequences docId={data.docId} {currentSeq} />

	<!-- Metadata -->
	<DocHeader
		docId={data.docId}
		docType={data.docType}
		docItem={data.docItem}
		ceteiData={data.ceteiData}
		{currentPage}
	/>

	<!-- DFLF Toggle -->
	<Tabs.Root bind:value={dflf} class="sticky top-10 z-90000 xl:static">
		<Tabs.List
			class="border-(--surface-800)-200 mx-2 grid grid-cols-2 rounded-full border-[1.5px] bg-tabs-inactive text-base leading-[0.01em] font-semibold text-tabs-inactive-foreground"
		>
			<Tabs.Trigger
				value="LF"
				class="h-10 max-w-60 rounded-l-full px-4 hover:bg-tabs-hover hover:text-tabs-hover-foreground data-[state=active]:bg-tabs-active data-[state=active]:text-tabs-active-foreground"
			>
				<p class="overflow-hidden leading-normal text-ellipsis whitespace-nowrap">Lesefassung</p>
			</Tabs.Trigger>
			<Tabs.Trigger
				value="DF"
				class="h-10 max-w-60 rounded-r-full px-4 hover:bg-tabs-hover hover:text-tabs-hover-foreground data-[state=active]:bg-tabs-active data-[state=active]:text-tabs-active-foreground"
			>
				<p class="overflow-hidden leading-normal text-ellipsis whitespace-nowrap">
					Diplomatische Fassung
				</p>
			</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>

	<!-- Thumbnail Gallery -->
	{#if dflf === 'DF'}
		<Gallery docItem={data.docItem} {currentPage} />
	{/if}

	<!-- Content -->
	<div class="w-full grow">
		{#if dflf === 'LF'}
			<LF docId={data.docId} docItem={data.docItem} ceteiData={data.ceteiData} />
		{:else if dflf === 'DF'}
			<DF docItem={data.docItem} ceteiData={data.ceteiData} {currentPage} />
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	:global(.note) {
		:global(span[data-type='quote']::before) {
			content: '«';
		}
		:global(span[data-type='quote']::after) {
			content: '»';
		}
		:global(span[data-type='quote']) {
			@apply bg-(--surface-100) italic;
		}
	}

	:global([data-fassung='DF']),
	:global([data-fassung='LF']) {
		/* Currently LF = fluid and DF = paged, but this could change. */
		:global([data-textflow='fluid']),
		:global([data-textflow='paged']) {
			/* Entities */
			:global([data-type='entity']) {
				@apply underline decoration-2;
			}

			/* Quotes */
			:global([data-type='quote']::before) {
				content: '«';
			}
			:global([data-type='quote']::after) {
				content: '»';
			}

			/* Structure */
			:global([data-type='head']) {
				@apply text-2xl font-bold;
			}
			:global([data-type='pagebreak']) {
			}

			/* Choice */
			:global([data-type='choice']) {
				@apply rounded-xl border-2;
			}
			:global([data-type='sic']) {
				@apply line-through decoration-red-500 decoration-3;
			}
			:global([data-type='corr']) {
				@apply text-green-500;
			}

			/* Notes */
			:global([data-type='mark'][data-marktype='single-annotation']:hover),
			:global([data-type='mark'][data-marktype='single-annotation'].active) {
				@apply cursor-pointer bg-(--primary-50) text-(--surface-950);
				content: '[';
			}
			:global([data-type='mark'][data-marktype='single-annotation'].active) {
				@apply bg-(--primary-100);
			}
			:global([data-type='markend']) {
				@apply rounded-full bg-(--primary-50) px-1 align-super text-sm;
			}
			:global([data-type='markend'].active) {
				@apply bg-(--primary-100);
			}
			:global([data-type='markend']:not(.active):hover) {
				@apply cursor-pointer bg-(--primary-400);
			}
			:global([data-type='markend'])::before {
				content: attr(data-notenum);
			}
		}
	}
</style>
