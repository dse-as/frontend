<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import IIIF_Thumb from './IIIF_Thumb.svelte';
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

	// Get sequences
	const seqMatching = $derived(findMatchingSequences(seqAll, docId)); //! This could go to server-route
	// console.log(JSON.stringify(seqMatching, null, 2));

	const seqCurrent = $derived(seqMatching[currentSeq.type]?.[currentSeq.id]);
	const prevId = $derived(seqCurrent?.docsBefore[seqCurrent?.docsBefore.length - 1] || null);
	const nextId = $derived(seqCurrent?.docsAfter[0] || null);

	// UI-State
	let isSelectedValidSeq = $derived(currentSeq.type ? true : false);
	let isOpenSeqPanel = $state(false);
	let isHoveredSeqNavPanel = $state(false);
	let isHoveredSeqLargePanel = $state(false);
	let isHoveredAlltypes = $state(false);

	// UI-Elements
	let elSeqNavPanel: HTMLElement = $state();
	let elSeqNavPanelSize = $derived.by(() => {
		if (elSeqNavPanel) {
			return {
				top: elSeqNavPanel.getBoundingClientRect().top,
				bottom: elSeqNavPanel.getBoundingClientRect().bottom,
				width: elSeqNavPanel.clientWidth
			};
		} else {
			return { bottom: 0, width: 0 };
		}
	});
	let elSeqLargePanel: HTMLElement = $state();

	// UI-Choices
	let selectedType: TSeqType | null = $state(null);

	function resetSelectedType() {
		setTimeout(() => {
			if (!isHoveredAlltypes) {
				selectedType = null;
			}
		}, 100);
	}

	// Functions
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

	// Textstufen
	const textstufen = metadata[docId]?.metadata.textstufen_edited || [];

	// Scroll Gallery
	function scrollSeqToCurrentPage() {}

	$effect(() => {
		scrollSeqToCurrentPage();
	});

	function scrollIntoView(el, seqId) {
		console.log(el, seqId);
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
</script>

<!-- Snippets -->
{#snippet seqItem(itemId, seqId)}
	{@const itemInfo = lookupInfo(itemId)}
	<a
		href={`${itemId}?seq=${seqId}`}
		class={['w-70 rounded-xl p-1', docId !== itemId && 'hover:bg-surface-100-900']}
		onclick={() => {
			// isOpenSeqPanel = false;
		}}
	>
		<div class="grid grid-cols-[1fr_3fr] gap-3 px-3 py-1">
			<IIIF_Thumb url={itemInfo.fac} width="50" classes="rounded-xl" />
			<div class="flex flex-col">
				<span class="italic">{itemInfo.details.title}</span>
				<span class="italic">{itemInfo.details.datestring}</span>
			</div>
		</div>
	</a>
{/snippet}

{#snippet sequenceList(seqType: TSeqType, seqId: TSeqId)}
	<div class="flex overflow-x-auto overflow-y-clip pb-6">
		<div class="flex min-w-200 gap-2 rounded-xl bg-surface-200-800">
			{#each seqMatching[seqType]?.[seqId]?.docsBefore || [] as itemId}
				{@render seqItem(itemId, seqId)}
			{/each}
		</div>
		<div
			class="bg-surface-50-900 mx-2 flex rounded-xl"
			{@attach (el) => {
				scrollIntoView(el, seqId);
			}}
		>
			{@render seqItem(docId, seqId)}
		</div>
		<div class="flex min-w-200 gap-2 rounded-xl bg-surface-200-800">
			{#each seqMatching[seqType]?.[seqId]?.docsAfter || [] as itemId}
				{@render seqItem(itemId, seqId)}
			{/each}
		</div>
	</div>
{/snippet}

<!-- Fixed Small NavPanel -->
{#if !isSelectedValidSeq}
	<div bind:this={elSeqNavPanel} class="z-90003 my-5 py-5">
		<button
			class="z-90003 rounded-full border px-4 py-2 font-bold"
			onclick={() => {
				isOpenSeqPanel = true;
			}}>Sequenz wählen...</button
		>
	</div>
{:else}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={elSeqNavPanel}
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
					Sequenz: <span>{seqAll[currentSeq.type][currentSeq.id].preamble} </span>
				</h6>
			</div>
		</div>

		<div class="flex w-full justify-center gap-6">
			<a
				class={[
					'flex items-center rounded-full border px-4 hover:bg-surface-100-900',
					!prevId && 'pointer-events-none '
				]}
				href={`${prevId}?seq=${currentSeq.id}`}
			>
				<div class="flex flex-row items-center gap-2">
					<i class="fa-solid fa-chevron-left"></i>
					<p>{dictSeq[currentSeq.type]?.label_prev}</p>
				</div>
			</a>
			<button
				class="z-10 h-10 w-10 translate-y-5 rounded-full border-b-2 border-surface-300-700 bg-surface-50-950 text-surface-700-300"
				aria-label="expand box"
				onclick={() => {
					isOpenSeqPanel = !isOpenSeqPanel;
				}}
				onmouseenter={() => {
					isOpenSeqPanel = true;
				}}
			>
				<i class={['fa-solid', isOpenSeqPanel ? 'fa-chevron-up' : 'fa-chevron-down']}></i>
			</button>

			<a
				class={[
					'flex items-center rounded-full border px-4 hover:bg-surface-100-900',
					!nextId && 'pointer-events-none'
				]}
				href={`${nextId}?seq=${currentSeq.id}`}
			>
				<div class="flex flex-row items-center gap-2">
					<p>{dictSeq[currentSeq.type]?.label_next}</p>
					<i class="fa-solid fa-chevron-right"></i>
				</div>
			</a>
		</div>
	</div>
{/if}
<!-- Large Panel  -->
{#if isOpenSeqPanel}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={elSeqLargePanel}
		class="absolute z-90002 flex h-max w-8/10 min-w-200 flex-col overflow-x-auto rounded-xl border-2 bg-surface-50-950 pt-40 pb-2 transition-all duration-200"
		style={`top:${elSeqNavPanelSize.top - 60}px;`}
		onmouseenter={() => {
			isHoveredSeqLargePanel = true;
		}}
		onmouseleave={() => {
			isHoveredSeqLargePanel = false;
			setTimeout(() => {
				if (!isHoveredSeqNavPanel && !isHoveredAlltypes) {
					isOpenSeqPanel = false;
				}
			}, 100);
		}}
	>
		{#snippet otherSeqList(buttonStyle: string)}
			{#each Object.keys(seqMatching) as seqType}
				<button
					class={[
						buttonStyle,
						selectedType === seqType ? 'text-primary-500' : 'text-surface-900-100'
					]}
					onmouseleave={resetSelectedType}
					onmousemove={() => {
						selectedType = seqType;
					}}
					onclick={() => {
						selectedType = seqType;
					}}
				>
					{dictSeq[seqType].label_plural}
				</button>
			{/each}
		{/snippet}

		<!-- Current Sequence -->
		{#if isSelectedValidSeq}
			<div>
				<div class="flex w-full gap-2 overflow-x-auto px-10 py-1">
					{@render sequenceList(currentSeq.type, currentSeq.id)}
				</div>
			</div>
		{/if}

		<!-- Other Sequences Selector -->
		{#if isSelectedValidSeq}
			<div class={['mt-5 flex flex-wrap justify-start gap-y-4 text-sm']}>
				<p class="mx-5 font-bold">Weitere Sequenzen zu diesem Dokument:</p>

				{@render otherSeqList(`px-2 pb-4 underline`)}
			</div>
		{:else}
			<div class="flex flex-wrap justify-center gap-y-4 text-sm">
				{@render otherSeqList(`px-2 pb-4 text-xl hover:bg-surface-200-800`)}
			</div>
		{/if}

		<!-- Other Sequences -->
		{#if selectedType}
			<button
				class="relative flex max-h-160 w-full min-w-200 flex-col gap-10 overflow-y-auto border-y-2 bg-surface-500 p-5 pb-15"
				onmouseenter={() => {
					isHoveredAlltypes = true;
				}}
				onmouseleave={() => {
					isHoveredAlltypes = false;
					setTimeout(() => {
						if (!isHoveredSeqNavPanel && !isHoveredSeqLargePanel) {
							isOpenSeqPanel = false;
						}
					}, 100);
					resetSelectedType();
				}}
			>
				{#each Object.keys(seqMatching[selectedType]) as seqId}
					<div class="flex w-full flex-col gap-5 py-5">
						<div class="flex flex-col items-start">
							<h6 class="h6">{seqAll[selectedType][seqId].preamble}</h6>
							{#if dictSeq[currentSeq.type]?.label_overview}
								<a
									class="underline"
									href={`${dictSeq[currentSeq.type]?.url_overview}/${seqAll[selectedType][seqId].url_slug}`}
									>{dictSeq[currentSeq.type]?.label_overview}
								</a>
							{/if}
						</div>
						{@render sequenceList(selectedType, seqId)}
					</div>
				{/each}
			</button>
		{/if}
	</div>
{/if}
