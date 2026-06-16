<script lang="ts" generics="T extends TRegTypes">
	import { resolve } from '$app/paths';
	import { printDateRange, printBirthRange } from '$lib/functions/ease_of_use/dateFunctions';
	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import type {
		TRegAttrsBibls,
		TRegAttrsEvents,
		TRegAttrsKeywords,
		TRegAttrsMap,
		TRegAttrsOrgs,
		TRegAttrsPeople,
		TRegAttrsPlaces,
		TRegDict,
		TRegTypes
	} from '$lib/types/register/TRegister';

	type TLinkedDoc = {
		docId: string;
		iiif_url: string | null;
		title_full: string | null;
		pubDate: string | null;
	};

	let {
		docType,
		regDict,
		regAttributes,
		crossRef,
		cheatPageHeightInRegSingleColView = ''
	}: {
		docType: T;
		regDict: TRegDict['dict_register'][T];
		regAttributes: Partial<Record<TRegAttrsMap[T], any>> | undefined | null;
		crossRef: {
			orgNames: string[] | null;
			authorNames: string[] | null;
			linkedDocs: TLinkedDoc[];
		};
		cheatPageHeightInRegSingleColView: string;
	} = $props();

	// Function to face-out MetadataTable on scroll
	let opacityMetadataTable = $state(100); // start with full opacity
	function getScrollPosition(ev: Event) {
		const maxScroll = 300; // in pixel
		const target = ev.target as HTMLElement;
		opacityMetadataTable = Math.max(0, Math.min(1 - target.scrollTop / maxScroll, 1)) * 100;
	}
</script>

