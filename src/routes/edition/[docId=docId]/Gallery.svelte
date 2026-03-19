<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import IIIF_Thumb from './IIIF_Thumb.svelte';

	let buttonRefs: HTMLButtonElement[] = [];
	let containerRef: HTMLDivElement;

	type TItem = {
		id: number;
		fac: string;
		page: number;
	};

	let { metadata, docId, pagenum } = $props();

	// Textstufen
	const textstufen = metadata[docId]?.metadata.textstufen || [];
	let showTextstufen = $state(false);

	// Gallery Items

	function collectGalleryItems(id) {
		const items: TItem[] =
			metadata[id]?.manuscript.iiif_urls.map((el: string, idx: number) => {
				return { id: idx + 1, fac: el, page: idx + 1 };
			}) || [];
		return items;
	}

	// Scroll Gallery
	function scrollGalleryToPage(pagenum) {
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

<div class="w-full px-40">
	<div
		class="flex w-full flex-col gap-5 overflow-x-auto rounded-xl border-2 transition-all duration-200"
	>
		<div bind:this={containerRef} class="flex w-full gap-5 overflow-x-auto px-10 py-5">
			{#each collectGalleryItems(docId) as item, index}
				<button
					bind:this={buttonRefs[index]}
					class={`ml-2 rounded-xl p-1 ${item.id === pagenum && 'bg-red-500'}`}
					onclick={() => handleSelectPage(item.id)}
				>
					<IIIF_Thumb url={item.fac} width="100" classes="rounded-xl" />
					<span class="italic">Seite {item.page}</span>
				</button>
			{/each}
		</div>
		{#if showTextstufen}
			<div class="bg-surface-800 px-10 py-5 text-surface-200">
				{#each textstufen as textstufe}
					{@const items = collectGalleryItems(textstufe)}
					<p>Textstufe {metadata[textstufe]?.metadata.label}</p>
					<div class="flex w-full gap-5 overflow-x-auto rounded-xl px-10 py-5">
						{#each items as item}
							<a
								class="ml-2 rounded-xl p-1"
								href={`${textstufe}?page=${item.id}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								<IIIF_Thumb url={item.fac} width="100" classes="rounded-xl" />
								<span class="italic">Seite {item.page}</span>
							</a>
						{/each}
					</div>
				{/each}
				{#if showTextstufen}
					<button
						class="center m-5 w-full self-start rounded-full underline"
						onclick={() => {
							showTextstufen = false;
						}}>Textstufen ausblenden</button
					>
				{/if}
			</div>
		{/if}
		{#if textstufen.length && !showTextstufen}
			<button
				class="m-5 self-start rounded-full underline"
				onclick={() => {
					showTextstufen = true;
				}}>Textstufen einblenden</button
			>
		{/if}
	</div>
</div>
