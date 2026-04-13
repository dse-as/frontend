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

	let setupComplete = $state(false);

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

	$inspect(items);
	let resizeObserver: ResizeObserver;
	let mutationObserver: MutationObserver;

	function collectPagebreaks(el: HTMLElement) {
		const nodes = el.querySelectorAll('tei-pb');
		console.log('NODES', nodes);

		if (nodes.length) {
			const newItems = Array.from(nodes as NodeListOf<HTMLElement>).map((el, i) => ({
				id: i,
				el: el,
				facs: el.getAttribute('facs')?.replace('/info.json', '') || '',
				n: el.getAttribute('n') || '',
				page: i + 1,
				top: 0
			}));

			// 🔑 prevent unnecessary state updates (breaks feedback loop)
			const same =
				newItems.length === items.length && newItems.every((n, i) => n.el === items[i]?.el);

			if (!same) {
				items = newItems;
				updatePagebreakPositions();
			}
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
		$effect(() => {
			// initial collect
			collectPagebreaks(el);

			// reacts to layout / wrapping changes
			resizeObserver = new ResizeObserver(() => {
				updatePagebreakPositions();
			});
			resizeObserver.observe(el);

			// reacts to DOM/text changes
			let mutationTimeout: number;

			mutationObserver = new MutationObserver(() => {
				clearTimeout(mutationTimeout);
				mutationTimeout = setTimeout(() => {
					collectPagebreaks(el);
				}, 50);
			});

			mutationObserver.observe(el, {
				childList: true,
				subtree: true
				// ❌ removed characterData to reduce noise
			});

			// fallback for viewport changes
			window.addEventListener('resize', updatePagebreakPositions);

			// fonts can shift layout after load
			if (document.fonts) {
				document.fonts.addEventListener('loadingdone', updatePagebreakPositions);
			}

			// ✅ cleanup (prevents stacking + hidden loops)
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
		$effect(() => {
			el.addEventListener('click', handleDocumentClick);

			return () => {
				el.removeEventListener('click', handleDocumentClick);
			};
		});
	}

	function openDFpage(pagenum: number) {
		const url = new URL(page.url);
		url.searchParams.set('page', String(pagenum));
		url.searchParams.set('mode', 'DF');
		goto(url, { noScroll: true });
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
	class="mx-auto mt-10 grid max-w-300 grid-cols-[200px_1fr] gap-10 overflow-y-auto p-10 pt-0 pl-0"
	bind:this={containerMaintext}
>
	<!-- THUMBS COLUMN -->
	<aside class="h-full">
		{#each items as item, i (item.id)}
			<!-- spacer -->
			<div style={`height: ${i === 0 ? '5' : item.top - items[i - 1].top}px`} />

			<button
				class="sticky top-0 float-right ml-2 w-max translate-y-10 bg-white"
				onclick={() => openDFpage(item.page)}
			>
				<IIIF_Thumb url={item.facs} maxWidth="200" maxHeight="200" classes="rounded-xl" />
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
		:global(tei-pb)::after {
			/* content: 'PAGEBREAK ' attr(data-page); */
			@apply bg-red-500 p-2 font-bold;
		}
	}
</style>
