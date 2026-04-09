<script lang="ts">
	import { register as reg } from '$lib/data/register.json';
	import { dict_register as dictReg } from '$lib/dictionaries/dict_register.json';
	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import { lookupDocInfo } from '$lib/functions/lookupDocInfo';
	import { resolve } from '$app/paths';
	// import { TRegister, TRegKeys, TEntityTypes } from '$lib/types/register/TRegister';

	let { metadata, regType, attributes, regId } = $props();

	import { printDateRange, printBirthRange } from '$lib/functions/dateFunctions';
</script>

<div class="h-full w-full overflow-y-auto p-20 pt-16">
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

	<!-- Snippet: Metadata Table -->
	{#snippet MetadataTable(attKeys)}
		<!-- {#snippet MetadataTable(attKeys: keyof TRegister['register'][TEntityTypes][TRegKeys])} -->
		<table class="my-10 min-w-full border-gray-300 bg-white">
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
							<td class="w-80 px-4 py-2 font-bold">{dictReg[regType].attributes[attKey]?.label}:</td
							>
							<td class="px-4 py-2 text-left"
								>{@render MetadataValue(attKey, attributes[attKey])}</td
							>
						</tr>
					</tbody>
				{/if}
			{/each}
		</table>
	{/snippet}

	<!-- People -->
	{#if regType === 'people'}
		<h1 class="h1">
			{attributes.name}
			{printBirthRange(attributes.dateBirth, attributes.dateDeath)}
		</h1>
		{@render MetadataTable([
			'lastname',
			'firstname',
			attributes.nameVariants.length && 'nameVariants',
			'type',
			'gndNumber',
			'orgId',
			'note'
		])}

		<!-- Places / Organisations / Keywords -->
	{:else if regType === 'places'}
		<h1 class="h1">{attributes.name}</h1>
		{@render MetadataTable([
			'type',
			attributes.nameVariants.length && 'nameVariants',
			attributes.gndNumber && 'gndNumber',
			attributes.geoNamesLink && 'geoNamesLink',
			'coords',
			attributes.country && 'country',
			'note'
		])}
		<!-- Organisations -->
	{:else if regType === 'orgs'}
		<h1 class="h1">{attributes.name}</h1>
		{@render MetadataTable([
			'type',
			attributes.nameVariants.length && 'nameVariants',
			attributes.gndNumber && 'gndNumber',
			'note'
		])}

		<!-- Keywords -->
	{:else if regType === 'keywords'}
		<h1 class="h1">{attributes.name}</h1>
		{@render MetadataTable(['type', attributes.gndNumber && 'gndNumber', 'note'])}

		<!-- Events -->
	{:else if regType === 'events'}
		<h1 class="h1">{attributes.name}</h1>
		{@render MetadataTable(['date', 'note'])}

		<!-- Bibliography -->
	{:else if regType === 'bibls'}
		<h1 class="h1">{attributes.name}</h1>
		<!-- {@render MetadataTable(Object.keys(attributes))} -->
		{@render MetadataTable([
			'type',
			'authorId',
			'pubDate',
			attributes.gndNumber && 'gndNumber',
			'note'
		])}
	{/if}

	<!-- Linked documents -->
	<!-- Snippet LinkedItems -->
	{#snippet LinkedItems(docId)}
		{@const attributesInfo = lookupDocInfo(docId, metadata)}
		<a
			href={`/edition/${docId}`}
			class="min-h-27 w-70 rounded-xl bg-surface-50-950 p-1 hover:bg-surface-200-800"
			target="blank"
			rel="noopener noreferrer"
		>
			<div class="grid h-full w-full grid-cols-[1fr_3fr] gap-3 px-3 py-1">
				<div class="flex h-full w-full items-center justify-center">
					<IIIF_Thumb url={attributesInfo.fac} maxWidth="80" maxHeight="80" classes="rounded-xl" />
				</div>
				<div class="flex flex-col">
					<span class="italic">{attributesInfo.details.title}</span>
					<span class="">{attributesInfo.details.datestring}</span>
				</div>
			</div>
		</a>
	{/snippet}

	<!-- LinkedItemsList -->
	{#snippet LinkedItemsContainer(docIds)}
		<div class="flex w-full flex-wrap gap-5 p-10">
			{#each docIds as docId}
				{@render LinkedItems(docId)}
			{/each}
		</div>
	{/snippet}

	{#if regType === 'people'}
		<h2 class="h4">Korrespondenz mit A. Schwarzenbach</h2>
		{@render LinkedItemsContainer(reg[regType][regId]?.docs)}
		<h2 class="h4">Weitere Dokumente</h2>
		{@render LinkedItemsContainer(reg[regType][regId]?.docs)}
	{:else}
		<h2 class="h4">Verlinkte Dokumente</h2>
		{@render LinkedItemsContainer(reg[regType][regId]?.docs)}
	{/if}
</div>
