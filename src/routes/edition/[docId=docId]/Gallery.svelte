<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import { updateSearchParams } from '$lib/functions/ease_of_use/updateSearchParams';
	import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';

	let buttonRefs: HTMLButtonElement[] = [];
	let containerRef: HTMLDivElement;

	type TItem = {
		pagenum_running: number;
		fac: string;
		page: number;
	};

	let { allDocs, docItem, currentPage } = $props();

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
		goto(url, { noScroll: true });
	}

	$effect(() => {
		scrollGalleryToPage(currentPage);
	});
</script>

<div class="w-full">
	<div
		class="flex w-full flex-col gap-5 overflow-x-auto rounded-xl border-2 border-surface-500 p-5 transition-all duration-200"
	>
		{#if tzgIds.length}
			<button
				class="self-start rounded-full text-left underline"
				onclick={() => {
					showTextzeugen = !showTextzeugen;
				}}>Nichtedierte Textzeugen {showTextzeugen ? 'ausblenden' : 'einblenden'}</button
			>
		{/if}
		<div bind:this={containerRef} class="flex min-h-50 w-full gap-2 overflow-x-auto px-10">
			{#each collectGalleryItems() as item, index (item.page)}
				<button
					bind:this={buttonRefs[index]}
					class={[
						`flex flex-col items-center justify-center rounded-xl p-2 hover:bg-yellow-100`,
						Number(item.pagenum_running) === currentPage && 'bg-yellow-100'
					]}
					onclick={() => handleSelectPage(item.pagenum_running)}
				>
					<IIIF_Thumb url={item.fac} maxWidth="120" maxHeight="120" classes="rounded-xl" />
					<span class="italic">Seite {item.page}</span>
				</button>
			{/each}
			{#if showTextzeugen}
				{#each tzgIds as tzgId (tzgId)}
					{@const { item: resDoc } = resolveDoc(allDocs, tzgId) || { item: null }}
					{@const items = collectGalleryItems()}
					<div
						class="mx-15 flex w-max items-center justify-start gap-5 overflow-x-auto rounded-2xl bg-surface-300-700 px-10"
					>
						<h6 class="w-50 font-serif font-bold">{resDoc?.metadata.label}</h6>
						{#each items as item (item.page)}
							<a
								class="ml-2 rounded-xl p-1"
								href={`${tzgId}?${updateSearchParams(page.url.searchParams, { page: String(item.pagenum_running) })}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								<IIIF_Thumb url={item.fac} maxWidth="100" maxHeight="100" classes="rounded-xl" />
								<span class="italic">Seite {item.page}</span>
							</a>
						{:else}
							<a class="hover:text-surface-500!" href={resolve(`/edition/${tzgId}`)}
								>Keine Faksimile gefunden</a
							>
						{/each}
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
