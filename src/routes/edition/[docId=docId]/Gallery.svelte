<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import IIIF_Thumb from './IIIF_Thumb.svelte';

	type TItem = {
		id: number;
		fac: string;
		page: number;
	};

	function setPage(pagenum: number) {
		const url = new URL(page.url);
		url.searchParams.set('page', String(pagenum));
		goto(url);
	}

	let { metadata, docId, pagenum } = $props();
	const items: TItem[] =
		metadata[docId]?.manuscript.iiif_urls.map((el: string, idx: number) => {
			return { id: idx + 1, fac: el, page: idx + 1 };
		}) || [];

	// Store references to each button
	let buttonRefs: HTMLButtonElement[] = [];
	let containerRef: HTMLDivElement;

	// References

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

	$effect(() => {
		scrollGalleryToPage(pagenum);
	});
</script>

<div class="w-full px-40">
	{pagenum}
	<div
		bind:this={containerRef}
		class="flex w-full gap-5 overflow-x-auto rounded-xl border-2 px-10 py-5"
	>
		{#each items as item, index}
			<button
				bind:this={buttonRefs[index]}
				class={`ml-2 min-w-[120px] rounded-xl p-1 ${item.id === pagenum && 'bg-red-500'}`}
				onclick={() => setPage(item.id)}
			>
				<IIIF_Thumb url={item.fac} width="100" classes="rounded-xl" />
				<span class="italic">Seite {item.page}</span>
			</button>
		{/each}
	</div>
</div>
