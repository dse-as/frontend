<script lang="ts">
	import { resolve } from '$app/paths';
	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import { findMatchingSequences } from '$lib/functions/sequences/findMatchingSequences';
	import { doc_sequences as seqAll } from '$lib/data/doc_sequences.json';
	import { dict_sequences as dictSeq } from '$lib/dictionaries/dict_sequences.json';
	import { dict_docs } from '$lib/dictionaries/dict_docs.json';
	import { updateSearchParams } from '$lib/functions/ease_of_use/updateSearchParams';
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';
	import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
	import { documents as allDocsRaw } from '$lib/data/documents.json';
	import { type TDocKeys, type TDocuments } from '$lib/types/documents/TDocuments';
	import { tick } from 'svelte';
	import type { TDictSeq, TSeqAll, TSeqKeys, TSeqTypes } from '$lib/types/TSequences';
	import { SvelteMap } from 'svelte/reactivity';
	import ThumbList from './ThumbList.svelte';
	import Switch from '$lib/components/ui/Switch.svelte';
	import { sequenceToggle } from '$lib/globals/ui-states.svelte';

	const allDocs = allDocsRaw as TDocuments['documents'];
	const seqAllTyped = seqAll as TSeqAll;
	const dictSeqTyped = dictSeq as TDictSeq;

	let { docId, currentSeq } = $props();

	// Sequences
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
	let isOpenSeqPanel = $state(false);
	let isHoveredAlltypes = $state(false);
	let timeoutIdCloseSeqPanel: ReturnType<typeof setTimeout> | undefined = $state();
	let timeoutIdResetActiveType: ReturnType<typeof setTimeout> | undefined = $state();

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

	// UI-Choices
	let activeType: TSeqTypes | null = $state(null);

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
			if (activeType && isSelectedValidSeq) resetActiveType(0);
			else closeSeqPanel(0);
		}
	}

	function openSeqPanel() {
		isOpenSeqPanel = true;
		tick();
		elSeqPanel?.focus();
	}

	function closeSeqPanel(delay = 0) {
		timeoutIdCloseSeqPanel = setTimeout(() => {
			resetActiveType(0);
			isOpenSeqPanel = false;
		}, delay);
	}

	function resetActiveType(delay = 0, exception = false) {
		if (exception) return;
		timeoutIdResetActiveType = setTimeout(() => {
			activeType = null;
			elSeqPanel?.focus();
		}, delay);
	}

	function cycleBlocks(el: HTMLElement) {
		/* eslint-disable @typescript-eslint/no-unused-vars */
		let _forceRerun = activeType; // force rerun on change of activeType (since number of blocks depends on type)

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
	} = resolveDoc(allDocs, itemId) || { item: null }}
	<a
		data-sveltekit-preload-data="tap"
		data-sveltekit-preload-code="hover"
		href={`${resId}?${updateSearchParams(page.url.searchParams, { seq: seqKey })}`}
		class={[
			'max-w-90 p-1',
			docId !== resId && 'hover:bg-hover',
			!isCurrentSeqList && ' hover:bg-hover',
			isCurrentSeqList && docId === resId && 'pointer-events-none',
			isFirst && 'rounded-l-thumbbox',
			isLast && 'rounded-r-thumbbox'
		]}
		onclick={() => {
			closeSeqPanel(0);
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
					<span class="line-clamp-2">{resDoc?.label}</span>
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

{#snippet sequenceList(seqType: TSeqTypes, seqKey: TSeqKeys, isCurrentSeqList: boolean)}
	{@const itemsBeforeIds =
		(filterVisible(seqMatching[seqType]?.[seqKey]?.docsBefore) as TDocKeys[]) || []}
	{@const itemsAfterIds =
		(filterVisible(seqMatching[seqType]?.[seqKey]?.docsAfter) as TDocKeys[]) || []}
	<div class="my-2 h-[180px]">
		<ThumbList
			reCenterOn={[docId, itemsBeforeIds, itemsAfterIds]}
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
<div
	hidden={!isOpenSeqPanel}
	aria-hidden="true"
	onclick={() => {
		closeSeqPanel(0);
	}}
	onfocus={() => {
		closeSeqPanel(0);
	}}
	aria-label="Panel schliessen"
	class="fixed top-0 z-100 h-full w-full bg-background/90"
></div>

<!-- Sequence Navigation Elements -->
{#if !isSelectedValidSeq}
	<!-- Button: "Sequenz wählen" -->
	<div bind:this={elSeqNav} class="z-90003">
		<button
			class="preset-btn-round --xl z-90003"
			onclick={() => {
				if (!isOpenSeqPanel) openSeqPanel();
				else closeSeqPanel(0);
				activeType = Object.keys(seqMatching)[0] as TSeqTypes;
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
						class="hover:underline"
						href={resolve(
							`/${seqAllTyped[currentSeq.type]?.[currentSeq.key]?.url_seq_overview ? seqAllTyped[currentSeq.type]?.[currentSeq.key]?.url_seq_overview : currentSeq.type}` as any
						)}
						target="_blank"
						rel="noopener noreferrer"
						>{seqAllTyped[currentSeq.type]?.[currentSeq.key]?.preamble}
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
				<div class={['flex flex-row items-center gap-2', !prevId && 'text-avocado-500']}>
					<i class="fa-solid fa-chevron-left"></i>
					<p>{dictSeqTyped[currentSeq.type]?.label_prev}</p>
				</div>
			</a>

			<!-- Button: Open Panel -->
			<button
				class="preset-btn-circle --sm --shadow-bottom --color-light z-10 translate-y-5"
				aria-label="Sequenzansicht öffnen"
				onclick={(ev) => {
					if (!isOpenSeqPanel) openSeqPanel();
					else closeSeqPanel(0);
					const target = ev.target as HTMLElement | null;
					const elButton = target?.closest('button') as HTMLElement | null;
					elButton?.focus();
				}}
			>
				<div class="relative inline-block">
					<i class={['fa-solid', !isOpenSeqPanel ? 'fa-chevron-down' : 'fa-chevron-up']}></i>
					<!-- Show Plus-Indicator if document is part of multiple sequences -->
					{#if hasOtherSequences && !isOpenSeqPanel}
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
				<div class={['flex flex-row items-center gap-2', !nextId && 'text-avodaco']}>
					<p>{dictSeqTyped[currentSeq.type]?.label_next}</p>
					<i class="fa-solid fa-chevron-right"></i>
				</div>
			</a>
		</div>
	</div>
{/if}

<!-- Sequence Panel  -->
{#if isOpenSeqPanel}
	<div
		role="dialog"
		tabindex="0"
		bind:this={elSeqPanel}
		class={[
			'absolute z-90002 flex h-max max-h-[80vh] w-8/10 flex-col rounded-card-lg border-2 px-10 pb-10 transition-all duration-200',
			isSelectedValidSeq ? 'bg-background pt-40' : 'bg-background pt-25'
		]}
		style={`top:${elSeqNavSize?.top}px;`}
		onmouseenter={() => {
			clearTimeout(timeoutIdCloseSeqPanel);
		}}
	>
		<!-- Sequence Toggles (Switches) -->
		<div class="mb-4 flex items-center justify-center gap-2">
			<Switch bind:checked={sequenceToggle.letters} height={24} classesLabel="text-base"
				>{dict_docs.letters.label_plural}</Switch
			>
			<Switch bind:checked={sequenceToggle.smallforms} height={24} classesLabel="text-base"
				>{dict_docs.smallforms.label_plural}</Switch
			>
			<Switch bind:checked={sequenceToggle.longforms} height={24} classesLabel="text-base"
				>{dict_docs.longforms.label_plural}</Switch
			>
			<Switch bind:checked={sequenceToggle.photos} height={24} classesLabel="text-base"
				>{dict_docs.photos.label_plural}</Switch
			>
		</div>

		<!-- Current Sequence -->
		{#if isSelectedValidSeq}
			{@render sequenceList(currentSeq.type, currentSeq.key as TSeqKeys, true)}
			<div class="flex w-full items-center justify-end text-right">
				{@render documentCount(currentSeq.type, currentSeq.key, { hideIntro: true })}
			</div>
			{@render shortcuts(currentSeq.type, currentSeq.key)}
		{/if}

		<!-- Snippet: Other Sequences Selector -->
		{#snippet otherSeqSelectors(classes: string)}
			<div
				role="dialog"
				tabindex="0"
				onmouseenter={() => {
					clearTimeout(timeoutIdResetActiveType);
				}}
				onmouseleave={() => {
					if (isSelectedValidSeq) resetActiveType(500, isHoveredAlltypes);
				}}
			>
				{#each Object.keys(seqOther) as TSeqTypes[] as seqType (seqType)}
					<button
						class={[classes, activeType === seqType && 'bg-background font-bold']}
						onmousemove={() => {
							activeType = seqType;
						}}
						onclick={() => {
							activeType = seqType;
						}}
					>
						{dictSeqTyped[seqType].label_plural}
					</button>
				{/each}
			</div>
		{/snippet}

		<!-- Snippet: Document counts -->
		{#snippet documentCount(
			seqType: TSeqTypes,
			seqKey: TSeqKeys,
			{ classes = '', hideIntro = false } = {}
		)}
			{@const itemsBeforeIds = (seqMatching[seqType]?.[seqKey]?.docsBefore as TDocKeys[]) || []}
			{@const itemsAfterIds = (seqMatching[seqType]?.[seqKey]?.docsAfter as TDocKeys[]) || []}
			{@const nLetters = filterVisible([...itemsBeforeIds, ...itemsAfterIds], {
				letters: true,
				smallforms: false,
				longforms: false,
				photos: false
			}).length}
			{@const nSmallforms = filterVisible([...itemsBeforeIds, ...itemsAfterIds], {
				letters: false,
				smallforms: true,
				longforms: false,
				photos: false
			}).length}
			{@const nLongforms = filterVisible([...itemsBeforeIds, ...itemsAfterIds], {
				letters: false,
				smallforms: false,
				longforms: true,
				photos: false
			}).length}
			{@const nPhotos = filterVisible([...itemsBeforeIds, ...itemsAfterIds], {
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
						<strong>
							{count}
							{#if count > 1}{dict.label_plural}
							{:else}{dict.label_singular}
							{/if}
						</strong>{#if !isVisible}&nbsp;(ausgeblendet){/if}
					</span>{#if isLast}.{/if}{/if}
			{/snippet}
			<div class={['inline-block w-full flex-col items-start py-1', classes]}>
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
				data-sveltekit-preload-data="tap"
				data-sveltekit-preload-code="hover"
				href={`${docId}?${updateSearchParams(page.url.searchParams, { seq: seqKey, page: null })}`}
				onclick={() => {
					closeSeqPanel(100);
				}}
			>
				<h3 class="h3 mr-5">
					{dictSeq[seqType]?.label_singular}
					<span class="italic">"{seqAllTyped[seqType]?.[seqKey]?.name || seqType}"</span>
				</h3>
			</a>
		{/snippet}

		{#snippet shortcuts(seqType: TSeqTypes, seqKey: TSeqKeys)}
			<!-- Sequenz Auswählen -->
			<div
				class="hidden group-focus-within:inline-block group-hover:inline-block group-focus:inline-block"
			>
				<a
					data-sveltekit-preload-data="tap"
					data-sveltekit-preload-code="hover"
					class="preset-btn-round"
					href={`${docId}?${updateSearchParams(page.url.searchParams, { seq: seqKey, page: null })}`}
					onclick={() => {
						closeSeqPanel(100);
					}}
					>Sequenz auswählen
				</a>
			</div>
			<!-- Sequenzansicht -->
			{#if seqAllTyped[seqType!]?.[seqKey]?.url_seq_overview}
				<div
					class="hidden group-focus-within:inline-block group-hover:inline-block group-focus:inline-block"
				>
					<a
						data-sveltekit-preload-data="tap"
						data-sveltekit-preload-code="hover"
						class="preset-btn-round"
						href={seqAllTyped[seqType!][seqKey].url_seq_overview}
						target="_blank"
						rel="noopener noreferrer"
						>{@html dictSeqTyped[seqType!]?.label_seq_overview}
					</a>
				</div>
			{/if}
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
				{@const seqTypes = Object.keys(dictSeq) as (keyof typeof dictSeq)[]}
				<div class="flex w-full flex-col overflow-y-auto">
					{#each seqTypes as seqType (seqType)}
						{#if seqOther[seqType!]}
							{#each Object.keys(seqOther[seqType!] ?? {}) as TSeqKeys[] as seqKey (seqKey)}
								<div class="group">
									{@render title(seqType, seqKey)}
									{@render documentCount(seqType, seqKey)}
									{@render sequenceList(seqType, seqKey, seqKey === currentSeq.key)}
									<div class="min-h-20">{@render shortcuts(seqType, seqKey)}</div>
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
			<div class="mt-4 flex min-h-10 flex-wrap items-end justify-start">
				<p class=" mr-2 h-max font-bold">Weitere Sequenzen zu diesem Dokument:</p>
				{@render otherSeqSelectors('px-4 h-max underline hover:bg-background')}
			</div>

			<!-- Other Sequences -->
			{#if activeType}
				<div
					role="dialog"
					tabindex="0"
					class={[
						'relative rounded-b-xl bg-background text-foreground',
						isSelectedValidSeq && 'mt-10 min-h-30 border-t-2'
					]}
					onmouseenter={() => {
						isHoveredAlltypes = true;
						clearTimeout(timeoutIdResetActiveType);
					}}
					onmouseleave={() => {
						isHoveredAlltypes = false;
						if (isSelectedValidSeq) resetActiveType(500, isHoveredAlltypes);
					}}
					{@attach cycleBlocks}
				>
					<div
						class={[
							'mt-5 flex h-full flex-col gap-5 overflow-y-auto px-1', // px-1 makes sure, focus region of groups is visible
							isSelectedValidSeq ? 'max-h-[35vh]' : 'max-h-[70vh]'
						]}
					>
						<!-- Groups with other Sequences-->
						{#each Object.keys(seqOther[activeType!] ?? {}) as TSeqKeys[] as seqKey (seqKey)}
							<div
								class="group flex w-full flex-col gap-5"
								tabindex="0"
								role="dialog"
								data-type="selectable-block"
							>
								<!-- sequenceList with thumbnails -->
								<div class="flex w-full flex-col gap-2 overflow-x-auto py-1">
									{#if isSelectedValidSeq && hasOtherSequences}
										{@render title(activeType, seqKey)}
										{@render documentCount(activeType, seqKey)}
										{@render sequenceList(activeType, seqKey, seqKey === currentSeq.key)}
										<div class="min-h-20">{@render shortcuts(activeType, seqKey)}</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		{/if}
	</div>
{/if}
