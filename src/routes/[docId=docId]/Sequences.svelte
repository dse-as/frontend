<script lang="ts">
	import { resolve } from '$app/paths';
	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import { findMatchingSequences } from '$lib/functions/sequences/findMatchingSequences';
	import { doc_sequences as seqAllRaw } from '$lib/data/doc_sequences.json';
	import { dict_sequences as dictSeq } from '$lib/dictionaries/dict_sequences.json';
	import { dict_docs } from '$lib/dictionaries/dict_docs.json';
	import { updateSearchParams } from '$lib/functions/ease_of_use/updateSearchParams';
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';
	import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
	import type { TResolvedDoc } from '$lib/functions/ease_of_use/resolveDoc';
	import { documents as allDocsRaw } from '$lib/data/documents.json';
	import { type TDocKeys, type TDocuments } from '$lib/types/documents/TDocuments';
	import { tick } from 'svelte';
	import type { TDictSeq, TSeqAll, TSeqKeys, TSeqTypes } from '$lib/types/TSequences';
	import { SvelteMap } from 'svelte/reactivity';
	import ThumbList from './ThumbList.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import { sequenceToggle, isOpenSeqPanel } from '$lib/globals/ui-states.svelte';
	import { fade } from 'svelte/transition';

	const allDocs = allDocsRaw as TDocuments['documents'];
	const seqAll = seqAllRaw as TSeqAll;
	const dictSeqTyped = dictSeq as TDictSeq;
	let { docId, currentSeq } = $props();
	let otherSeq: { type: TSeqTypes | null; key: TSeqKeys | null } = $state({
		type: null,
		key: null
	});

	// Sequences
	const seqTypes = Object.keys(dictSeq) as (keyof typeof dictSeq)[];
	let seqMatching = $derived(
		findMatchingSequences(
			seqAll as Record<string, Record<string, { name?: string; docs: TDocKeys[] }>>,
			docId,
			[]
		)
	);
	let seqOther = $derived(
		findMatchingSequences(
			seqAll as Record<string, Record<string, { name?: string; docs: TDocKeys[] }>>,
			docId,
			[currentSeq.key]
		)
	);

	const seqCurrent = $derived(seqMatching[currentSeq.type]?.[currentSeq.key]);
	const prevId = $derived(
		filterVisible(seqCurrent?.docsBefore)[filterVisible(seqCurrent?.docsBefore).length - 1] || null
	);
	const nextId = $derived(filterVisible(seqCurrent?.docsAfter)[0] || null);
	let hasOtherSequences = $derived(Object.keys(seqOther).length ? true : false);

	// UI-State
	let isSelectedValidSeq = $derived(currentSeq.type ? true : false);

	let isOpenOtherSeqPanel = $state(false);

	// UI-Elements
	let elSeqNav: HTMLElement | undefined = $state(undefined);
	let elSeqNavSize = $derived.by(() => {
		if (elSeqNav) {
			return {
				top: (elSeqNav.getBoundingClientRect().top || 0) - 115,
				bottom: (elSeqNav.getBoundingClientRect().bottom || 0) - 60,
				width: elSeqNav.clientWidth
			};
		} else {
			return { bottom: 0, width: 0 };
		}
	});
	let elSeqPanel: HTMLElement | undefined = $state(undefined);

	// Functions
	function filterVisible(array: TDocKeys[], seqToggle = sequenceToggle) {
		return array.filter((itemId) => checkVisible(itemId, seqToggle));
	}
	function checkVisible(itemId: TDocKeys, seqToggle = sequenceToggle) {
		return (
			(seqToggle.letters && itemId.includes('letter')) ||
			(seqToggle.smallforms && itemId.includes('smallform')) ||
			(seqToggle.longforms && itemId.includes('longform')) ||
			(seqToggle.photos && itemId.includes('photo'))
		);
	}

	function handleEscape(ev: KeyboardEvent) {
		if (ev.key === 'Escape') {
			if (otherSeq.key && isSelectedValidSeq) resetOtherSeq();
			else closeSeqPanel();
		}
	}

	function openSeqPanel() {
		isOpenSeqPanel.state = true;
		tick();
		elSeqPanel?.focus();
	}

	function closeSeqPanel() {
		resetOtherSeq();
		isOpenSeqPanel.state = false;
	}

	function resetOtherSeq(exception = false) {
		if (exception) return;
		otherSeq.key = null;
		otherSeq.type = null;
		isOpenOtherSeqPanel = false;
		elSeqPanel?.focus();
	}

	function cycleBlocks(el: HTMLElement) {
		/* eslint-disable @typescript-eslint/no-unused-vars */
		let _forceRerun = otherSeq; // force rerun on change of otherSeq (since number of blocks depends on type)

		let currentIndex = 0;
		let blocks: HTMLElement[] = Array.from(el.querySelectorAll('[data-type=selectable-block]'));

		function focusCurrent() {
			blocks?.[currentIndex]?.focus();
		}

		function handleKeyDown(ev: KeyboardEvent, block: HTMLElement) {
			if (ev.key === 'ArrowDown') {
				currentIndex = (currentIndex + 1) % blocks.length;
				focusCurrent();
				ev.preventDefault(); // Prevent default scrolling
			} else if (ev.key === 'ArrowUp') {
				currentIndex = (currentIndex - 1 + blocks.length) % blocks.length;
				focusCurrent();
				ev.preventDefault(); // Prevent default scrolling
			} else if (ev.key === 'Enter') {
				const blockElements = block.querySelectorAll('a');
				blockElements[0].focus();
				ev.preventDefault(); // Prevent default scrolling
			}
		}
		// Cycle through blocks using keyboard
		const handlers = new SvelteMap<HTMLElement, (ev: KeyboardEvent) => void>();
		blocks.forEach((block) => {
			const handler = (ev: KeyboardEvent) => handleKeyDown(ev, block);
			handlers.set(block, handler);
			block.addEventListener('keydown', handler);
		});

		// Clean-up
		return () => {
			blocks.forEach((block) => {
				const handler = handlers.get(block);
				if (handler) block.removeEventListener('keydown', handler);
			});
		};
	}
