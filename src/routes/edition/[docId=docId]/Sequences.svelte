<script lang="ts">
	import { resolve } from '$app/paths';
	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import { findMatchingSequences } from '$lib/functions/sequences/findMatchingSequences';
	import { doc_sequences as seqAll } from '$lib/data/doc_sequences.json';
	import { dict_sequences as dictSeq } from '$lib/dictionaries/dict_sequences.json';
	import { updateSearchParams } from '$lib/functions/ease_of_use/updateSearchParams';
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';
	import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
	import { type TDocKeys } from '$lib/types/documents/TDocuments';
	import { tick } from 'svelte';
	import type { TDictSeq, TSeqAll, TSeqKeys, TSeqTypes } from '$lib/types/TSequences';
	import { SvelteMap } from 'svelte/reactivity';
	import { invertScroll } from '$lib/functions/invertScroll';

	const seqAllTyped = seqAll as TSeqAll;
	const dictSeqTyped = dictSeq as TDictSeq;

	let { allDocs, docId, currentSeq } = $props();

	// Sequences
	let seqMatching = $derived(
		findMatchingSequences(
			seqAll as Record<string, Record<string, { name?: string; docs: string[] }>>,
			docId,
			[]
		)
	);
	let seqOther = $derived(
		findMatchingSequences(
			seqAll as Record<string, Record<string, { name?: string; docs: string[] }>>,
			docId,
			[currentSeq.key]
		)
	);
	const seqCurrent = $derived(seqMatching[currentSeq.type]?.[currentSeq.key]);
	const prevId = $derived(seqCurrent?.docsBefore[seqCurrent?.docsBefore.length - 1] || null);
	const nextId = $derived(seqCurrent?.docsAfter[0] || null);
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

	function centerCurrentItemInGallery(el: HTMLElement) {
		/* eslint-disable @typescript-eslint/no-unused-vars */
		let _foreRerun = docId; // force rerun on change of docId

		const container = el.parentElement;
		if (!container) return;
		// Scroll the container to the specified position
		container.scroll({
			behavior: 'instant',
			left:
				el.getBoundingClientRect().left -
				container.getBoundingClientRect().left +
				container.scrollLeft -
				container.clientWidth / 2 +
				el.clientWidth / 2
		});
	}

	function cycleBlocks(el: HTMLElement) {
		/* eslint-disable @typescript-eslint/no-unused-vars */
		let _foreRerun = activeType; // force rerun on change of activeType (since number of blocks depends on type)

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
{#snippet seqItem(itemId: TDocKeys, seqKey: TSeqKeys, isCurrentSeqList: boolean)}
	{@const { item: resDoc, docId: resId } = resolveDoc(allDocs, itemId) || { item: null }}
	<a
		data-sveltekit-preload-data="tap"
		data-sveltekit-preload-code="hover"
		href={`${resId}?${updateSearchParams(page.url.searchParams, { seq: seqKey })}`}
		class={[
			'max-w-90 rounded-xl p-1',
			docId !== resId && 'hover:bg-surface-300-700',
			!isCurrentSeqList && ' hover:bg-surface-300-700',
			isCurrentSeqList && docId === resId && 'pointer-events-none'
		]}
		onclick={() => {
			closeSeqPanel(0);
			invalidateAll();
		}}
	>
		<div class="grid h-full w-full grid-cols-[1fr_3fr] gap-3 px-3 py-1">
			<div class="flex h-full w-full items-center justify-center">
				<IIIF_Thumb
					url={resDoc?.manuscript?.iiif_urls[0]}
					maxWidth="80"
					maxHeight="80"
					classes="rounded-xl"
				/>
			</div>
			<div class="flex flex-col">
				<span class="line-clamp-2">{resDoc?.metadata?.title_full}</span>
				<span class="">{resDoc?.metadata?.pubDate}</span>
			</div>
		</div>
	</a>
{/snippet}

{#snippet sequenceList(seqType: TSeqTypes, seqKey: TSeqKeys, isCurrentSeqList: boolean)}
	{@const itemsBeforeIds = (seqMatching[seqType]?.[seqKey]?.docsBefore as TDocKeys[]) || []}
	{@const itemsAfterIds = (seqMatching[seqType]?.[seqKey]?.docsAfter as TDocKeys[]) || []}
	<div
		class="flex h-[140px] overflow-x-auto overflow-y-hidden pb-6"
		onwheel={(ev) => {
			invertScroll(ev);
		}}
	>
		<!-- Documents before -->
		<div
			class={[
				'flex min-w-1/2 shrink-0 justify-end gap-2 rounded-xl',
				itemsBeforeIds.length === 0 ? 'bg-transparent' : 'bg-surface-200-800'
			]}
		>
			{#each itemsBeforeIds as itemId (itemId)}
				{@render seqItem(itemId, seqKey, isCurrentSeqList)}
			{/each}
		</div>
		<!-- Current Document -->
		<div
			class={['mx-2 flex min-w-85 grow justify-center rounded-xl bg-transparent']}
			{@attach centerCurrentItemInGallery}
		>
			{@render seqItem(docId, seqKey, isCurrentSeqList)}
		</div>
		<!-- Documents after -->
		<div
			class={[
				'flex min-w-1/2 shrink-0 justify-start gap-2 rounded-xl',
				itemsAfterIds.length === 0 ? 'bg-transparent' : 'bg-surface-200-800'
			]}
		>
			{#each itemsAfterIds as itemId (itemId)}
				{@render seqItem(itemId, seqKey, isCurrentSeqList)}
			{/each}
		</div>
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
	class="fixed top-0 z-100 h-full w-full bg-surface-50-950/80"
></div>

<!-- Sequence Navigation Elements -->
{#if !isSelectedValidSeq}
	<!-- Button: "Sequenz wählen" -->
	<div bind:this={elSeqNav} class="z-90003">
		<button
			class="z-90003 rounded-full border bg-surface-50-950 px-4 py-2 font-bold hover:bg-surface-300-700"
			onclick={() => {
				if (!isOpenSeqPanel) openSeqPanel();
				else closeSeqPanel(0);
				activeType = Object.keys(seqMatching)[0] as TSeqTypes;
			}}>Sequenz wählen...</button
		>
	</div>
{:else}
	<div bind:this={elSeqNav} class="relative z-90003 mb-25">
		<!-- Current Sequence Title -->
		<div class="flex w-full justify-center gap-6">
			<div class="mb-3 flex w-max flex-col items-center">
				<h6 class="h6">
					Sequenz: <a
						class="hover:underline"
						href={resolve(
							`${dictSeqTyped[currentSeq.type]?.url_overview}/${seqAllTyped[currentSeq.type]?.[currentSeq.key]?.url_slug ? seqAllTyped[currentSeq.type]?.[currentSeq.key]?.url_slug : currentSeq.type}` as any
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
				class={[
					'flex items-center rounded-full border px-4 select-none hover:bg-surface-300-700',
					!prevId && 'pointer-events-none border-surface-500'
				]}
				href={`${prevId}?${updateSearchParams(page.url.searchParams, { seq: currentSeq.key, page: null })}`}
			>
				<div class={['flex flex-row items-center gap-2', !prevId && 'text-surface-500']}>
					<i class="fa-solid fa-chevron-left"></i>
					<p>{dictSeqTyped[currentSeq.type]?.label_prev}</p>
				</div>
			</a>

			<!-- Button: Open Panel -->
			<button
				class="z-10 h-10 w-10 translate-y-5 rounded-full border-b-2 border-surface-300-700 bg-surface-50-950 text-surface-700-300 hover:border hover:bg-surface-300-700"
				aria-label="Sequenzansicht öffnen"
				onclick={(ev) => {
					if (!isOpenSeqPanel) openSeqPanel();
					else closeSeqPanel(0);
					const target = ev.target as HTMLElement | null;
					const elButton = target?.closest('button') as HTMLElement | null;
					elButton?.focus();
				}}
			>
				<div style="position: relative; display: inline-block;">
					<i class={['fa-solid', !isOpenSeqPanel ? 'fa-chevron-down' : 'fa-chevron-up']}></i>
					{#if hasOtherSequences && !isOpenSeqPanel}
						<i
							class="fa-solid fa-plus fa-sm absolute top-0 right-0 aspect-square translate-x-3 -translate-y-3 rounded-full bg-surface-800-200 pt-2 text-surface-50-950"
						></i>
					{/if}
				</div>
			</button>

			<!-- Next in Sequence -->
			<a
				class={[
					'flex items-center rounded-full border px-4 select-none hover:bg-surface-300-700',
					!nextId && 'pointer-events-none border-surface-500'
				]}
				href={`${nextId}?${updateSearchParams(page.url.searchParams, { seq: currentSeq.key, page: null })}`}
			>
				<div class={['flex flex-row items-center gap-2', !nextId && 'text-surface-500']}>
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
			'absolute z-90002 flex h-max max-h-[80vh] w-8/10 flex-col rounded-xl border-2 px-10 pb-10 transition-all duration-200',
			isSelectedValidSeq ? 'bg-surface-50-950 pt-40' : 'bg-surface-50-950 pt-25'
		]}
		style={`top:${elSeqNavSize?.top}px;`}
		onmouseenter={() => {
			clearTimeout(timeoutIdCloseSeqPanel);
		}}
	>
		<!-- Current Sequence -->
		{#if isSelectedValidSeq}
			{@render sequenceList(currentSeq.type, currentSeq.key, true)}
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
				{#each Object.keys(seqOther) as seqType (seqType)}
					<button
						class={[classes, activeType === seqType && 'bg-surface-50-950 font-bold']}
						onmousemove={() => {
							activeType = seqType as TSeqTypes;
						}}
						onclick={() => {
							activeType = seqType as TSeqTypes;
						}}
					>
						{dictSeqTyped[seqType].label_plural}
					</button>
				{/each}
			</div>
		{/snippet}

		<!-- Snippet: Title with shortcuts -->
		{#snippet titleWithShortcuts(type: string, seqKey: string)}
			<div class={['flex min-h-18 w-full flex-col items-start py-1']}>
				<h6 class="mr-5 h6">{seqAllTyped[type!]?.[seqKey]?.preamble || type}</h6>
				<div class="hidden group-focus-within:block group-hover:block group-focus:block">
					<div class="flex gap-4">
						<a
							data-sveltekit-preload-data="tap"
							data-sveltekit-preload-code="hover"
							class="h-full underline hover:text-primary-500"
							href={`${docId}?${updateSearchParams(page.url.searchParams, { seq: seqKey, page: null })}`}
							onclick={() => {
								closeSeqPanel(100);
							}}
							>Sequenz auswählen
						</a>
						{#if seqAllTyped[type!]?.[seqKey]?.url_slug}
							<a
								data-sveltekit-preload-data="tap"
								data-sveltekit-preload-code="hover"
								class="h-full underline hover:text-primary-500"
								href={`${dictSeqTyped[type!]?.url_overview}/${seqAllTyped[type!][seqKey].url_slug}`}
								target="_blank"
								rel="noopener noreferrer"
								>{dictSeqTyped[type!]?.label_overview}
							</a>
						{/if}
					</div>
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
				{@const seqTypes = ['correspondence', 'series', 'textstufen', 'travels'] as const}
				<div class="flex w-full flex-col overflow-y-auto">
					{#each seqTypes as seqType (seqType)}
						{#if seqOther[seqType!]}
							<h3 class="h3">{dictSeqTyped[seqType]?.label_plural}</h3>
							{#each Object.keys(seqOther[seqType!] ?? {}) as seqKey (seqKey)}
								{@render titleWithShortcuts(seqType, seqKey)}
								{@render sequenceList(seqType, seqKey as TSeqKeys, seqKey === currentSeq.key)}
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
				{@render otherSeqSelectors('px-4 h-max underline hover:bg-surface-50-950')}
			</div>

			<!-- Other Sequences -->
			{#if activeType}
				<div
					role="dialog"
					tabindex="0"
					class={[
						'relative rounded-b-xl bg-surface-50-950 text-surface-950',
						isSelectedValidSeq && 'mt-10 border-t-2'
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
						{#each Object.keys(seqOther[activeType!] ?? {}) as seqKey (seqKey)}
							<div
								class="group flex w-full flex-col gap-5"
								tabindex="0"
								role="dialog"
								data-type="selectable-block"
							>
								<!-- sequenceList with thumbnails -->
								<div class="flex w-full flex-col gap-2 overflow-x-auto py-1">
									{#if isSelectedValidSeq && hasOtherSequences}
										{@render titleWithShortcuts(activeType, seqKey)}
										{@render sequenceList(
											activeType,
											seqKey as TSeqKeys,
											seqKey === currentSeq.key
										)}
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
