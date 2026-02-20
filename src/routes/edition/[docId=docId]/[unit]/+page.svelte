<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	import LF from './LF.svelte';
	import DF from './DF.svelte';
	import MetaHeader from './MetaHeader.svelte';
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

<!-- <div class="absolute flex max-h-full w-full flex-col items-center gap-6 overflow-hidden"> -->
<!-- <div class="absolute flex h-full flex-col items-center gap-6"> -->
<div class="relative flex h-full flex-col items-center gap-6 overflow-auto">
	<!-- Series Menue -->
	<SeriesMenu />
	<!-- Metadata -->
	<MetaHeader metadata={data.meta} docId={page.params.docId} />

	<!-- DFLF Toggle -->
	<button
		onclick={() => {
			dflf = dflf == 'DF' ? 'LF' : 'DF';
		}}
		class={[
			'top-30 left-20 z-1000 w-40 cursor-pointer rounded-full p-2 px-5 font-bold',
			dflf == 'DF'
				? 'bg-surface-200-800 text-surface-800-200'
				: 'bg-surface-800-200 text-surface-200-800'
		]}>{dflf == 'DF' ? 'change to LF' : 'change to DF'}</button
	>

	<!-- Content -->
	{#if dflf === 'LF'}
		<LF
			meta={data.meta}
			text={data.text}
			annot={data.annot}
			docId={page.params.docId}
			{currentPage}
		/>
	{:else if dflf === 'DF'}
		<DF
			meta={data.meta}
			text={data.text}
			annot={data.annot}
			docId={page.params.docId}
			{currentPage}
		/>
	{/if}
</div>
