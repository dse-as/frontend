<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import { updateSearchParams } from '$lib/functions/ease_of_use/updateSearchParams';
	import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
	import { documents as allDocsRaw } from '$lib/data/documents.json';
	import type { TDocuments } from '$lib/types/documents/TDocuments';
	import ThumbList from './ThumbList.svelte';

	const allDocs = allDocsRaw as TDocuments['documents'];

	let buttonRefs: HTMLButtonElement[] = [];
	let containerRef: HTMLDivElement;

	type TItem = {
		pagenum_running: number;
		fac: string;
		page: number;
	};

	let { docItem, params } = $props();

	// Textzeugen
	const tzgIds = $derived(docItem?.metadata.textzeugen_nonedited || []);
	let showTextzeugen = $state(false);

	// Gallery Items
	function collectGalleryItems() {
		const items: TItem[] =
			docItem?.manuscript.iiif_urls.map((el: string, idx: number) => {
				return { pagenum_running: idx + 1, fac: el, page: idx + 1 };
			}) || [];
		return items;
	}

	// Scroll Gallery
	function scrollGalleryToPage(currentPage: number) {
		const btn = buttonRefs[currentPage - 1];
		if (btn && containerRef) {
			const btnLeft = btn.offsetLeft;
			const btnWidth = btn.offsetWidth;
			const containerWidth = containerRef.offsetWidth;

			// Center button in the container
			const scrollPos = btnLeft - (containerWidth - btnWidth) / 2;
			containerRef.scrollTo({ left: scrollPos, behavior: 'smooth' });
		}
	}

	function handleSelectPage(newPage: number) {
		console.log('a', params.page, newPage);
		params.page = newPage;
		console.log('b', params.page, newPage);
	}
	$inspect('gallery inspect page', params.page);

	$effect(() => {
		scrollGalleryToPage(params.page);
	});

	let itemsBefore = $derived(collectGalleryItems()?.slice(0, params.page - 1));
	let itemsCurrent = $derived(collectGalleryItems()[params.page - 1]);
	let itemsAfter = $derived(collectGalleryItems()?.slice(params.page - 0));
</script>

{#snippet thumbItem(
	item: TItem,
	isFirst: boolean = false,
	isLast: boolean = false,
	isCurrent: boolean = false
)}
	<button
		class={[
			`group flex flex-col items-center justify-between px-3 py-3 hover:bg-hover`,
			isFirst && 'rounded-l-thumbbox',
			isLast && 'rounded-r-thumbbox'
			// isCurrent ? 'mx-10' : 'mx-2'
		]}
		onclick={(e) => {
			e.preventDefault();
			handleSelectPage(item.pagenum_running);
		}}
	>
		<IIIF_Thumb
			url={item.fac}
			classesContainer=""
			classes={`min-h-2 h-max mx-2 my-1 flex justify-center items-center ${isCurrent ? 'max-h-25' : 'max-h-12'}`}
			imgClasses={`h-max ${isCurrent ? 'max-h-25 max-w-27' : 'max-h-12 max-w-25'}`}
		/>
		<span class="mt-1 text-sm">Seite {item.page}</span>
	</button>
{/snippet}

<div class="flex w-full flex-col gap-5 overflow-x-auto px-0 py-5 transition-all duration-200">
	{#if tzgIds.length}
		<button
			class="hyperlink self-start rounded-button text-left"
			onclick={() => {
				showTextzeugen = !showTextzeugen;
			}}>Nichtedierte Textzeugen {showTextzeugen ? 'ausblenden' : 'einblenden'}</button
		>
	{/if}
	<div bind:this={containerRef} class="my-2 h-max">
		<ThumbList
			reCenterOn={params.page}
			classesContainer="items-center"
			classesBefore="my-2 h-max"
			classesAfter="my-2 h-max"
			classesCurrent="min-w-25 mx-10 pointer-events-none grayscale-0!"
			doInvertScroll={false}
			isBeforeEmpty={itemsBefore.length === 0}
			isAfterEmpty={itemsAfter.length === 0}
		>
			{#snippet childrenBefore()}
				{#each itemsBefore as item, index (item.page)}
					{#if item}
						{@render thumbItem(item, index === 0, index === itemsBefore.length - 1, false)}
					{:else}<p class="text-warning">MISSING DATA</p>
					{/if}
				{/each}
			{/snippet}
			{#snippet childrenCurrent()}
				{#if itemsCurrent}
					{@render thumbItem(itemsCurrent, true, true, true)}
				{:else}<p class="text-warning">MISSING DATA</p>
				{/if}
			{/snippet}
			{#snippet childrenAfter()}
				{#each itemsAfter as item, index (item.page)}
					{#if item}
						{@render thumbItem(item, index === 0, index === itemsAfter.length - 1, false)}
					{:else}<p class="text-warning">MISSING DATA</p>
					{/if}
				{/each}
				{#if showTextzeugen}
					{#each tzgIds as tzgId (tzgId)}
						{@const { item: resDoc } = resolveDoc(allDocs, tzgId) || { item: null }}
						{@const items = collectGalleryItems()}
						<div
							class="my-0 ml-10 flex w-max items-center justify-start gap-5 overflow-x-auto rounded-card bg-dark-10 px-10 py-1"
						>
							<h6 class="w-50 font-sans text-sm">{resDoc?.name}</h6>
							<!-- <h6 class="w-50 font-sans text-sm">
								{printDateRange(resDoc?.date.from, resDoc?.date.to)}
							</h6> -->
							{#each items as item (item.page)}
								<a
									href={resolve(`/${tzgId}?${page.url.searchParams}`)}
									class="group mx-2 flex flex-col items-center justify-between rounded-thumbbox px-3 py-3 hover:bg-hover"
									onclick={(e) => {
										handleSelectPage(item.page);
									}}
								>
									<IIIF_Thumb
										url={item.fac}
										classesContainer=""
										classes="max-h-[50px]"
										imgClasses="max-h-[50px]"
									/>
									<span class="text-center text-xs">Seite {item.page} <br />({tzgId})</span>
								</a>
							{:else}
								<a class="text-warning" href={resolve(`/${tzgId}`)}>Keine Faksimile gefunden</a>
							{/each}
						</div>
					{/each}
				{/if}
			{/snippet}
		</ThumbList>
	</div>
</div>