</script>

<svelte:document onkeydown={handleEscape} />

<!-- Snippets -->
{#snippet seqItem(
	itemId: TDocKeys,
	seqKey: TSeqKeys,
	isCurrentSeqList: boolean,
	isFirst: boolean = false,
	isLast: boolean = false
)}
	{@const {
		item: resDoc,
		docId: resId,
		docType: resType
	} = (resolveDoc(allDocs, itemId) as TResolvedDoc) || { item: null }}
	<a
		data-sveltekit-preload-data="tap"
		data-sveltekit-preload-code="hover"
		href={`${resId}?${updateSearchParams(page.url.searchParams, { seq: seqKey })}`}
		class={[
			'w-80 p-1', //! note: if w-80 is replaced with e.g. max-w-80, centerCurrentItemInGallery() won't work as expected!!
			docId !== resId && 'hover:bg-hover',
			!isCurrentSeqList && ' hover:bg-hover',
			isCurrentSeqList && docId === resId && 'pointer-events-none',
			isFirst && 'rounded-l-thumbbox',
			isLast && 'rounded-r-thumbbox'
		]}
		onclick={() => {
			closeSeqPanel();
			invalidateAll();
		}}
	>
		<div class="grid h-full w-full grid-cols-[1fr_3fr] gap-3 px-3 py-1">
			{#if resType === 'photos'}
				<div class="container-centered">
					<IIIF_Thumb
						url={resDoc?.faksimile?.iiif_image_emanuscripta}
						classes="max-h-[80px] max-w-[80px] "
					/>
				</div>
				<div class="flex flex-col">
					<span class="line-clamp-2">{resDoc?.name}</span>
				</div>
			{:else}
				<div class="container-centered">
					<IIIF_Thumb url={resDoc?.manuscript?.iiif_urls[0]} classes="max-h-[80px] max-w-[80px] " />
				</div>
				<div class="flex flex-col">
					<span class="line-clamp-2">{resDoc?.metadata?.title_full}</span>
					<span class="">{resDoc?.metadata?.pubDate}</span>
				</div>
			{/if}
		</div>
	</a>
{/snippet}

{#snippet sequenceList(seqType: TSeqTypes, seqKey: TSeqKeys, { isCurrentSeqList = false } = {})}
	{@const itemsBeforeIds =
		(filterVisible(seqMatching[seqType]?.[seqKey]?.docsBefore) as TDocKeys[]) || []}
	{@const itemsAfterIds =
		(filterVisible(seqMatching[seqType]?.[seqKey]?.docsAfter) as TDocKeys[]) || []}
	<div class="my-2">
		<ThumbList
			reCenterOn={[docId, itemsBeforeIds, itemsAfterIds, isOpenOtherSeqPanel]}
			classesCurrent="min-w-85"
			isBeforeEmpty={itemsBeforeIds.length === 0}
			isAfterEmpty={itemsAfterIds.length === 0}
		>
			{#snippet childrenBefore()}
				{#each itemsBeforeIds as itemId, index (itemId)}
					{@render seqItem(
						itemId,
						seqKey,
						isCurrentSeqList,
						index === 0,
						index === itemsBeforeIds.length - 1
					)}
				{/each}
			{/snippet}
			{#snippet childrenCurrent()}
				{@render seqItem(docId, seqKey, isCurrentSeqList, true, true)}
			{/snippet}
			{#snippet childrenAfter()}
				{#each itemsAfterIds as itemId, index (itemId)}
					{@render seqItem(
						itemId,
						seqKey,
						isCurrentSeqList,
						index === 0,
						index === itemsAfterIds.length - 1
					)}
				{/each}
			{/snippet}
		</ThumbList>
	</div>
{/snippet}

<!-- Backdrop -->
{#if isOpenSeqPanel.state}
	<div
		aria-hidden="true"
		onclick={() => {
			closeSeqPanel();
		}}
		onfocus={() => {
			closeSeqPanel();
		}}
		aria-label="Panel schliessen"
		class="fixed top-0 z-90001 h-full w-full bg-background/90"
		in:fade={{ duration: 0 }}
		out:fade={{ duration: 200 }}
	></div>
{/if}

<!-- Sequence Navigation Elements -->
{#if !isSelectedValidSeq}
	<!-- Button: "Sequenz wählen" -->
	<div bind:this={elSeqNav} class="z-90003">
		<button
			class="preset-btn-round --xl z-90003"
			onclick={() => {
				if (!isOpenSeqPanel.state) openSeqPanel();
				else closeSeqPanel();
			}}>Sequenz wählen...</button
		>
	</div>
{:else}
	<div bind:this={elSeqNav} class="relative z-90003 mb-10">
		<!-- Current Sequence Title -->
		<div class="flex w-full justify-center gap-6">
			<div class="mb-3 flex w-max flex-col items-center">
				<h6 class="h5">
					<span class="">Sequenz:</span>
					<a
						class="hover:hyperlink"
						href={resolve(
							`/${seqAll[currentSeq.type]?.[currentSeq.key]?.url_seq_overview ? seqAll[currentSeq.type]?.[currentSeq.key]?.url_seq_overview : currentSeq.type}` as any
						)}
						target="_blank"
						rel="noopener noreferrer"
						>{@html seqAll[currentSeq.type]?.[currentSeq.key]?.preamble}
					</a>
				</h6>
			</div>
		</div>

		<!-- Navigation Elements -->
		<div class="flex w-full justify-center gap-6">
			<!-- Previous in Sequence-->
			<a
				class={['preset-btn-round', !prevId && '--muted']}
				href={`${prevId}?${updateSearchParams(page.url.searchParams, { seq: currentSeq.key, page: null })}`}
			>
				<div class={['flex flex-row items-center gap-2']}>
					<i class="fa-solid fa-chevron-left"></i>
					<p>{dictSeqTyped[currentSeq.type]?.label_prev}</p>
				</div>
			</a>

			<!-- Button: Open Panel -->
			<button
				class="preset-btn-circle --sm --shadow-bottom --color-light z-10 translate-y-5"
				aria-label="Sequenzansicht öffnen"
				onclick={(ev) => {
					if (!isOpenSeqPanel.state) openSeqPanel();
					else closeSeqPanel();
					const target = ev.target as HTMLElement | null;
					const elButton = target?.closest('button') as HTMLElement | null;
					elButton?.focus();
				}}
			>
				<div class="relative inline-block">
					<i class={['fa-solid', !isOpenSeqPanel.state ? 'fa-chevron-down' : 'fa-chevron-up']}></i>
					<!-- Show Plus-Indicator if document is part of multiple sequences -->
					{#if hasOtherSequences && !isOpenSeqPanel.state}
						<i
							class="fa-solid fa-plus fa-sm absolute top-0 right-0 aspect-square translate-x-3 -translate-y-3 rounded-full bg-foreground pt-2 text-background"
						></i>
					{/if}
				</div>
			</button>

			<!-- Next in Sequence -->
			<a
				class={['preset-btn-round', !nextId && '--muted']}
				href={`${nextId}?${updateSearchParams(page.url.searchParams, { seq: currentSeq.key, page: null })}`}
			>
				<div class={['flex flex-row items-center gap-2']}>
					<p>{dictSeqTyped[currentSeq.type]?.label_next}</p>
					<i class="fa-solid fa-chevron-right"></i>
				</div>
			</a>
		</div>
	</div>
{/if}

<!-- Sequence Panel  -->
{#if isOpenSeqPanel.state}
	<div
		role="dialog"
		tabindex="0"
		bind:this={elSeqPanel}
		class={[
			'absolute z-90002 flex h-max w-8/10 flex-col overflow-y-auto rounded-card-lg border-2 px-10 pb-4 transition-all duration-200',
			isSelectedValidSeq ? 'bg-background pt-40' : 'bg-background pt-25',
			isOpenOtherSeqPanel ? 'max-h-[85vh]' : isSelectedValidSeq ? 'max-h-[60vh]' : 'max-h-[85vh]'
		]}
		in:fade={{ duration: 100 }}
		out:fade={{ duration: 0 }}
		style={`top:${elSeqNavSize?.top}px;`}
	>
		<!-- Sequence Toggles (Switches) -->
		<!-- {#if isSelectedValidSeq} -->
		<div class="mb-6 flex flex-wrap items-center justify-center gap-3">
			<Checkbox bind:checked={sequenceToggle.letters} classesLabel="text-base"
				>{dict_docs.letters.label_plural}</Checkbox
			>
			<Checkbox bind:checked={sequenceToggle.smallforms} classesLabel="text-base"
				>{dict_docs.smallforms.label_plural}</Checkbox
			>
			<Checkbox bind:checked={sequenceToggle.longforms} classesLabel="text-base"
				>{dict_docs.longforms.label_plural}</Checkbox
			>
			<Checkbox bind:checked={sequenceToggle.photos} classesLabel="text-base"
				>{dict_docs.photos.label_plural}</Checkbox
			>
		</div>
		<!-- {/if} -->

		<!-- Current Sequence -->
		{#if isSelectedValidSeq}
			{@render sequenceList(currentSeq.type, currentSeq.key as TSeqKeys, {
				isCurrentSeqList: true
			})}
			<div class="flex w-full items-center justify-end text-right">
				{@render documentCount(currentSeq.type, currentSeq.key, { hideIntro: false })}
			</div>
		{/if}

		<!-- Snippet: Document counts -->
		{#snippet documentCount(
			seqType: TSeqTypes,
			seqKey: TSeqKeys,
			{ classes = '', hideIntro = false } = {}
		)}
			{@const itemsBeforeIds = (seqMatching[seqType]?.[seqKey]?.docsBefore as TDocKeys[]) || []}
			{@const itemsAfterIds = (seqMatching[seqType]?.[seqKey]?.docsAfter as TDocKeys[]) || []}
			{@const nLetters = filterVisible([docId, ...itemsBeforeIds, ...itemsAfterIds], {
				letters: true,
				smallforms: false,
				longforms: false,
				photos: false
			}).length}
			{@const nSmallforms = filterVisible([docId, ...itemsBeforeIds, ...itemsAfterIds], {
				letters: false,
				smallforms: true,
				longforms: false,
				photos: false
			}).length}
			{@const nLongforms = filterVisible([docId, ...itemsBeforeIds, ...itemsAfterIds], {
				letters: false,
				smallforms: false,
				longforms: true,
				photos: false
			}).length}
			{@const nPhotos = filterVisible([docId, ...itemsBeforeIds, ...itemsAfterIds], {
				letters: false,
				smallforms: false,
				longforms: false,
				photos: true
			}).length}
			{#snippet docCountPart(
				count: number,
				dict: { label_plural: string; label_singular: string },
				isVisible: boolean,
				isFirst: boolean,
				isLast: boolean
			)}
				{#if count}
					{#if !isFirst && isLast}
						&nbsp;und
					{:else if !isFirst},
					{/if}
					<span class="whitespace-nowrap">
						{#if isFirst && !hideIntro}
							In dieser Sequenz:
						{/if}
						<span class={['font-bold', !isVisible && 'text-muted-foreground']}>
							{count}
							{#if count > 1}{dict.label_plural}
							{:else}{dict.label_singular}
							{/if}
						</span>
					</span>{#if isLast}.{/if}{/if}
			{/snippet}
			<div class={['inline-block w-full flex-col items-start py-1 text-dark-70', classes]}>
				{@render docCountPart(
					nLetters,
					dict_docs.letters,
					sequenceToggle.letters,
					true,
					nSmallforms + nLongforms + nPhotos === 0
				)}{@render docCountPart(
					nSmallforms,
					dict_docs.smallforms,
					sequenceToggle.smallforms,
					nLetters === 0,
					nLongforms + nPhotos === 0
				)}{@render docCountPart(
					nLongforms,
					dict_docs.longforms,
					sequenceToggle.longforms,
					nLetters + nSmallforms === 0,
					nPhotos === 0
				)}{@render docCountPart(
					nPhotos,
					dict_docs.photos,
					sequenceToggle.photos,
					nLetters + nSmallforms + nLongforms === 0,
					true
				)}
			</div>
		{/snippet}

		<!-- Snippet: Title with shortcuts -->
		{#snippet title(seqType: TSeqTypes, seqKey: TSeqKeys)}
			<a
				class="mb-2"
				data-sveltekit-preload-data="tap"
				data-sveltekit-preload-code="hover"
				href={`${docId}?${updateSearchParams(page.url.searchParams, { seq: seqKey, page: null })}`}
				onclick={() => {
					closeSeqPanel();
				}}
			>
				<h4 class="h4">
					{dictSeq[seqType]?.label_singular}
					<span class="italic">&laquo;{seqAll[seqType]?.[seqKey]?.name || seqType}&raquo;</span>
				</h4>
			</a>
		{/snippet}

		{#snippet shortcuts(seqType: TSeqTypes, seqKey: TSeqKeys)}
			<!-- Sequenz Auswählen -->
			<div class="my-2 min-h-10">
				<div
					class="preset-btn-list --spacing-normal hidden justify-end group-focus-within:flex group-hover:flex group-focus:flex"
				>
					<a
						data-sveltekit-preload-data="tap"
						data-sveltekit-preload-code="hover"
						class="preset-btn-round"
						href={`${docId}?${updateSearchParams(page.url.searchParams, { seq: seqKey, page: null })}`}
						onclick={() => {
							closeSeqPanel();
						}}
						>Sequenz auswählen
					</a>
					<!-- Sequenzansicht -->
					{#if seqAll[seqType!]?.[seqKey]?.url_seq_overview}
						<a
							data-sveltekit-preload-data="tap"
							data-sveltekit-preload-code="hover"
							class="preset-btn-round gap-2"
							href={seqAll[seqType!][seqKey].url_seq_overview}
							target="_blank"
							rel="noopener noreferrer"
						>
							<i class="fa-solid fa-arrow-top-right"></i>
							{dictSeqTyped[seqType!]?.label_seq_overview}
						</a>
					{/if}
				</div>
			</div>
		{/snippet}

		<!-- No sequence selected -->
		{#if !isSelectedValidSeq}
			{#if !hasOtherSequences}
				<!-- No sequences available -->
				<div class="my-6 flex w-full flex-col items-center justify-center gap-10 font-bold">
					<i class="fa-solid fa-link-slash fa-xl"></i>
					<p>Für dieses Dokument wurden keine Sequenzen verlinkt.</p>
				</div>
			{:else}
				<!-- Sequences -->
				<div class="flex w-full flex-col overflow-y-auto">
					{#each seqTypes as seqType (seqType)}
						{#if seqOther[seqType!]}
							{#each Object.keys(seqOther[seqType!] ?? {}) as TSeqKeys[] as seqKey (seqKey)}
								<div class="group">
									{@render title(seqType, seqKey)}
									<!-- {@render documentCount(seqType, seqKey)} -->
									{@render sequenceList(seqType, seqKey)}
									<div class="flex w-full items-center justify-end text-right">
										{@render documentCount(seqType, seqKey)}
									</div>
									{@render shortcuts(seqType, seqKey)}
								</div>
							{/each}
						{/if}
					{/each}
				</div>
			{/if}
		{/if}

		<!-- Other Sequences Type-Selector -->
		{#if isSelectedValidSeq && hasOtherSequences}
			<!-- Select sequences (other than the one currently sequence selected)-->
			<div class="preset-btn-list --spacing-normal mt-10 items-center">
				<p class="mr-2 font-bold">Weitere Sequenzen:</p>
				<div class="preset-btn-list --spacing-normal w-max">
					{#each seqTypes as seqType (seqType)}
						{#each Object.keys(seqOther[seqType!] ?? {}) as TSeqKeys[] as seqKey (seqKey)}
							<button
								class={['preset-btn-round', otherSeq.key === seqKey && '--active']}
								onclick={() => {
									if (otherSeq.key === seqKey) {
										resetOtherSeq();
									} else {
										isOpenOtherSeqPanel = true;
										otherSeq.type = seqType;
										otherSeq.key = seqKey;
									}
								}}
								>{dictSeq[seqType]?.label_singular}&nbsp;<span class="italic"
									>&laquo;{seqAll[seqType]?.[seqKey]?.name || seqType}&raquo;</span
								>
							</button>
						{/each}
					{/each}
				</div>
			</div>

			<!-- Other Sequences -->
			{#if isOpenOtherSeqPanel}
				<div
					role="dialog"
					tabindex="0"
					data-dom="otherSeqPanel"
					class="group relative mt-4 min-h-30 overflow-hidden rounded-b-xl bg-background text-foreground"
					{@attach cycleBlocks}
				>
					<!-- sequenceList with thumbnails -->
					<div
						in:fade={{ duration: 200 }}
						out:fade={{ duration: 100 }}
						class="flex w-full flex-col overflow-x-auto border-t-2 py-5"
					>
						{@render title(otherSeq.type!, otherSeq.key!)}
						{@render sequenceList(otherSeq.type!, otherSeq.key!)}
						<div class="flex w-full items-center justify-end text-right">
							{@render documentCount(otherSeq.type!, otherSeq.key!)}
						</div>
						{@render shortcuts(otherSeq.type!, otherSeq.key!)}
					</div>
				</div>
			{/if}
		{/if}
	</div>
{/if}
