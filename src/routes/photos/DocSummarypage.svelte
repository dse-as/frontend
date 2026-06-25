<script lang="ts">
	import { resolve } from '$app/paths';
	import { dict_docs as dictDocs } from '$lib/dictionaries/dict_docs.json';
	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import type { TResolvedPhotos } from '$lib/functions/ease_of_use/resolveDoc';
	import type {
		TDocKeys,
		TDocMetadataKeys,
		TDocMetadataKeysPhotos
	} from '$lib/types/documents/TDocuments';

	let {
		resDoc,
		crossRef,
		cheatPageHeightInRegSingleColView = ''
	}: {
		resDoc: TResolvedPhotos | null;
		crossRef: Record<'linkedDocs', any>;
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
{#snippet MetadataTable(mKeys: TDocMetadataKeysPhotos[])}
	<table class="my-10 min-w-full" style={`opacity:${opacityMetadataTable}%`}>
		<!-- Header: invisible but for accessibility -->
		<thead>
			<tr class="hidden">
				<th class="px-4 py-2">Key</th>
				<th class="px-4 py-2 text-left">Value</th>
			</tr>
		</thead>

		<!-- Body-->
		{#each mKeys as mKey (mKey)}
			{#if mKey}
				{#if resDoc && resDoc.docType}
					<tbody>
						<tr>
							<td class="w-80 px-4 py-2 font-bold"
								>{dictDocs[resDoc.docType].metadata[mKey]?.label}:</td
							>
							<td class="px-4 py-2 text-left"
								>{@render MetadataValue(mKey, resDoc.item?.metadata[mKey])}</td
							>
						</tr>
					</tbody>
				{/if}
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
			<p class="text-muted-foreground px-4">Keine verlinkten Dokumente gefunden.</p>{/each}
	</div>
{/snippet}

<!-- Snippet for LinkedItem (inside LinkedItemsList) -->
{#snippet LinkedItem(itemId: TDocKeys)}
	{#if crossRef?.linkedDocs}
		<a
			data-sveltekit-preload-data="tap"
			data-sveltekit-preload-code="hover"
			href={resolve(`/${itemId as string}`)}
			class="min-h-27 w-70 rounded-thumbbox p-1 hover:bg-background-hover"
			target="blank"
			rel="noopener noreferrer"
		>
			<div class="grid h-full w-full grid-cols-[1fr_3fr] gap-3 px-3 py-1">
				<div class="container-centered">
					<IIIF_Thumb
						url={crossRef.linkedDocs[itemId]?.manuscript?.iiif_urls[0]}
						classes="max-h-[80px] max-w-[80px] "
					/>
				</div>
				<div class="flex flex-col">
					<span class="italic">{crossRef.linkedDocs[itemId]?.metadata?.title_full}</span>
					<span class="">{crossRef.linkedDocs[itemId]?.metadata?.pubDate}</span>
				</div>
			</div>
		</a>
	{/if}
{/snippet}

<!-- Container -->
<div
	onscroll={getScrollPosition}
	class="w-full overflow-y-auto pl-15"
	style={cheatPageHeightInRegSingleColView}
>
	<!-- MetadataTable (by Type) -->
	{#if resDoc?.docType === 'photos'}
		{@const docMetadataTyped = resDoc?.item?.metadata as Record<TDocMetadataKeysPhotos, any>}
		<h1 class="h1 sticky top-0 z-90 w-full pb-10">
			{docMetadataTyped?.title}
		</h1>
		<!-- //! CHECK THIS -->
		{@render MetadataTable(['pubDate', docMetadataTyped?.date && 'date'])}
	{/if}

	<!-- Linked documents -->
	<h2 class="h4 sticky top-15 z-91 h-20 w-full py-5">Edierte Textstufen</h2>
	<div class="min-h-[40vh]">
		<!-- TODO -->
		<!-- {@render LinkedItemsContainer(resDoc?.item?.metadata?.globalEntities?.documents as TDocKeys[])} -->
	</div>
	<h2 class="h4 sticky top-15 z-91 h-20 w-full py-5">Sequenzen</h2>
	<p>TODO</p>
</div>
