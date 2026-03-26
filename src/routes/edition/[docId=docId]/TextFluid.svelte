<script lang="ts">
	import { onMount, type Component } from 'svelte';
	import { handleMarkClick } from '$lib/functions/handleMarkClick';
	import { handleMarkendClick } from '$lib/functions/handleMarkendClick';
	import { selectedNote } from '$lib/globals/state/ui.svelte';
	import { unselectMarks } from '$lib/functions/unselectMarks';
	import { unselectNotes } from '$lib/functions/unselectNotes';
	import IIIF_Thumb from './IIIF_Thumb.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import CETEI from 'CETEIcean';

	let containerMaintext: HTMLElement;
	let containerTEI: HTMLElement;
	let { docId, ceteiData } = $props();

	// ---------------------------------------------
	// Thumbnails
	type TItem = {
		id: number;
		el: HTMLElement;
		facs: string;
		page: string;
		n: string;
		top: number;
	};

	let items = $state([] as TItem[]);

	let resizeObserver: ResizeObserver;
	let mutationObserver: MutationObserver;

	function collectPagebreaks(el: HTMLElement) {
		const nodes = el.querySelectorAll('tei-pb');

		items = Array.from(nodes as NodeListOf<HTMLElement>).map((el, i) => ({
			id: i,
			el: el,
			facs: el.getAttribute('facs')?.replace('/info.json', '') || '',
			n: el.getAttribute('n') || '',
			top: 0
		}));
		updatePagebreakPositions();
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
	function handleDocumentClick(ev) {
		if (ev.target.closest('[data-type="mark"]')) {
			handleMarkClick(ev);
		} else if (ev.target.closest('[data-type="markend"]')) {
			handleMarkendClick(ev);
		} else if (selectedNote.id) {
			unselectMarks();
			unselectNotes();
		}
	}

	function setupFacsimile(el) {
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
	}

	function setupListeners(el) {
		// ---------------------------------------------
		// (2) Click listeners
		el.addEventListener('click', handleDocumentClick);
	}

	function openDFpage(pagenum: number) {
		const url = new URL(page.url);
		url.searchParams.set('page', String(pagenum));
		url.searchParams.set('mode', 'DF');
		goto(url);
	}

	// ---------------------------------------------
	// Load text
	onMount(() => {
		// CETEIcean in the Browser
		// const cetei = new CETEI();
		// cetei.getHTML5(`/data/texts/text-${docId}.xml`, (data) => {
		// 	containerTEI.appendChild(data);
		// });

		// CETEIcean with JSDOM from +server.page.js
		containerTEI.appendChild(ceteiData);
	});
</script>

<div
	data-dom="containerMaintext"
	data-textflow="fluid"
	class="grid grid-cols-[120px_1fr] gap-10 overflow-y-auto p-10"
	bind:this={containerMaintext}
>
	<!-- THUMBS COLUMN -->
	<aside class="h-full">
		{#each items as item, i (item.id)}
			<!-- spacer -->
			<div style={`height: ${i === 0 ? '5' : item.top - items[i - 1].top}px`} />

			<!-- sticky facsimile -->
			<button
				class="sticky top-0 float-right ml-2 bg-white"
				onclick={() => openDFpage(item.id + 1)}
			>
				<IIIF_Thumb url={item.facs} width="100" classes="rounded-xl" />
				<span class="italic">Seite {item.id + 1}</span>
			</button>
		{/each}
	</aside>
	<!-- TEXT COLUMN -->
	<main bind:this={containerTEI} class="max-w-none" use:setupFacsimile use:setupListeners />
</div>

<style>
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
