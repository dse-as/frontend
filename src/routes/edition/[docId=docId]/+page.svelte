<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	import LF from './LF.svelte';
	import Gallery from './Gallery.svelte';
	import DF from './DF.svelte';
	import DocHeader from './DocHeader.svelte';
	import Sequences from './Sequences.svelte';
	import { ToggleGroup } from '@skeletonlabs/skeleton-svelte';

	import { onMount } from 'svelte';

	let { data } = $props();

	type TDFLF = 'DF' | 'LF';
	let dflf: TDFLF[] = $derived([page.url.searchParams?.get('mode') as TDFLF] || ['LF']);
	let currentPage = $derived(Number(page.url.searchParams?.get('page')) || 1);

	onMount(() => {
		// get mode from URL
		if (page.url.searchParams?.get('mode') === 'DF') {
			dflf = ['DF'];
		} else {
			// fallback (default)
			const url = new URL(page.url);
			url.searchParams.set('mode', 'LF');
			dflf = ['LF'];
			goto(url, { replaceState: true });
		}
	});
</script>

<div class="relative flex h-full flex-col items-center gap-6">
	<!-- Sequences -->
	<Sequences fullMeta={data.fullMeta} docId={data.docId} currentSeq={data.currentSeq} />

	<!-- Metadata -->
	<DocHeader
		docId={data.docId}
		docType={data.docType}
		docMeta={data.docMeta}
		ceteiData={data.ceteiData}
		{currentPage}
	/>

	<!-- DFLF Toggle -->
	<ToggleGroup
		value={dflf}
		onValueChange={(details) => {
			dflf = details.value;
		}}
	>
		<ToggleGroup.Item value="LF" class="h-10 w-60 rounded-l-full border border-surface-950-50">
			<p>Lesefassung</p>
		</ToggleGroup.Item>
		<ToggleGroup.Item value="DF" class="h-10 w-60 rounded-r-full border border-surface-950-50">
			<p>Diplomatische Fassung</p>
		</ToggleGroup.Item>
	</ToggleGroup>

	<!-- Thumbnail Gallery -->
	{#if dflf[0] === 'DF'}
		<Gallery fullMeta={data.fullMeta} docId={data.docId} docMeta={data.docMeta} {currentPage} />
	{/if}

	<!-- Content -->
	<div class="h-[90vh] w-full grow overflow-hidden">
		{#if dflf[0] === 'LF'}
			<LF docId={data.docId} docMeta={data.docMeta} ceteiData={data.ceteiData} />
		{:else if dflf[0] === 'DF'}
			<DF docMeta={data.docMeta} ceteiData={data.ceteiData} {currentPage} />
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
