<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	import LF from './LF.svelte';
	import Gallery from './Gallery.svelte';
	import DF from './DF.svelte';
	import DocHeader from './DocHeader.svelte';
	import Sequences from './Sequences.svelte';
	import { ToggleGroup } from 'bits-ui';

	import { onMount } from 'svelte';
	import { findSeqTypeBySeqKey } from '$lib/functions/ease_of_use/findSeqTypeBySeqKey.js';

	import { building } from '$app/environment';

	let { data } = $props();

	type TDFLF = 'DF' | 'LF';
	let dflf: TDFLF = $derived.by(() =>
		building ? 'LF' : page.url.searchParams?.get('mode') === 'DF' ? 'DF' : 'LF'
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
		} else {
			// fallback (default)
			const url = new URL(page.url);
			url.searchParams.set('mode', 'LF');
			dflf = 'LF';
			goto(url, { replaceState: true });
		}
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
	<ToggleGroup.Root
		type="single"
		bind:value={dflf}
		class="grid grid-cols-2 rounded-full border-[1.5px] border-surface-800-200 text-base leading-[0.01em] font-semibold"
	>
		<ToggleGroup.Item
			value="LF"
			class="h-10 w-60 rounded-l-full data-[state=on]:bg-tabs-active data-[state=on]:text-tabs-active-foreground"
		>
			<p>Lesefassung</p>
		</ToggleGroup.Item>
		<ToggleGroup.Item
			value="DF"
			class="h-10 w-60 rounded-r-full data-[state=on]:bg-tabs-active data-[state=on]:text-tabs-active-foreground"
		>
			<p>Diplomatische Fassung</p>
		</ToggleGroup.Item>
	</ToggleGroup.Root>

	<!-- Thumbnail Gallery -->
	{#if dflf === 'DF'}
		<Gallery docItem={data.docItem} {currentPage} />
	{/if}

	<!-- Content -->
	<div class="h-[90vh] w-full grow overflow-hidden">
		{#if dflf === 'LF'}
			<LF docId={data.docId} docItem={data.docItem} ceteiData={data.ceteiData} />
		{:else if dflf === 'DF'}
			<DF docItem={data.docItem} ceteiData={data.ceteiData} {currentPage} />
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";

	:global(.note) {
		:global(span[data-type='quote']::before) {
			content: '«';
		}
		:global(span[data-type='quote']::after) {
			content: '»';
		}
		:global(span[data-type='quote']) {
			@apply bg-surface-100 italic;
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
				@apply cursor-pointer bg-primary-50-950 text-surface-950;
				content: '[';
			}
			:global([data-type='mark'][data-marktype='single-annotation'].active) {
				@apply bg-primary-100-900;
			}
			:global([data-type='markend']) {
				@apply rounded-full bg-primary-50-950 px-1 align-super text-sm;
			}
			:global([data-type='markend'].active) {
				@apply bg-primary-100-900;
			}
			:global([data-type='markend']:not(.active):hover) {
				@apply cursor-pointer bg-primary-400-600;
			}
			:global([data-type='markend'])::before {
				content: attr(data-notenum);
			}
		}
	}
</style>
