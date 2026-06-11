<script lang="ts">
	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import CETEI from 'CETEIcean';
	import { behaviors, removeNotesFromMaintext } from '$lib/CETEIcean/behaviors';
	import {
		clearAllHighlights,
		handleFootnoteClick,
		handleRefStringClick
	} from '$lib/functions/interactive_edendum/handleInteractiveText';
	import { type TRegKeysFlat } from '$lib/types/register/TRegister';

	let containerMaintext: HTMLElement;
	let containerTEI: HTMLElement;
	let { ceteiData, classes } = $props();

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
		f;
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
	// Attachments
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
			let mutationTimeout: ReturnType<typeof setTimeout>;

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

	function openDFpage(pagenum: number) {
		const url = new URL(page.url);
		url.searchParams.set('page', String(pagenum));
		url.searchParams.set('mode', 'DF');
		goto(url, { noScroll: true });
	}

	// ---------------------------------------------
	// Load text
	const c = new CETEI();

	const setupCustomElements = (element: HTMLElement) => {
		c.addBehaviors(behaviors(document));
		c.processPage();

		element.querySelectorAll('tei-rs').forEach((el) => {
			el.setAttribute('tabindex', '0');
			el.addEventListener('click', (ev) => {
				ev.stopPropagation();
				handleRefStringClick(el);
			});
			el.addEventListener('focusout', () => {
				clearAllHighlights();
			});
		});
		element.querySelectorAll('.footnote, .note-mark').forEach((el) => {
			const key = el.closest('[data-noteid]')?.getAttribute('data-noteid') as TRegKeysFlat;
			el.setAttribute('tabindex', '0');
			el.addEventListener('click', () => {
				handleFootnoteClick(key);
			});
			el.addEventListener('focusout', () => {
				clearAllHighlights();
			});
		});
	};
</script>

<div data-textflow="fluid" class={classes} bind:this={containerMaintext}>
	<div class="w-full gap-10 p-10 pt-0 xl:grid xl:grid-cols-[150px_1fr] xl:pl-0">
		<!-- Thumbnail Column -->
		<aside class="hidden h-full xl:block">
			{#each thumbs as thumb, i (thumb.id)}
				<!-- spacer -->
				<div style={`height: ${i === 0 ? '5' : thumb.top - thumbs[i - 1].top}px`}></div>

				<button
					class="sticky top-0 float-right ml-2 w-max translate-y-10 bg-white"
					onclick={() => openDFpage(thumb.page)}
				>
					<IIIF_Thumb url={thumb.facs} maxWidth="200" maxHeight="200" classes="rounded-xl" />
					<span class="text-sm">Seite {thumb.page}</span>
				</button>
			{/each}
		</aside>

		<!-- Text Column -->
		<main
			bind:this={containerTEI}
			class="max-w-none"
			{@attach setupFacsimile}
			{@attach setupCustomElements}
		>
			{@html serializedWithoutNotes}
		</main>
	</div>
</div>
