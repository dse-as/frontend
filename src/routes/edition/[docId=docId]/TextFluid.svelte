<script lang="ts">
	import { handleMarkClick } from '$lib/functions/interactive_edendum/handleMarkClick';
	import { handleMarkendClick } from '$lib/functions/interactive_edendum/handleMarkendClick';
	import { selectedNote } from '$lib/globals/state/ui.svelte';
	import { unselectMarks } from '$lib/functions/interactive_edendum/unselectMarks';
	import { unselectNotes } from '$lib/functions/interactive_edendum/unselectNotes';
	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import CETEI from 'CETEIcean';
	import { behaviors, removeNotesFromMaintext } from '$lib/CETEIcean/behaviors';

	let containerMaintext: HTMLElement;
	let containerTEI: HTMLElement;
	let { ceteiData } = $props();

	let serializedWithoutNotes = $derived(removeNotesFromMaintext(ceteiData.serialized));

	// ---------------------------------------------
	// Thumbnails
	type TItem = {
		id: number;
		el: HTMLElement;
		facs: string;
		n: string;
		page: number;
		top: number;
	};

	let items = $state([] as TItem[]);

	let resizeObserver: ResizeObserver;
	let mutationObserver: MutationObserver;

	function collectPagebreaks(el: HTMLElement) {
		const nodes = el.querySelectorAll('tei-pb');
		if (nodes.length) {
			items = Array.from(nodes as NodeListOf<HTMLElement>).map((el, i) => ({
				id: i,
				el: el,
				facs: el.getAttribute('facs')?.replace('/info.json', '') || '',
				n: el.getAttribute('n') || '',
				page: i + 1,
				top: 0
			}));
			updatePagebreakPositions();
		}
	}

	function updatePagebreakPositions() {
		items = items.map((item) => {
			const rect = item.el.getBoundingClientRect();
			const containerRect = containerMaintext.getBoundingClientRect();

			return {
				...item,
				top: rect.top - containerRect.top + containerMaintext.scrollTop
			};
		});
	}

	// ---------------------------------------------
	// Click handlers
	function handleDocumentClick(ev: MouseEvent) {
		if ((ev.target as HTMLElement).closest('[data-type="mark"]')) {
			handleMarkClick(ev);
		} else if ((ev.target as HTMLElement).closest('[data-type="markend"]')) {
			handleMarkendClick(ev);
		} else if (selectedNote.id) {
			unselectMarks();
			unselectNotes();
		}
	}

	function setupFacsimile(el: HTMLElement) {
		let setupComplete = $state(false);
		$effect(() => {
			if (!setupComplete) return; // guard to only run once

			// initial collect
			collectPagebreaks(el);

			// reacts to layout / wrapping changes
			resizeObserver = new ResizeObserver(() => {
				updatePagebreakPositions();
			});
			resizeObserver.observe(el);

			// reacts to DOM/text changes
			mutationObserver = new MutationObserver(() => {
				collectPagebreaks(el);
			});
			mutationObserver.observe(el, {
				childList: true,
				subtree: true,
				characterData: true
			});

			// fallback for viewport changes
			window.addEventListener('resize', updatePagebreakPositions);

			// fonts can shift layout after load
			if (document.fonts) {
				document.fonts.addEventListener('loadingdone', updatePagebreakPositions);
			}
			setupComplete = true;

			// Clean-up
			return () => {
				resizeObserver?.disconnect();
				mutationObserver?.disconnect();
				window.removeEventListener('resize', updatePagebreakPositions);
				if (document.fonts) {
					document.fonts.removeEventListener('loadingdone', updatePagebreakPositions);
				}
			};
		});
	}

	function setupListeners(el: HTMLElement) {
		let setupComplete = $state(false);
		$effect(() => {
			if (!setupComplete) return; // guard to only run once
			el.addEventListener('click', handleDocumentClick);
			setupComplete = true;
		});
	}

	function openDFpage(pagenum: number) {
		const url = new URL(page.url);
		url.searchParams.set('page', String(pagenum));
		url.searchParams.set('mode', 'DF');
		goto(url);
	}

	// ---------------------------------------------
	// Load text
	const c = new CETEI();

	const setupCustomElements = (el: HTMLElement) => {
		c.addBehaviors(behaviors(document));
		c.processPage();
	};
</script>

<div
	data-textflow="fluid"
	class="grid grid-cols-[120px_1fr] gap-10 overflow-y-auto p-10"
	bind:this={containerMaintext}
>
	<!-- THUMBS COLUMN -->
	<aside class="h-full">
		{#each items as item, i (item.id)}
			<!-- spacer -->
			<div style={`height: ${i === 0 ? '5' : item.top - items[i - 1].top}px`} />

			<button class="sticky top-0 float-right ml-2 bg-white" onclick={() => openDFpage(item.page)}>
				<IIIF_Thumb
					url={item.docMeta?.manuscript?.iiif_urls[0]}
					maxWidth="100"
					maxHeight="100"
					classes="rounded-xl"
				/>
				<span class="italic">Seite {item.page}</span>
			</button>
		{/each}
	</aside>

	<!-- TEXT COLUMN -->
	<main
		bind:this={containerTEI}
		class="max-w-none"
		{@attach setupFacsimile}
		{@attach setupListeners}
		{@attach setupCustomElements}
	>
		{@html serializedWithoutNotes}
	</main>
</div>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";

	:global([data-textflow='fluid']) {
		:global(p) {
			@apply my-4;
		}
		:global([data-type='pagebreak'])::after {
			content: 'PAGEBREAK ' attr(data-page);
			@apply bg-red-500 p-2 font-bold;
		}
	}
</style>
