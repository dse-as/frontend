<script lang="ts" generics="T extends TRegTypes">
	import { asset, resolve } from '$app/paths';
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
		cheatPageHeightInRegSingleColView = '',
		regMapPreviewPath
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
		regMapPreviewPath: any; //! FIX any type
	} = $props();

	// Function to fade-out MetadataTable on scroll
	let opacityMetadataTable = $state(100); // start with full opacity
	function getScrollPosition(ev: Event) {
		const maxScroll = 100; // in pixel
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
						<td
							class="w-80 px-4 py-2 font-bold"
							//! simplify this type
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

<!-- Map Preview -->
{#snippet MapPreview(regMapPreviewPath: string | null | undefined)}
	{#if regMapPreviewPath}
		<div class="relative container mx-5 mb-10 h-80 w-250 border-2 border-dark-40">
			<div
				class="relative container h-full w-full bg-cover bg-center bg-no-repeat"
				style={`background-image: url('${asset(regMapPreviewPath)}');`}
			>
				<div class="container-centered absolute h-full w-full bg-white opacity-60"></div>
				<a
					class="container-centered absolute h-full w-full font-sans text-lg font-bold text-black"
					href={resolve('/map')}
					>Zur Kartenansicht
				</a>
			</div>
		</div>
	{/if}
{/snippet}

<!-- Snippet for MetadataValue (inside MetadataTable) -->
{#snippet MetadataValue(attKey: TRegAttrsMap[T], value: any)}
	{#if attKey === 'gndNumber'}
		<a
			class="hyperlink inline-block"
			href={`https://d-nb.info/gnd/${value}`}
			target="_blank"
			rel="noopener noreferrer">{value}</a
		>
	{:else if attKey === 'geoNamesLink'}
		<a class="hyperlink inline-block" href={value} target="_blank" rel="noopener noreferrer"
			>{value}</a
		>
	{:else if attKey === 'date'}
		{printDateRange(value.from, value.to)}
	{:else if attKey === 'orgIds' && value}
		<a class="hyperlink inline-block" href={resolve(`/register/${value}`)}>
			{crossRef.orgNames?.join(', ') ?? value}
		</a>
	{:else if attKey === 'authorIds' && value}
		<a class="hyperlink inline-block" href={resolve(`/register/${value}`)}>
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
		href={resolve(`/${doc.docId}?mode=DF`)}
		class="min-h-27 w-70 rounded-thumbbox p-1 hover:bg-background-hover"
		target="blank"
		rel="noopener noreferrer"
	>
		<div class="grid h-full w-full grid-cols-[1fr_3fr] gap-3 px-3 py-1">
			<div class="container-centered">
				<IIIF_Thumb url={doc.iiif_url} classes="max-w-[80px] max-h-[80px]" />
			</div>
			<div class="flex flex-col">
				<span class="line-clamp-2 italic">{doc.title_full}</span>
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
		<h1 class="h1 sticky top-0 z-90 w-full bg-background pb-10">
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
		<h1 class="h1 sticky top-0 z-90 w-full bg-background pb-10">{regAttrsTyped.name}</h1>

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
		{@render MapPreview(regMapPreviewPath?.img_path)}
	{:else if docType === 'orgs'}
		{@const regAttrsTyped = regAttributes as Record<TRegAttrsOrgs, any>}
		<h1 class="h1 sticky top-0 z-90 w-full bg-background pb-10">{regAttrsTyped.name}</h1>
		{@render MetadataTable([
			'type',
			regAttrsTyped.nameVariants.length && 'nameVariants',
			regAttrsTyped.gndNumber && 'gndNumber',
			'note'
		])}
	{:else if docType === 'keywords'}
		{@const regAttrsTyped = regAttributes as Record<TRegAttrsKeywords, any>}
		<h1 class="h1 sticky top-0 z-90 w-full bg-background pb-10">{regAttrsTyped.name}</h1>
		{@render MetadataTable(['type', regAttrsTyped.gndNumber && 'gndNumber', 'note'])}
	{:else if docType === 'events'}
		{@const regAttrsTyped = regAttributes as Record<TRegAttrsEvents, any>}
		<h1 class="h1 sticky top-0 z-90 w-full bg-background pb-10">{regAttrsTyped.name}</h1>
		{@render MetadataTable([regAttrsTyped.date && 'date', 'note'])}
		{@render MapPreview(regMapPreviewPath?.img_path)}
	{:else if docType === 'bibls'}
		{@const regAttrsTyped = regAttributes as Record<TRegAttrsBibls, any>}
		<h1 class="h1 sticky top-0 z-90 w-full bg-background pb-10">{regAttrsTyped.name}</h1>
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
