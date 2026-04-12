<script lang="ts">
	import { resolve } from '$app/paths';

	//! IMPROVE: It would be nice to drop the import of reg and move everything to the server load function.
	// To do so, each regAttribute has to be parsed for orgId and personId in the load function.
	import { register as reg } from '$lib/data/register.json';
	import { dict_register as dictReg } from '$lib/dictionaries/dict_register.json';
	import { printDateRange, printBirthRange } from '$lib/functions/ease_of_use/dateFunctions';

	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import { findEdTypeByDocId } from '$lib/functions/ease_of_use/findEdTypeByDocId';

	let { fullMeta, regType, regAttributes, cheatPageHeightInRegSingleColView = '' } = $props();

	// Function to face-out MetadataTable on scroll
	let opacityMetadataTable = $state(100); // start with full opacity
	function getScrollPosition(ev) {
		const maxScroll = 300; // in pixel
		opacityMetadataTable = Math.max(0, Math.min(1 - ev.target.scrollTop / maxScroll, 1)) * 100;
	}
</script>

<!-- Snippet: Metadata Table -->
{#snippet MetadataTable(attKeys)}
	<!-- {#snippet MetadataTable(attKeys: keyof TRegister['register'][TEntityTypes][TRegKeys])} -->
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
		{#each attKeys as attKey}
			{#if attKey}
				<tbody>
					<tr>
						<td class="w-80 px-4 py-2 font-bold">{dictReg[regType].attributes[attKey]?.label}:</td>
						<td class="px-4 py-2 text-left"
							>{@render MetadataValue(attKey, regAttributes[attKey])}</td
						>
					</tr>
				</tbody>
			{/if}
		{/each}
	</table>
{/snippet}

<!-- Snippet for MetadataValue (inside MetadataTable) -->
{#snippet MetadataValue(attKey, value)}
	{#if attKey === 'gndNumber'}
		<a
			class="inline-block underline"
			href="https://d-nb.info/gnd/${value}"
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
			{`${reg.orgs[value]?.name}`}
		</a>
	{:else if attKey === 'authorId' && value}
		<a class="inline-block underline" href={resolve(`/edition/register/${value}`)}>
			{`${reg.people[value]?.name}`}
		</a>
	{:else}
		<span>{value}</span>
	{/if}
{/snippet}

<!-- Snippet for LinkedItemsList -->
{#snippet LinkedItemsContainer(docIds)}
	<div class="flex w-full flex-wrap gap-5 pb-15">
		{#each docIds as docId}
			{@render LinkedItems(docId)}
		{:else}
			<p class="px-4">Keine verlinkten Dokumente gefunden.</p>{/each}
	</div>
{/snippet}

<!-- Snippet for LinkedItems (inside LinkedItemsList) -->
{#snippet LinkedItems(itemId)}
	{@const itemType = findEdTypeByDocId(itemId)}
	{@const itemMeta = fullMeta[itemType][itemId]}
	<a
		href={`/edition/${itemId}`}
		class="min-h-27 w-70 rounded-xl bg-surface-50-950 p-1 hover:bg-surface-200-800"
		target="blank"
		rel="noopener noreferrer"
	>
		<div class="grid h-full w-full grid-cols-[1fr_3fr] gap-3 px-3 py-1">
			<div class="flex h-full w-full items-center justify-center">
				<IIIF_Thumb
					url={itemMeta?.manuscript?.iiif_urls[0]}
					maxWidth="80"
					maxHeight="80"
					classes="rounded-xl"
				/>
			</div>
			<div class="flex flex-col">
				<span class="italic">{itemMeta?.metadata?.title_full}</span>
				<span class="">{itemMeta?.metadata?.pubDate}</span>
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
	{#if regType === 'people'}
		<h1 class="sticky top-0 z-90 w-full bg-success-50-950 pb-10 h1">
			{regAttributes.name}
			{printBirthRange(regAttributes.dateBirth, regAttributes.dateDeath)}
		</h1>
		{@render MetadataTable([
			'lastname',
			'firstname',
			regAttributes.nameVariants.length && 'nameVariants', // only show when existing
			'type',
			'gndNumber',
			'orgId',
			'note'
		])}
	{:else if regType === 'places'}
		<h1 class="sticky top-0 z-90 w-full bg-success-50-950 pb-10 h1">{regAttributes.name}</h1>
		{@render MetadataTable([
			'type',
			regAttributes.nameVariants.length && 'nameVariants',
			regAttributes.gndNumber && 'gndNumber',
			regAttributes.geoNamesLink && 'geoNamesLink',
			'coords',
			regAttributes.country && 'country',
			'note'
		])}
	{:else if regType === 'orgs'}
		<h1 class="sticky top-0 z-90 w-full bg-success-50-950 pb-10 h1">{regAttributes.name}</h1>
		{@render MetadataTable([
			'type',
			regAttributes.nameVariants.length && 'nameVariants',
			regAttributes.gndNumber && 'gndNumber',
			'note'
		])}
	{:else if regType === 'keywords'}
		<h1 class="sticky top-0 z-90 w-full bg-success-50-950 pb-10 h1">{regAttributes.name}</h1>
		{@render MetadataTable(['type', regAttributes.gndNumber && 'gndNumber', 'note'])}
	{:else if regType === 'events'}
		<h1 class="sticky top-0 z-90 w-full bg-success-50-950 pb-10 h1">{regAttributes.name}</h1>
		{@render MetadataTable(['date', 'note'])}
	{:else if regType === 'bibls'}
		<h1 class="sticky top-0 z-90 w-full bg-success-50-950 pb-10 h1">{regAttributes.name}</h1>
		{@render MetadataTable([
			'type',
			'authorId',
			'pubDate',
			regAttributes.gndNumber && 'gndNumber',
			'note'
		])}
	{/if}

	<!-- Linked documents -->
	{#if regType === 'people'}
		<!-- //! These lists can later be toggled on/off depending on content -->
		<h2 class="sticky top-15 z-91 h-20 w-full bg-surface-50-950 py-5 h4">
			Korrespondenz mit Annemarie Schwarzenbach
		</h2>
		{@render LinkedItemsContainer(regAttributes?.docs)}
		<h2 class="sticky top-15 z-91 h-20 w-full bg-surface-50-950 py-5 h4">Weitere Dokumente</h2>
		{@render LinkedItemsContainer(regAttributes?.docs)}
	{:else}
		<h2 class="sticky top-15 z-91 h-20 w-full bg-surface-50-950 py-5 h4">Verlinkte Dokumente</h2>
		<div class="min-h-[40vh]">{@render LinkedItemsContainer(regAttributes?.docs)}</div>
	{/if}
</div>
