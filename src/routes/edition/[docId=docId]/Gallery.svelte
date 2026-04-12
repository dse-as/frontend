<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import { updateSearchParams } from '$lib/functions/ease_of_use/updateSearchParams';

	let buttonRefs: HTMLButtonElement[] = [];
	let containerRef: HTMLDivElement;

	type TItem = {
		pagenum_running: number;
		fac: string;
		page: number;
	};

	let { metadata, docId, pagenum } = $props();

	// Textzeugen
	const textzeugen = $derived(metadata[docId]?.metadata.textzeugen_nonedited || []);
	let showTextzeugen = $state(false);

	// Gallery Items

	function collectGalleryItems(pagenum_running: string) {
		const items: TItem[] =
			metadata[pagenum_running]?.manuscript.iiif_urls.map((el: string, idx: number) => {
				return { pagenum_running: idx + 1, fac: el, page: idx + 1 };
			}) || [];
		return items;
	}

	// Scroll Gallery
	function scrollGalleryToPage(pagenum: number) {
		const btn = buttonRefs[pagenum - 1];
		if (btn && containerRef) {
			const btnLeft = btn.offsetLeft;
			const btnWidth = btn.offsetWidth;
			const containerWidth = containerRef.offsetWidth;

			// Center button in the container
			const scrollPos = btnLeft - (containerWidth - btnWidth) / 2;
			containerRef.scrollTo({ left: scrollPos, behavior: 'smooth' });
		}
	}

	function handleSelectPage(pagenum: number) {
		const url = new URL(page.url);
		url.searchParams.set('page', String(pagenum));
		goto(url);
	}

	$effect(() => {
		scrollGalleryToPage(pagenum);
	});
</script>

<div class="w-full">
	<div
		class="flex w-full flex-col gap-5 overflow-x-auto rounded-xl border-2 transition-all duration-200"
	>
		<div bind:this={containerRef} class="flex min-h-50 w-full gap-2 overflow-x-auto px-10 py-5">
			{#each collectGalleryItems(docId) as item, index (item.fac)}
				<button
					bind:this={buttonRefs[index]}
					class={[
						`flex flex-col items-center justify-center rounded-xl p-2 hover:bg-yellow-100`,
						item.pagenum_running === pagenum && 'bg-yellow-100'
					]}
					onclick={() => handleSelectPage(item.pagenum_running)}
				>
					<IIIF_Thumb url={item.fac} maxWidth="120" maxHeight="120" classes="rounded-xl" />
					<span class="italic">Seite {item.page}</span>
				</button>
			{/each}
		</div>
		{#if textzeugen.length && !showTextzeugen}
			<button
				class="m-5 self-start rounded-full underline"
				onclick={() => {
					showTextzeugen = true;
				}}>Nichtedierte Textzeugen einblenden</button
			>
		{/if}
		{#if showTextzeugen}
			<div class="bg-surface-800 px-10 py-5 text-surface-200">
				{#each textzeugen as textzeuge}
					{@const items = collectGalleryItems(textzeuge)}
					<p>Textzeuge {metadata[textzeuge]?.metadata.label}</p>
					<div class="flex w-full gap-5 overflow-x-auto rounded-xl px-10 py-5">
						{#each items as item}
							<a
								class="ml-2 rounded-xl p-1"
								href={`${textzeuge}?${updateSearchParams(page.url.searchParams, { page: String(item.pagenum_running) })}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								<IIIF_Thumb url={item.fac} maxWidth="100" maxHeight="100" classes="rounded-xl" />
								<span class="italic">Seite {item.page}</span>
							</a>
						{/each}
					</div>
				{/each}
				{#if showTextzeugen}
					<button
						class="center m-5 w-full self-start rounded-full underline"
						onclick={() => {
							showTextzeugen = false;
						}}>Nichtedierte Textzeugen ausblenden</button
					>
				{/if}
			</div>
		{/if}
	</div>
</div>
