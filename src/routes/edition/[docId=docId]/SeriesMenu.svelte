<script lang="ts">
	import IIIF_Thumb from './IIIF_Thumb.svelte';
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import { findMatchingSequences } from '$lib/functions/sequences/findMatchingSequences';
	import { doc_sequences as seqAll } from '$lib/data/doc_sequences.json';
	import { dict_sequences as dictSeq } from '$lib/dictionaries/dict_sequences.json';
	import { type TSeqType, type TSeqId } from '$lib/types/TDoc_sequences';

	let { metadata, docId, pagenum, currentSeq = { type: 'travels', id: 'travel_0015' } } = $props();

	// Types
	type TItem = {
		docId: string;
		fac: string;
		details: {
			type: TSeqType;
			title: string;
			datestring: string;
		};
	};

	// Sequences
	let seqMatching = $derived(findMatchingSequences(seqAll, docId, []));
	let seqOther = $derived(findMatchingSequences(seqAll, docId, [currentSeq.id]));
	const seqCurrent = $derived(seqMatching[currentSeq.type]?.[currentSeq.id]);
	const prevId = $derived(seqCurrent?.docsBefore[seqCurrent?.docsBefore.length - 1] || null);
	const nextId = $derived(seqCurrent?.docsAfter[0] || null);

	// UI-State
	let isSelectedValidSeq = $derived(currentSeq.type ? true : false);
	let isOpenSeqPanel = $state(false);
	let hasLeftTriggerAfterOpening = $state(false);
	let isHoveredSeqNavPanel = $state(false);
	let isHoveredSeqLargePanel = $state(false);
	let isHoveredAlltypes = $state(false);
	let timeoutIdCloseSeqPanel = $state();
	let timeoutIdResetActiveType = $state();

	// UI-Elements
	let elSeqMiniPanel: HTMLElement | undefined = $state(undefined);
	let elSeqMiniPanelSize = $derived.by(() => {
		if (elSeqMiniPanel) {
			return {
				top: (elSeqMiniPanel.getBoundingClientRect().top || 0) - 60,
				bottom: (elSeqMiniPanel.getBoundingClientRect().bottom || 0) - 60,
				width: elSeqMiniPanel.clientWidth
			};
		} else {
			return { bottom: 0, width: 0 };
		}
	});
	let elSeqLargePanel: HTMLElement | undefined = $state(undefined);

	// UI-Choices
	let keepPanelOpen = $state(false);
	let activeType: TSeqType | null = $state(null);

	// Functions
	function handleEscape(ev: KeyboardEvent) {
		if (ev.key === 'Escape') {
			if (activeType) resetActiveType(0);
			else closeSeqPanel(0);
		}
	}

	function lookupInfo(docId): TItem {
		return {
			docId: docId,
			fac: metadata[docId].manuscript.iiif_urls[0],
			details: {
				type: 'smallform', //! changethis
				title: metadata[docId].metadata.title_full,
				datestring: metadata[docId].metadata.pubDate
			}
		};
	}

	function openSeqPanel() {
		isOpenSeqPanel = true;
		setTimeout(() => {
			elSeqLargePanel?.focus();
		}, 100);
	}

	function closeSeqPanel(delay = 0) {
		timeoutIdCloseSeqPanel = setTimeout(() => {
			resetActiveType(0);
			isOpenSeqPanel = false;
			keepPanelOpen = false;
			hasLeftTriggerAfterOpening = false; // reset
		}, delay);
	}

	function resetActiveType(delay = 0, exception = false) {
		if (exception) return;
		timeoutIdResetActiveType = setTimeout(() => {
			activeType = null;
			elSeqLargePanel?.focus();
		}, delay);
	}

	function centerCurrentItemInGallery(el) {
		const foo = docId; // force rerun on change of docId
		const container = el.parentNode;
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

	function cycleBlocks(el) {
		let currentIndex = 0;
		const foo = activeType; // force rerun on change of activeType
		let blocks: HTMLElement[] = el.querySelectorAll('[data-type=selectable-block]');

		function focusCurrent() {
			blocks?.[currentIndex]?.focus();
		}

		function handleKeyDown(ev: Event, block: HTMLElement) {
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
		blocks.forEach((block) => {
			block.addEventListener('keydown', (ev) => {
				handleKeyDown(ev, block);
			});
		});

		// Clean-up
		return () => {
			blocks.forEach((block) => {
				block.removeEventListener('keydown', handleKeyDown);
			});
		};
	}
</script>

<svelte:document onkeydown={handleEscape} />

<!-- Snippets -->
{#snippet seqItem(itemId, seqId, isCurrentSeqList)}
	{@const itemInfo = lookupInfo(itemId)}
	<a
		href={`${itemId}?seq=${seqId}`}
		class={[
			'w-70 rounded-xl p-1',
			docId !== itemId && 'hover:bg-surface-100-900',
			!isCurrentSeqList && ' hover:bg-surface-100-900',
			isCurrentSeqList && docId === itemId && 'pointer-events-none'
		]}
		onclick={() => {
			if (!keepPanelOpen) closeSeqPanel(0);
		}}
	>
		<div class="grid h-full w-full grid-cols-[1fr_3fr] gap-3 px-3 py-1">
			<div class="flex h-full w-full items-center justify-center">
				<IIIF_Thumb url={itemInfo.fac} minSize="50" classes="rounded-xl" />
			</div>
			<div class="flex flex-col">
				<span class="italic">{itemInfo.details.title}</span>
				<span class="">{itemInfo.details.datestring}</span>
			</div>
		</div>
	</a>
{/snippet}

{#snippet sequenceList(seqType: TSeqType, seqId: TSeqId, isCurrentSeqList: Boolean)}
	{@const itemsBeforeIds = seqMatching[seqType]?.[seqId]?.docsBefore || []}
	{@const itemsAfterIds = seqMatching[seqType]?.[seqId]?.docsAfter || []}
	<div class="flex grow overflow-x-auto pb-6">
		<div
			class={[
				'flex min-w-1/2 shrink-0 justify-end gap-2 rounded-xl',
				itemsBeforeIds.length === 0 ? 'bg-transparent' : 'bg-surface-200-800'
			]}
		>
			{#each itemsBeforeIds as itemId}
				{@render seqItem(itemId, seqId, isCurrentSeqList)}
			{/each}
		</div>
		<div
			class={['mx-2 flex grow-0 justify-center rounded-xl bg-transparent']}
			{@attach centerCurrentItemInGallery}
		>
			{@render seqItem(docId, seqId, isCurrentSeqList)}
		</div>
		<div
			class={[
				'flex min-w-1/2 shrink-0 justify-start gap-2 rounded-xl',
				itemsAfterIds.length === 0 ? 'bg-transparent' : 'bg-surface-200-800'
			]}
		>
			{#each itemsAfterIds as itemId}
				{@render seqItem(itemId, seqId, isCurrentSeqList)}
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
	onmouseover={() => {
		if (!keepPanelOpen) closeSeqPanel(500);
	}}
	onfocus={() => {
		if (!keepPanelOpen) closeSeqPanel(500);
	}}
	aria-label="Panel schliessen"
	class="fixed z-100 h-full w-full bg-surface-50-950/80"
></div>

<!-- Fixed Small NavPanel -->
{#if !isSelectedValidSeq}
	<div bind:this={elSeqMiniPanel} class="z-90003 my-5 py-5">
		<button
			class="z-90003 rounded-full border bg-surface-50-950 px-4 py-2 font-bold hover:bg-surface-100-900"
			onclick={() => {
				if (!isOpenSeqPanel) openSeqPanel();
				else closeSeqPanel(0);
				activeType = Object.keys(seqMatching)[0];
			}}>Sequenz wählen...</button
		>
	</div>
{:else}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={elSeqMiniPanel}
		class="relative z-90003 my-5 mb-25"
		onmouseenter={() => {
			isHoveredSeqNavPanel = true;
		}}
		onmouseleave={() => {
			isHoveredSeqNavPanel = false;
		}}
	>
		<div class="flex w-full justify-center gap-6">
			<div class="mb-3 flex w-max flex-col items-center">
				<h6 class="h6">
					Sequenz: <a
						class="hover:underline"
						href={`${dictSeq[currentSeq.type]?.url_overview}/${seqAll[currentSeq.type][currentSeq.id].url_slug}`}
						target="_blank"
						rel="noopener noreferrer"
						>{seqAll[currentSeq.type][currentSeq.id].preamble}
					</a>
				</h6>
			</div>
		</div>

		<div class="flex w-full justify-center gap-6">
			<a
				class={[
					'flex items-center rounded-full border px-4 select-none hover:bg-surface-100-900',
					!prevId && 'pointer-events-none border-surface-500'
				]}
				href={`${prevId}?seq=${currentSeq.id}`}
			>
				<div class={['flex flex-row items-center gap-2', !prevId && 'text-surface-500']}>
					<i class="fa-solid fa-chevron-left"></i>
					<p>{dictSeq[currentSeq.type]?.label_prev}</p>
				</div>
			</a>
			<button
				class="z-10 h-10 w-10 translate-y-5 rounded-full border-b-2 border-surface-300-700 bg-surface-50-950 text-surface-700-300 hover:border hover:bg-surface-100-900"
				aria-label="expand box"
				onclick={() => {
					if (!isOpenSeqPanel) openSeqPanel();
					else if (!hasLeftTriggerAfterOpening) {
						keepPanelOpen = true;
						hasLeftTriggerAfterOpening = true;
					} else closeSeqPanel(0);
				}}
				onmouseenter={() => {
					openSeqPanel();
				}}
				onmouseleave={() => {
					if (isOpenSeqPanel) {
						hasLeftTriggerAfterOpening = true;
					}
				}}
			>
				<i
					class={[
						'fa-solid',
						!isOpenSeqPanel
							? 'fa-chevron-down'
							: !hasLeftTriggerAfterOpening
								? 'fa-lock'
								: 'fa-chevron-up'
					]}
				></i>
			</button>

			<a
				class={[
					'flex items-center rounded-full border px-4 select-none hover:bg-surface-100-900',
					!nextId && 'pointer-events-none border-surface-500'
				]}
				href={`${nextId}?seq=${currentSeq.id}`}
			>
				<div class={['flex flex-row items-center gap-2', !nextId && 'text-surface-500']}>
					<p>{dictSeq[currentSeq.type]?.label_next}</p>
					<i class="fa-solid fa-chevron-right"></i>
				</div>
			</a>
		</div>
	</div>
{/if}

<!-- Large Sequence Panel  -->
{#if isOpenSeqPanel}
	<div
		role="dialog"
		tabindex="0"
		bind:this={elSeqLargePanel}
		class={[
			'absolute z-90002 flex h-max w-8/10 min-w-200 flex-col overflow-x-auto rounded-xl border-2 transition-all duration-200',
			isSelectedValidSeq ? 'bg-surface-50-950 pt-40' : 'bg-surface-500 pt-25'
		]}
		style={`top:${elSeqMiniPanelSize?.top}px;`}
		onmouseenter={() => {
			isHoveredSeqLargePanel = true;
			clearTimeout(timeoutIdCloseSeqPanel);
		}}
	>
		<!-- Slider to Keep panel open -->
		<Switch
			class="absolute top-3 right-3"
			checked={keepPanelOpen}
			onCheckedChange={(details) => (keepPanelOpen = details.checked)}
		>
			<Switch.Control>
				<Switch.Thumb>
					<Switch.Context>
						{#snippet children(switch_)}
							{#if switch_().checked}
								<i class="fa-solid fa-lock"></i>
							{:else}
								<i class="fa-solid fa-lock-open"></i>
							{/if}
						{/snippet}
					</Switch.Context>
				</Switch.Thumb>
			</Switch.Control>
			<Switch.HiddenInput />
		</Switch>

		<!-- Current Sequence -->
		{#if isSelectedValidSeq}
			<div class="flex w-full gap-2 overflow-x-auto px-10 py-1">
				{@render sequenceList(currentSeq.type, currentSeq.id, true)}
			</div>
		{/if}

		<!-- Other Sequences Selector (Snippet) -->
		{#snippet otherSeqSelectors(classes: String)}
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
				{#each Object.keys(seqOther) as seqType}
					<button
						class={[classes, activeType === seqType && 'bg-surface-50-950 font-bold']}
						onmousemove={() => {
							activeType = seqType;
						}}
						onclick={() => {
							activeType = seqType;
							keepPanelOpen = true;
						}}
					>
						{dictSeq[seqType].label_plural}
					</button>
				{/each}
			</div>
		{/snippet}

		<!-- Other Sequences Selector -->
		{#if !isSelectedValidSeq}
			{#if !Object.keys(seqOther).length}
				<!-- No sequences -->
				<div class="my-6 flex w-full flex-col items-center justify-center gap-10 font-bold">
					<i class="fa-solid fa-link-slash fa-xl"></i>
					<p>Für dieses Dokument wurden keine Sequenzen verlinkt.</p>
				</div>
			{:else}
				<!-- Select sequences (currently none selected) -->
				<div class="mb-5 flex flex-wrap justify-center gap-x-4 gap-y-2">
					{@render otherSeqSelectors('px-4 py-2 mx-2 border rounded-full hover:bg-surface-100-900')}
				</div>
			{/if}
		{:else if Object.keys(seqOther).length}
			<!-- Select sequences (other than the one currently sequence selected)-->
			<div class={['my-5 ml-10 flex min-h-10 flex-wrap items-end justify-start py-2']}>
				<p class="mr-2 h-max font-bold">Weitere Sequenzen zu diesem Dokument:</p>
				{@render otherSeqSelectors('px-4 h-max underline hover:bg-surface-50-950')}
			</div>
		{:else}
			<div class="my-5 ml-10 min-h-10"></div>
		{/if}

		<!-- Other Sequences -->
		{#if activeType}
			<div
				role="dialog"
				tabindex="0"
				class={[
					'relative flex max-h-[35vh] w-full min-w-200 flex-col gap-2 overflow-y-auto bg-surface-500 p-5 pb-15 text-surface-950',
					isSelectedValidSeq && 'border-t-2'
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
				{#each Object.keys(seqOther[activeType]) as seqId}
					<div
						class="group flex w-full flex-col gap-5 py-5"
						tabindex="0"
						role="dialog"
						data-type="selectable-block"
					>
						<div class={['flex min-h-18 w-full flex-col items-start rounded-xl px-4 py-1']}>
							<h6 class="mr-5 h6">{seqAll[activeType][seqId].preamble}</h6>
							<div class="hidden group-focus-within:block group-hover:block group-focus:block">
								<div class="flex gap-4">
									<a
										class="h-full underline hover:text-primary-500"
										href={`${docId}?seq=${seqId}`}
										onclick={() => {
											if (!keepPanelOpen) {
												closeSeqPanel(0);
											}
										}}
										>Sequenz auswählen
									</a>
									{#if seqAll[activeType][seqId].url_slug}
										<a
											class="h-full underline hover:text-primary-500"
											href={`${dictSeq[activeType]?.url_overview}/${seqAll[activeType][seqId].url_slug}`}
											target="_blank"
											rel="noopener noreferrer"
											>{dictSeq[activeType]?.label_overview}
										</a>
									{/if}
								</div>
							</div>
						</div>
						<div class="flex w-full gap-2 overflow-x-auto px-10 py-1">
							{@render sequenceList(activeType, seqId, seqId === currentSeq.id)}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}
