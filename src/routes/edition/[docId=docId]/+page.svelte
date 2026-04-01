<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	import LF from './LF.svelte';
	import Gallery from './Gallery.svelte';
	import DF from './DF.svelte';
	import DocHeader from './DocHeader.svelte';
	import Sequences from './Sequences.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	type TDFLF = 'DF' | 'LF';
	let dflf: TDFLF = $derived((page.url.searchParams?.get('mode') as TDFLF) || 'LF');
	let pagenum: Number = $derived(Number(page.url.searchParams?.get('page')) || 1);

	onMount(() => {
		// set mode
		if (page.url.searchParams?.get('mode') === 'DF') {
			dflf = 'DF';
		} else {
			// fallback (default)
			const url = new URL(page.url);
			url.searchParams.set('mode', 'LF');
			dflf = 'LF';
			goto(url);
		}
	});

	// Update mode and page
</script>

<div class="relative flex h-full flex-col items-center gap-6">
	<!-- Sequences -->
	<Sequences
		metadata={data.meta}
		docId={page.params.docId}
		{pagenum}
		currentSeq={data.currentSeq}
	/>

	<!-- Metadata -->
	<DocHeader metadata={data.meta} annot={data.annot} docId={page.params.docId} />

	<!-- Thumbnail Gallery -->
	<Gallery metadata={data.meta} docId={page.params.docId} {pagenum} />

	<!-- DFLF Toggle -->
	<button
		onclick={() => {
			dflf = dflf == 'DF' ? 'LF' : 'DF';
			goto(resolve(`${page.url.pathname}?mode=${dflf}`));
		}}
		class={[
			'top-30 left-20 z-1000 cursor-pointer rounded-full p-2 px-5 font-bold',
			dflf == 'DF'
				? 'bg-surface-300-700 text-surface-950-50'
				: 'bg-surface-700-300 text-surface-100-900'
		]}>{dflf == 'DF' ? 'Zur Lesefassung' : 'Zur diplomatischen Fassung'}</button
	>

	<!-- Content -->
	<div class="h-[90vh] w-full grow overflow-hidden">
		{#if dflf === 'LF'}
			<LF meta={data.meta} annot={data.annot} docId={page.params.docId} {pagenum} />
		{:else if dflf === 'DF'}
			<DF meta={data.meta} annot={data.annot} docId={page.params.docId} {pagenum} />
		{/if}
	</div>
</div>

<style>
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";

	:global([data-fassung='DF']) {
		:global(span[data-type='hyphen'])::after {
			content: '-';
		}
	}

	:global([data-fassung='LF']) {
		:global(
			br,
			span[data-type='hyphen']
			/* delete,
			choice orig,
			choice sic,
			subst delete,
			pagenum,
			substMargin delete */
		) {
			@apply hidden;
		}
	}

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
			:global([data-type='mark'][data-marktype='single-annotation'].highlighted) {
				@apply cursor-pointer bg-primary-50-950 text-surface-950;
				content: '[';
			}
			:global([data-type='mark'][data-marktype='single-annotation'].highlighted) {
				@apply bg-primary-100-900;
			}
			:global([data-type='markend']) {
				@apply rounded-full bg-primary-50-950 px-1 align-super text-sm;
			}
			:global([data-type='markend'].highlighted) {
				@apply bg-primary-100-900;
			}
			:global([data-type='markend']:not(.highlighted):hover) {
				@apply cursor-pointer bg-primary-400-600;
			}
			:global([data-type='markend'])::before {
				content: attr(data-notenum);
			}
		}
	}
</style>
