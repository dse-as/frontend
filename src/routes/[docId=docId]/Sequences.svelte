<script lang="ts">
	import { resolve } from '$app/paths';
	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import { findMatchingSequences } from '$lib/functions/sequences/findMatchingSequences';
	import { doc_sequences as seqAllRaw } from '$lib/data/doc_sequences.json';
	import { dict_sequences as dictSeq } from '$lib/dictionaries/dict_sequences.json';
	import { dict_docs } from '$lib/dictionaries/dict_docs.json';
	import { updateSearchParams } from '$lib/functions/ease_of_use/updateSearchParams';
	import { page } from '$app/state';
	import { invalidateAll, goto } from '$app/navigation';
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
	import { printDateRange } from '$lib/functions/ease_of_use/dateFunctions';
	import { findSeqTypeBySeqKey } from '$lib/functions/ease_of_use/findSeqTypeBySeqKey';
	import { resetParamsExcept } from './schemas';
	import { isInteractiveElement } from '$lib/functions/ease_of_use/isIntereactiveElement';

	const allDocs = allDocsRaw as TDocuments['documents'];
	const seqAll = seqAllRaw as TSeqAll;
	const dictSeqTyped = dictSeq as TDictSeq;
	let { docId, params, validSeqKeys } = $props();
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
			[params.seq]
		)
	);

	let isSelectedValidSeq = $derived(params.seq && validSeqKeys.includes(params.seq) ? true : false);
	let currentSeqType = $derived(isSelectedValidSeq ? findSeqTypeBySeqKey(params.seq) : null);
	const seqCurrent = $derived(
		isSelectedValidSeq ? seqMatching[currentSeqType]?.[params.seq] : null
	);
	const prevId = $derived(
		isSelectedValidSeq
			? filterVisible(seqCurrent?.docsBefore)[filterVisible(seqCurrent?.docsBefore).length - 1]
			: null
	);
	const nextId = $derived(isSelectedValidSeq ? filterVisible(seqCurrent?.docsAfter)[0] : null);
	let hasOtherSequences = $derived(Object.keys(seqOther).length ? true : false);

	// UI-State
	// $inspect('validBOOL', validSeqKeys.includes(params.seq));
	// $inspect('Params.seq', params.seq);
	// $inspect('IsSelectedValidSeq', isSelectedValidSeq);
	// $inspect('CurrentSeqType', currentSeqType);
	// $inspect('seqCurrent', seqCurrent);
	// $inspect('prevId', prevId);
	// $inspect('nextId', nextId);

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
		if (!array) return [];
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

	function handleKeyDown(ev: KeyboardEvent) {
		// Guard: If an interactive element is focused, do nothing.
		// This preserves accessibility for tabs, sliders, menus, etc.
		if (isInteractiveElement(document.activeElement)) {
			return;
		}

		if (ev.key === 'Escape') {
			if (otherSeq?.key && isSelectedValidSeq) {
				resetOtherSeq();
			} else {
				closeSeqPanel();
			}
		} else if (ev.key === 'ArrowLeft') {
			if (prevId) {
				resetParamsExcept(params, ['seq', 'mode']);
				goto(resolve(`/${prevId}?${params.toURLSearchParams()}` as any));
			}
		} else if (ev.key === 'ArrowRight') {
			if (nextId) {
				resetParamsExcept(params, ['seq', 'mode']);
				goto(resolve(`/${nextId}?${params.toURLSearchParams()}` as any));
			}
		} else if (ev.key === 's') {
			// Only open if not typing in an input/textarea
			const active = document.activeElement;
			const isTyping =
				active &&
				(active.tagName === 'INPUT' ||
					active.tagName === 'TEXTAREA' ||
					active.getAttribute('contenteditable') === 'true');

			if (!isTyping) {
				openSeqPanel();
			}
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

		function handleKeyDownBlocks(ev: KeyboardEvent, block: HTMLElement) {
			//! Fix keyboar-navigation once strucure of sequence panel is fixed
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
			const handler = (ev: KeyboardEvent) => handleKeyDownBlocks(ev, block);
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

<svelte:document onkeydown={handleKeyDown} />

<!-- Snippets -->
{#snippet seqItem(
	itemId: TDocKeys,
	seqKey: TSeqKeys,
	isCurrentSeqList: boolean,
	isCurrent: boolean,
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
			'p-1',
			isCurrent ? 'w-110' : 'w-85', //! note: width must be absolute values (e.g. w-80). Otherwise (e.g. with w-max or max-w-80) centerCurrentItemInGallery() won't work as expected since not all images have been loaded when it centers.
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
		<div
			class={[
				'group grid h-full w-full grid-cols-[1fr_auto] py-1',
				isCurrent ? 'gap-6 px-3' : 'gap-3 px-3'
			]}
		>
			{#if resType === 'photos'}
				<IIIF_Thumb
					url={resDoc?.faksimile?.iiif_image_emanuscripta}
					iiif_imageAPI_width={400}
					blur={resDoc?.manuscript?.rendition?.blur ? true : false}
					classesContainer="w-max"
					//! FIX grayscale-0 (not working)
					classes={`min-h-2 mx-2 my-1 flex justify-center items-center group-hover:grayscale-0!
						${isCurrent ? 'grayscale-0!' : ''}
						`}
					imgClasses={` ${isCurrent ? 'max-h-32 max-w-40' : 'max-h-20 max-w-30'}`}
				/>
				<div class={['flex w-max grow flex-col', isCurrent ? 'max-w-60' : 'max-w-40']}>
					<span class="line-clamp-2">{resDoc?.name}</span>
				</div>
			{:else}
				<IIIF_Thumb
					url={resDoc?.manuscript?.iiif_urls[0]}
					iiif_imageAPI_width={400}
					classesContainer=""
					classes={`min-h-2  mx-2 my-1 flex justify-center items-center group-hover:grayscale-0!
						${isCurrent ? 'grayscale-0!' : ''}
						`}
					imgClasses={` ${isCurrent ? 'max-h-32 max-w-40' : 'max-h-20 max-w-30'}`}
					// classes="max-h-20 max-w-20 group-hover:grayscale-0!"
				/>
				<div class={['flex w-max grow flex-col', isCurrent ? 'max-w-60' : 'max-w-40']}>
					{#if resType === 'letters'}
						<span class="line-clamp-2"
							>{printDateRange(resDoc?.metadata.date.from, resDoc?.metadata.date.to)}</span
						>
						<span class="line-clamp-2">{resDoc?.name}</span>
					{:else}
						<span class="line-clamp-2">{resDoc?.metadata?.title_full}</span>
						<span class="">{resDoc?.metadata?.pubDate}</span>
					{/if}
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
	<div class="my-2 h-max">
		<ThumbList
			reCenterOn={[docId, itemsBeforeIds, itemsAfterIds, isOpenOtherSeqPanel]}
			classesContainer="items-center"
			classesBefore="my-2 h-max"
			classesAfter="my-2 h-max"
			classesCurrent="min-w-100 mx-10 grayscale-0"
			isBeforeEmpty={itemsBeforeIds.length === 0}
			isAfterEmpty={itemsAfterIds.length === 0}
		>
			{#snippet childrenBefore()}
				{#each itemsBeforeIds as itemId, index (itemId)}
					{@render seqItem(
						itemId,
						seqKey,
						isCurrentSeqList,
						false,
						index === 0,
						index === itemsBeforeIds.length - 1
					)}
				{/each}
			{/snippet}
			{#snippet childrenCurrent()}
				{@render seqItem(docId, seqKey, isCurrentSeqList, true, true, true)}
			{/snippet}
			{#snippet childrenAfter()}
				{#each itemsAfterIds as itemId, index (itemId)}
					{@render seqItem(
						itemId,
						seqKey,
						isCurrentSeqList,
						false,
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
							`/${seqAll[currentSeqType]?.[params.seq]?.url_seq_overview ? seqAll[currentSeqType]?.[params.seq]?.url_seq_overview : currentSeqType}` as any
						)}
						target="_blank"
						rel="noopener noreferrer"
						>{@html seqAll[currentSeqType]?.[params.seq]?.preamble}
					</a>
				</h6>
			</div>
		</div>

		<!-- Navigation Elements -->
		<div class="flex w-full justify-center gap-6">
			<!-- Previous in Sequence-->
			<a
				class={['preset-btn-round', !prevId && '--muted']}
				href={`${prevId}?${params.toURLSearchParams()}`}
				onclick={() => {
					resetParamsExcept(params, ['seq', 'mode']);
				}}
			>
				<div class={['flex flex-row items-center gap-2']}>
					<i class="fa-solid fa-chevron-left"></i>
					<p>{dictSeqTyped[currentSeqType]?.label_prev}</p>
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
				href={`${nextId}?${params.toURLSearchParams()}`}
				onclick={() => {
					resetParamsExcept(params, ['seq', 'mode']);
				}}
			>
				<div class={['flex flex-row items-center gap-2']}>
					<p>{dictSeqTyped[currentSeqType]?.label_next}</p>
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
			isOpenOtherSeqPanel ? 'max-h-[88vh]' : isSelectedValidSeq ? 'max-h-[60vh]' : 'max-h-[85vh]'
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
			{@render sequenceList(currentSeqType as TSeqTypes, params.seq as TSeqKeys, {
				isCurrentSeqList: true
			})}
			<div class="flex w-full items-center justify-end text-right">
				{@render documentCount(currentSeqType as TSeqTypes, params.seq, { hideIntro: false })}
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
					<button
						data-sveltekit-preload-data="tap"
						data-sveltekit-preload-code="hover"
						class="preset-btn-round"
						onclick={() => {
							console.log(params.seq, seqKey);
							params.seq = seqKey;
							console.log(params.seq, seqKey);
							closeSeqPanel();
						}}
						>Sequenz auswählen
					</button>
					<!-- Sequenzansicht -->
					{#if seqAll[seqType!]?.[seqKey]?.url_seq_overview}
						<a
							data-sveltekit-preload-data="tap"
							data-sveltekit-preload-code="hover"
							class="preset-btn-round gap-2"
							href={resolve(seqAll[seqType!][seqKey].url_seq_overview as any)}
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