<!-- Snippet for Metadata Table -->
{#snippet MetadataTable(attKeys: TRegAttrsMap[T][])}
	<table class="my-10 min-w-full" style={`opacity:${opacityMetadataTable}%`}>
		<!-- Header: invisible but for accessibility -->
		<thead>
			<tr class="hidden">
				<th class="px-4 py-2">Key</th>
				<th class="px-4 py-2 text-left">Value</th>
			</tr>
		</thead>

		{#each attKeys.filter(Boolean) as attKey (attKey)}
			{#if attKey}
				<tbody>
					<tr>
						<td class="w-80 px-4 py-2 font-bold"
							>{(regDict.attributes as Record<TRegAttrsMap[T], { label: string }>)[attKey]
								?.label}:</td
						>
						{#if regAttributes?.[attKey]}
							<td class="px-4 py-2 text-left"
								>{@render MetadataValue(attKey, regAttributes[attKey])}</td
							>
						{:else}
							<td class="px-4 py-2 text-left text-muted-foreground">Keine Daten verfügbar</td>
						{/if}
					</tr>
				</tbody>
			{/if}
		{/each}
	</table>
{/snippet}

<!-- Snippet for MetadataValue (inside MetadataTable) -->
{#snippet MetadataValue(attKey: TRegAttrsMap[T], value: any)}
	{#if attKey === 'gndNumber'}
		<a
			class="inline-block underline"
			href={`https://d-nb.info/gnd/${value}`}
			target="_blank"
			rel="noopener noreferrer">{value}</a
		>
	{:else if attKey === 'geoNamesLink'}
		<a class="inline-block underline" href={value} target="_blank" rel="noopener noreferrer"
			>{value}</a
		>
	{:else if attKey === 'date'}
		{printDateRange(value.from, value.to)}
	{:else if attKey === 'orgIds' && value}
		<a class="inline-block underline" href={resolve(`/edition/register/${value}`)}>
			{crossRef.orgNames?.join(', ') ?? value}
		</a>
	{:else if attKey === 'authorIds' && value}
		<a class="inline-block underline" href={resolve(`/edition/register/${value}`)}>
			{crossRef.authorNames?.join(', ') ?? value}
		</a>
	{:else if Array.isArray(value)}
		{value.join(', ')}
	{:else}
		<span>{value}</span>
	{/if}
{/snippet}

<!-- Snippet for LinkedItemsList -->
{#snippet LinkedItemsContainer(docs: TLinkedDoc[] | undefined | null)}
	<div class="flex w-full flex-wrap gap-5 pb-15">
		{#each docs as doc (doc.docId)}
			{@render LinkedItem(doc)}
		{:else}
			<p class="px-4 text-muted-foreground">Keine verlinkten Dokumente gefunden.</p>
		{/each}
	</div>
{/snippet}

<!-- Snippet for LinkedItem (inside LinkedItemsList) -->
{#snippet LinkedItem(doc: TLinkedDoc)}
	<a
		data-sveltekit-preload-data="tap"
		data-sveltekit-preload-code="hover"
		href={resolve(`/edition/${doc.docId}?mode=DF`)}
		class="min-h-27 w-70 rounded-xl p-1 hover:bg-background-hover"
		target="blank"
		rel="noopener noreferrer"
	>
		<div class="grid h-full w-full grid-cols-[1fr_3fr] gap-3 px-3 py-1">
			<div class="flex h-full w-full items-center justify-center">
				<IIIF_Thumb url={doc.iiif_url} classes="max-w-[80px] max-h-[80px]" />
			</div>
			<div class="flex flex-col">
				<span class="italic">{doc.title_full}</span>
				<span class="">{doc.pubDate}</span>
			</div>
		</div>
	</a>
{/snippet}

<!-- Container -->
<!-- Note: TypeScript fails to infer the correct type for 'regAttributes' relative to the 'docType' condition,
     necessitating manual casting to 'regAttrsTyped' throughout this block. -->
<div
	onscroll={getScrollPosition}
	class="w-full overflow-y-auto pl-15"
	style={cheatPageHeightInRegSingleColView}
>
	<!-- MetadataTable (by Type) -->
	{#if docType === 'people'}
		{@const regAttrsTyped = regAttributes as Record<TRegAttrsPeople, any>}
		<h1 class="h1 sticky top-0 z-90 w-full pb-10">
			{regAttrsTyped.name}
			{printBirthRange(regAttrsTyped.dateBirth, regAttrsTyped.dateDeath)}
		</h1>
		{@render MetadataTable([
			'lastname',
			'firstname',
			regAttrsTyped.nameVariants.length && 'nameVariants', // only show when existing
			'type',
			'gndNumber',
			'orgIds',
			'note'
		])}
	{:else if docType === 'places'}
		{@const regAttrsTyped = regAttributes as Record<TRegAttrsPlaces, any>}
		<h1 class="h1 sticky top-0 z-90 w-full pb-10">{regAttrsTyped.name}</h1>

		{@render MetadataTable([
			'type',
			regAttrsTyped.nameVariants.length && 'nameVariants',
			regAttrsTyped.gndNumber && 'gndNumber',
			regAttrsTyped.geoNamesID && 'geoNamesID',
			regAttrsTyped.geoNamesLink && 'geoNamesLink',
			'coords',
			regAttrsTyped.country && 'country',
			'note'
		])}
	{:else if docType === 'orgs'}
		{@const regAttrsTyped = regAttributes as Record<TRegAttrsOrgs, any>}
		<h1 class="h1 sticky top-0 z-90 w-full pb-10">{regAttrsTyped.name}</h1>
		{@render MetadataTable([
			'type',
			regAttrsTyped.nameVariants.length && 'nameVariants',
			regAttrsTyped.gndNumber && 'gndNumber',
			'note'
		])}
	{:else if docType === 'keywords'}
		{@const regAttrsTyped = regAttributes as Record<TRegAttrsKeywords, any>}
		<h1 class="h1 sticky top-0 z-90 w-full pb-10">{regAttrsTyped.name}</h1>
		{@render MetadataTable(['type', regAttrsTyped.gndNumber && 'gndNumber', 'note'])}
	{:else if docType === 'events'}
		{@const regAttrsTyped = regAttributes as Record<TRegAttrsEvents, any>}
		<h1 class="h1 sticky top-0 z-90 w-full pb-10">{regAttrsTyped.name}</h1>
		{@render MetadataTable([regAttrsTyped.date && 'date', 'note'])}
	{:else if docType === 'bibls'}
		{@const regAttrsTyped = regAttributes as Record<TRegAttrsBibls, any>}
		<h1 class="h1 sticky top-0 z-90 w-full pb-10">{regAttrsTyped.name}</h1>
		{@render MetadataTable([
			'type',
			'authorIds',
			'pubDate',
			regAttrsTyped.gndNumber && 'gndNumber',
			'note'
		])}
	{/if}

	<!-- Linked documents -->
	{#if docType === 'people'}
		<!-- //! These lists can later be toggled on/off depending on content -->
		<h2 class="h4 sticky top-15 z-91 h-20 w-full py-5">
			Korrespondenz mit Annemarie Schwarzenbach
		</h2>
		{@render LinkedItemsContainer([])}
		<h2 class="h4 sticky top-15 z-91 h-20 w-full py-5">Verknüpfte Dokumente</h2>
		{@render LinkedItemsContainer(crossRef.linkedDocs)}
		<h2 class="h4 sticky top-15 z-91 h-20 w-full py-5">Verknüpfte Kommentare</h2>
		{@render LinkedItemsContainer([])}
	{:else}
		<h2 class="h4 sticky top-15 z-91 h-20 w-full py-5">Verknüpfte Dokumente</h2>
		<div class="min-h-[40vh]">
			{@render LinkedItemsContainer(crossRef.linkedDocs)}
		</div>
		<h2 class="h4 sticky top-15 z-91 h-20 w-full py-5">Verknüpfte Kommentare</h2>
		{@render LinkedItemsContainer([])}
	{/if}
</div>
