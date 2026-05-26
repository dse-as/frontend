<script lang="ts" generics="T extends TRegTypes">
	import { resolve } from '$app/paths';

	//! IMPROVE: It would be nice to drop the import of reg and move everything to the server load function.
	// To do so, each regAttribute has to be parsed for orgId and personId in the load function.
	import { register as reg } from '$lib/data/register.json';
	import { printDateRange, printBirthRange } from '$lib/functions/ease_of_use/dateFunctions';

	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import type {
		TRegAttrs,
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
	import { type TPeopleKeys } from '$lib/types/register/TPeopleKeys';
	import { type TOrgsKeys } from '$lib/types/register/TOrgsKeys';
	import { type TDocKeys, type TDocuments } from '$lib/types/documents/TDocuments';
	import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';

	let {
		docType,
		allDocs,
		regDict,
		regAttributes,
		cheatPageHeightInRegSingleColView = ''
	}: {
		docType: T;
		allDocs: TDocuments['documents'];
		regDict: TRegDict['dict_register'][T];
		regAttributes: Record<TRegAttrsMap[T], any>;
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

		{#each attKeys.filter(Boolean) as attKey (attKey)}
			{#if attKey}
				<tbody>
					<tr>
						<td class="w-80 px-4 py-2 font-bold"
							>{(regDict.attributes as Record<TRegAttrsMap[T], { label: string }>)[attKey]
								?.label}:</td
						>
						{#if regAttributes[attKey]}
							<td class="px-4 py-2 text-left"
								>{@render MetadataValue(attKey, regAttributes[attKey])}</td
							>
						{:else}
							<td class="px-4 py-2 text-left text-gray-300">Keine Daten verfügbar</td>
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
	{:else if Array.isArray(value)}
		{value.join(', ')}
	{:else if attKey === 'date'}
		{printDateRange(value.from, value.to)}
	{:else if attKey === 'orgId' && value}
		<a class="inline-block underline" href={resolve(`/edition/register/${value}`)}>
			{`${reg.orgs[value as TOrgsKeys]?.name}`}
		</a>
	{:else if attKey === 'authorId' && value}
		<a class="inline-block underline" href={resolve(`/edition/register/${value}`)}>
			{`${reg.people[value as TPeopleKeys]?.name}`}
		</a>
	{:else}
		<span>{value}</span>
	{/if}
{/snippet}

<!-- Snippet for LinkedItemsList -->
{#snippet LinkedItemsContainer(docIds: TDocKeys[])}
	<div class="flex w-full flex-wrap gap-5 pb-15">
		{#each docIds as docId (docId)}
			{@render LinkedItem(docId)}
		{:else}
			<p class="px-4 text-surface-500">Keine verlinkten Dokumente gefunden.</p>
		{/each}
	</div>
{/snippet}

<!-- Snippet for LinkedItem (inside LinkedItemsList) -->
{#snippet LinkedItem(docId: TDocKeys)}
	{@const { item: resDoc } = resolveDoc(allDocs, docId) || { item: null }}
	<a
		href={resolve(`/edition/${docId as string}?mode=DF`)}
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
		<h1 class="sticky top-0 z-90 w-full bg-success-50-950 pb-10 h1">
			{regAttrsTyped.name}
			{printBirthRange(regAttrsTyped.dateBirth, regAttrsTyped.dateDeath)}
		</h1>
		{@render MetadataTable([
			'lastname',
			'firstname',
			regAttrsTyped.nameVariants.length && 'nameVariants', // only show when existing
			'type',
			'gndNumber',
			'orgId',
			'note'
		])}
	{:else if docType === 'places'}
		{@const regAttrsTyped = regAttributes as Record<TRegAttrsPlaces, any>}
		<h1 class="sticky top-0 z-90 w-full bg-success-50-950 pb-10 h1">{regAttrsTyped.name}</h1>

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
		<h1 class="sticky top-0 z-90 w-full bg-success-50-950 pb-10 h1">{regAttrsTyped.name}</h1>
		{@render MetadataTable([
			'type',
			regAttrsTyped.nameVariants.length && 'nameVariants',
			regAttrsTyped.gndNumber && 'gndNumber',
			'note'
		])}
	{:else if docType === 'keywords'}
		{@const regAttrsTyped = regAttributes as Record<TRegAttrsKeywords, any>}
		<h1 class="sticky top-0 z-90 w-full bg-success-50-950 pb-10 h1">{regAttrsTyped.name}</h1>
		{@render MetadataTable(['type', regAttrsTyped.gndNumber && 'gndNumber', 'note'])}
	{:else if docType === 'events'}
		{@const regAttrsTyped = regAttributes as Record<TRegAttrsEvents, any>}
		<h1 class="sticky top-0 z-90 w-full bg-success-50-950 pb-10 h1">{regAttrsTyped.name}</h1>
		{@render MetadataTable([regAttrsTyped.date && 'date', 'note'])}
	{:else if docType === 'bibls'}
		{@const regAttrsTyped = regAttributes as Record<TRegAttrsBibls, any>}
		<h1 class="sticky top-0 z-90 w-full bg-success-50-950 pb-10 h1">{regAttrsTyped.name}</h1>
		{@render MetadataTable([
			'type',
			'authorId',
			'pubDate',
			regAttrsTyped.gndNumber && 'gndNumber',
			'note'
		])}
	{/if}

	<!-- Linked documents -->
	{#if docType === 'people'}
		<!-- //! These lists can later be toggled on/off depending on content -->
		<h2 class="sticky top-15 z-91 h-20 w-full bg-surface-50-950 py-5 h4">
			Korrespondenz mit Annemarie Schwarzenbach
		</h2>
		{@render LinkedItemsContainer([])}
		<h2 class="sticky top-15 z-91 h-20 w-full bg-surface-50-950 py-5 h4">Verknüpfte Dokumente</h2>
		{@render LinkedItemsContainer((regAttributes as Record<TRegAttrsPeople, any>)?.docs)}
		<h2 class="sticky top-15 z-91 h-20 w-full bg-surface-50-950 py-5 h4">Verknüpfte Kommentare</h2>
		{@render LinkedItemsContainer([])}
	{:else}
		<h2 class="sticky top-15 z-91 h-20 w-full bg-surface-50-950 py-5 h4">Verknüpfte Dokumente</h2>
		<div class="min-h-[40vh]">
			{@render LinkedItemsContainer((regAttributes as Record<TRegAttrs, any>)?.docs)}
		</div>
		<h2 class="sticky top-15 z-91 h-20 w-full bg-surface-50-950 py-5 h4">Verknüpfte Kommentare</h2>
		{@render LinkedItemsContainer([])}
	{/if}
</div>
