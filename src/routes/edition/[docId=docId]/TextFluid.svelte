<script lang="ts">
	import { selectedTextNode } from '$lib/globals/state/ui.svelte';
	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import CETEI from 'CETEIcean';
	import { behaviors, removeNotesFromMaintext } from '$lib/CETEIcean/behaviors';
	import {
		clearAllHighlights,
		handleFootnoteClick,
		handleRsClick
	} from '$lib/functions/interactive_edendum/handleInteractiveText';

	let containerMaintext: HTMLElement;
	let containerTEI: HTMLElement;
	let { ceteiData } = $props();

	let serializedWithoutNotes = $derived(removeNotesFromMaintext(ceteiData.serialized));

	// ---------------------------------------------
	// Thumbnails
	type TThumb = {
		id: number;
		el: HTMLElement;
		facs: string;
		n: string;
		page: number;
		top: number;
	};

	let thumbs = $state([] as TThumb[]);
	let resizeObserver: ResizeObserver;
	let mutationObserver: MutationObserver;

	function collectPagebreaks(el: HTMLElement) {
		const nodes = el.querySelectorAll('tei-pb');

		if (nodes.length) {
			const newThumbs = Array.from(nodes as NodeListOf<HTMLElement>).map((el, i) => ({
				id: i,
				el: el,
				facs: el.getAttribute('facs')?.replace('/info.json', '') || '',
				n: el.getAttribute('n') || '',
				page: i + 1,
				top: 0
			}));

			// prevent unnecessary state updates (breaks feedback loop)
			const same =
				newThumbs.length === thumbs.length && newThumbs.every((n, i) => n.el === thumbs[i]?.el);

			if (!same) {
				thumbs = newThumbs;
				updatePagebreakPositions();
			}
		}
	}

	function updatePagebreakPositions() {
		thumbs = thumbs.map((thumb) => {
			const rect = thumb.el.getBoundingClientRect();
			const containerRect = containerMaintext.getBoundingClientRect();

			return {
				...thumb,
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
		} else if (selectedTextNode.id) {
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
			});

			// fallback for viewport changes
			window.addEventListener('resize', updatePagebreakPositions);

			// fonts can shift layout after load
			if (document.fonts) {
				document.fonts.addEventListener('loadingdone', updatePagebreakPositions);
			}

			// cleanup
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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	data-textflow="fluid"
	onclick={(ev: Event) => {
		const el = ev.target as HTMLElement;

		if (!el) return;
		if (el.tagName === 'TEI-DIV' || el.tagName === 'TEI-P') {
			clearAllHighlights();
		} else if (el.tagName === 'TEI-RS') {
			handleRsClick(el.getAttribute('key'));
		} else if (el.classList.contains('footnote') || el.querySelector('.footnote')) {
			const key = el.closest('[data-noteid]')?.getAttribute('data-noteid');
			handleFootnoteClick(key);
		} else if (el.classList.contains('note-mark') || el.querySelector('.note-mark')) {
			const key = el.closest('[data-noteid]')?.getAttribute('data-noteid');
			handleFootnoteClick(key);
		} else {
			clearAllHighlights();
		}
	}}
	class="mx-auto mt-10 grid max-w-300 grid-cols-[200px_1fr] gap-10 overflow-y-auto p-10 pt-0 pl-0"
	bind:this={containerMaintext}
>
	<!-- THUMBS COLUMN -->
	<aside class="h-full">
		{#each thumbs as thumb, i (thumb.id)}
			<!-- spacer -->
			<div style={`height: ${i === 0 ? '5' : thumb.top - thumbs[i - 1].top}px`} />

			<button
				class="sticky top-0 float-right ml-2 w-max translate-y-10 bg-white"
				onclick={() => openDFpage(thumb.page)}
			>
				<IIIF_Thumb url={thumb.facs} maxWidth="200" maxHeight="200" classes="rounded-xl" />
				<span class="italic">Seite {thumb.page}</span>
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
