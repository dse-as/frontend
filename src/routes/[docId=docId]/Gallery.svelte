<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
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

	let { docItem, currentPage } = $props();

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

	function handleSelectPage(currentPage: number) {
		const url = new URL(page.url);
		url.searchParams.set('page', String(currentPage));
		goto(url.toString(), { noScroll: true });
	}

	let updatePageParam = $derived((currentPage: number): string => {
		const url = new URL(page.url);
		url.searchParams.set('page', String(currentPage));
		return url.pathname + url.search;
	});

	$effect(() => {
		scrollGalleryToPage(currentPage);
	});

	let itemsBefore = $derived(collectGalleryItems().slice(0, currentPage - 1));
	let itemsCurrent = $derived(collectGalleryItems()[currentPage - 1]);
	let itemsAfter = $derived(collectGalleryItems().slice(currentPage - 0));
</script>

{#snippet thumbItem(item: TItem, isFirst: boolean = false, isLast: boolean = false)}
	<a
		href={updatePageParam(item.pagenum_running)}
		class={[
			`group flex flex-col items-center justify-center p-0 px-2 hover:bg-dark-10`,
			isFirst && 'rounded-l-thumbbox',
			isLast && 'rounded-r-thumbbox'
		]}
		onclick={(e) => {
			e.preventDefault();
			handleSelectPage(item.pagenum_running);
		}}
	>
		<IIIF_Thumb url={item.fac} classes="max-h-[50px]" />
		<span class="text-sm">Seite {item.page}</span>
	</a>
{/snippet}

<div class="flex w-full flex-col gap-5 overflow-x-auto p-5 transition-all duration-200">
	{#if tzgIds.length}
		<button
			class="self-start rounded-button text-left underline"
			onclick={() => {
				showTextzeugen = !showTextzeugen;
			}}>Nichtedierte Textzeugen {showTextzeugen ? 'ausblenden' : 'einblenden'}</button
		>
	{/if}
	<div bind:this={containerRef} class="my-2 h-[100px]">
		<ThumbList
			rerun={currentPage}
			classesCurrent="min-w-25"
			isBeforeEmpty={itemsBefore.length === 0}
			isAfterEmpty={itemsAfter.length === 0}
		>
			{#snippet childrenBefore()}
				{#each itemsBefore as item, index (item.page)}
					{@render thumbItem(item, index === 0, index === itemsBefore.length - 1)}
				{/each}
			{/snippet}
			{#snippet childrenCurrent()}
				{@render thumbItem(itemsCurrent, true, true)}
			{/snippet}
			{#snippet childrenAfter()}
				{#each itemsAfter as item, index (item.page)}
					{@render thumbItem(item, index === 0, index === itemsAfter.length - 1)}
				{/each}
				{#if showTextzeugen}
					{#each tzgIds as tzgId (tzgId)}
						{@const { item: resDoc } = resolveDoc(allDocs, tzgId) || { item: null }}
						{@const items = collectGalleryItems()}
						<div
							class="mx-15 flex w-max items-center justify-start gap-5 overflow-x-auto rounded-card bg-dark-10 px-10"
						>
							<h6 class="w-50 font-serif font-bold">{resDoc?.metadata.label}</h6>
							{#each items as item (item.page)}
								<a
									class="ml-2 rounded-thumbbox p-1"
									href={`${tzgId}?${updateSearchParams(page.url.searchParams, { page: String(item.pagenum_running) })}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<IIIF_Thumb url={item.fac} classes="max-h-[70px]" />
									<span class="hidden text-sm group-hover:block">Seite {item.page}</span>
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
