<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	import LF from './LF.svelte';
	import DF from './DF.svelte';
	import DocHeader from './DocHeader.svelte';
	import SeriesMenu from './SeriesMenu.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	let currentPage = $state(1);
	type TDFLF = 'DF' | 'LF';
	let dflf: TDFLF = $state('LF');

	onMount(() => {
		if (page.url.searchParams?.get('mode') === 'DF') {
			dflf = 'DF';
		} else {
			// fallback (default)
			let params = page.url.searchParams;
			params.set('mode', 'LF');
			dflf = 'LF';
			//! @sebi: the following redirect works but TS seems not to understand th `${}?${}` syntax...
			goto(resolve(`${page.url.pathname}?${params.toString()}`));
		}
	});
</script>

<div class="relative flex h-full flex-col items-center gap-6 overflow-auto pb-10">
	<!-- Series Menue -->
	<SeriesMenu />
	<!-- Metadata -->
	<DocHeader metadata={data.meta} annot={data.annot} docId={page.params.docId} />

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
	<div class="h-[90vh] w-full grow overflow-hidden px-5">
		{#if dflf === 'LF'}
			<LF meta={data.meta} annot={data.annot} docId={page.params.docId} {currentPage} />
		{:else if dflf === 'DF'}
			<DF meta={data.meta} annot={data.annot} docId={page.params.docId} {currentPage} />
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
			:global([data-type='quote']) {
				@apply bg-amber-100;
			}
			:global([data-type='quote']::before) {
				content: '«';
			}
			:global([data-type='quote']::after) {
				content: '»';
			}
			:global([data-type='quote']) {
				@apply bg-surface-100 italic;
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
			:global([data-type='notestart']::before) {
				@apply rounded-full bg-red-500 px-2 font-bold;
				content: '[';
			}
			:global([data-type='noteend']::after) {
				@apply rounded-full bg-red-500 px-2 font-bold;
				content: ']';
			}
		}
	}
</style>
