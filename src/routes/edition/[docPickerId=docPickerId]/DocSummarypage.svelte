<script lang="ts">
	import { resolve } from '$app/paths';

	import { dict_docs as dictDocs } from '$lib/dictionaries/dict_docs.json';
	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
	import { documents as allDocsRaw } from '$lib/data/documents.json';
	import type {
		TDocItems,
		TDocKeys,
		TDocMetadataKeys,
		TDocMetadataKeysLetters,
		TDocMetadataKeysLongforms,
		TDocMetadataKeysSmallforms,
		TDocTypes,
		TDocuments
	} from '$lib/types/documents/TDocuments';

	const allDocs = allDocsRaw as TDocuments['documents'];

	let {
		docType,
		docId,
		docItem,
		cheatPageHeightInRegSingleColView = ''
	}: {
		docType: TDocTypes;
		docId: TDocKeys;
		docItem: TDocItems;
		cheatPageHeightInRegSingleColView: string;
	} = $props();

	// Function to fade-out MetadataTable on scroll
	const defaultOpacity = 100; // start with full opacity
	let opacityMetadataTable = $state(defaultOpacity);
	function getScrollPosition(ev: Event) {
		const maxScroll = 300; // in pixel
		const target = ev.target as HTMLElement | null;
		opacityMetadataTable = target
			? Math.max(0, Math.min(1 - target.scrollTop / maxScroll, 1)) * 100
			: defaultOpacity;
	}
</script>

<!-- Snippet: Metadata Table -->
{#snippet MetadataTable(mKeys: TDocMetadataKeys[])}
	<table
		class="my-10 min-w-full border-gray-300 bg-white"
		style={`opacity:${opacityMetadataTable}%`}
	>
		<!-- Header: invisible but for accessibility -->
		<thead>
			<tr class="hidden bg-gray-200">
				<th class="px-4 py-2">Key</th>
				<th class="px-4 py-2 text-left">Value</th>
			</tr>
		</thead>

		<!-- Body-->
		{#each mKeys as mKey (mKey)}
			{#if mKey}
				<tbody>
					<tr>
						<td class="w-80 px-4 py-2 font-bold">{dictDocs[docType].metadata[mKey]?.label}:</td>
						<td class="px-4 py-2 text-left"
							>{@render MetadataValue(mKey, docItem.metadata[mKey])}</td
						>
					</tr>
				</tbody>
			{/if}
		{/each}
	</table>
{/snippet}

<!-- Snippet for MetadataValue (inside MetadataTable) -->
{#snippet MetadataValue(mKey: TDocMetadataKeys, value: unknown)}
	{#if mKey}
		<span>{String(value)}</span>
	{/if}
{/snippet}

<!-- Snippet for LinkedItemsList -->
{#snippet LinkedItemsContainer(docIds: TDocKeys[])}
	<div class="flex w-full flex-wrap gap-5 pb-15">
		{#each docIds as docId (docId)}
			{@render LinkedItem(docId)}
		{:else}
			<p class="px-4 text-surface-700">Keine verlinkten Dokumente gefunden.</p>{/each}
	</div>
{/snippet}

<!-- Snippet for LinkedItem (inside LinkedItemsList) -->
{#snippet LinkedItem(itemId: TDocKeys)}
	{@const { item: resDoc } = resolveDoc(allDocs, docId) || { item: null }}
	<a
		href={resolve(`/edition/${itemId as string}`)}
		class="min-h-27 w-70 rounded-xl bg-surface-50-950 p-1 hover:bg-surface-200-800"
		target="blank"
		rel="noopener noreferrer"
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
				<span class="italic">{resDoc?.metadata?.title_full}</span>
				<span class="">{resDoc?.metadata?.pubDate}</span>
			</div>
		</div>
	</a>
{/snippet}

<!-- Container -->
<div
	onscroll={getScrollPosition}
	class="w-full overflow-y-auto pl-15"
	style={cheatPageHeightInRegSingleColView}
>
	<!-- MetadataTable (by Type) -->
	{#if docType === 'letters'}
		{@const docMetadataTyped = docItem.metadata as Record<TDocMetadataKeysLetters, any>}
		<h1 class="sticky top-0 z-90 w-full bg-success-50-950 pb-10 h1">
			{docMetadataTyped?.label}
		</h1>
		{@render MetadataTable(['pubDate', docMetadataTyped?.year && 'year'])}
	{:else if docType === 'smallforms'}
		{@const docMetadataTyped = docItem.metadata as Record<TDocMetadataKeysSmallforms, any>}
		<h1 class="sticky top-0 z-90 w-full bg-success-50-950 pb-10 h1">
			{docMetadataTyped?.label}
		</h1>
		{@render MetadataTable(['pubDate', docMetadataTyped?.year && 'year'])}
	{:else if docType === 'longforms'}
		{@const docMetadataTyped = docItem.metadata as Record<TDocMetadataKeysLongforms, any>}
		<h1 class="sticky top-0 z-90 w-full bg-success-50-950 pb-10 h1">
			{docMetadataTyped?.label}
		</h1>
		{@render MetadataTable(['pubDate', docMetadataTyped?.year && 'year'])}
	{/if}

	<!-- Linked documents -->
	<h2 class="sticky top-15 z-91 h-20 w-full bg-surface-50-950 py-5 h4">Edierte Textstufen</h2>
	<div class="min-h-[40vh]">
		{@render LinkedItemsContainer(docItem.metadata?.textstufen_edited as TDocKeys[])}
	</div>
	<h2 class="sticky top-15 z-91 h-20 w-full bg-surface-50-950 py-5 h4">Sequenzen</h2>
	<p>TODO</p>
</div>
