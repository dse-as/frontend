<script lang="ts">
	import { resolve } from '$app/paths';
	import { tick } from 'svelte';
	import type { TRegKeysFlat, TRegTypes } from '$lib/types/register/TRegister';
	import type { TDocKeys } from '$lib/types/documents/TDocuments';
	import type { TResolvedDoc } from '$lib/functions/ease_of_use/resolveDoc';
	import { dict_register as dictReg } from '$lib/dictionaries/dict_register.json';
	let {
		docId,
		resDoc,
		ceteiData,
		crossRef,
		currentPage
	}: {
		docId: TDocKeys | undefined;
		resDoc: TResolvedDoc | null;
		ceteiData: any;
		crossRef: Record<'globalEntities', any>;
		currentPage: number;
	} = $props();

	let globalComment = $derived.by(() => {
		const match = ceteiData.serialized.match(/<tei-notesstmt\b[^>]*>(.*?)<\/tei-notesstmt>/s);
		return match ? match[1] : '';
	});

	let stateMetadata = $state<string | null>('eckdaten');
	let isExpanded = $state(false);

	let buttonIsSticky = $state(false);

	const toggleExpandableBox = async () => {
		isExpanded = !isExpanded;
		await tick();
		updateSticky();
	};

	function updateSticky() {
		const parentElement = document.getElementById('expandableBox');
		if (!parentElement) return;

		const rect = parentElement.getBoundingClientRect();

		// If bottom is below viewport → stick to viewport
		buttonIsSticky = rect.bottom >= window.innerHeight;
	}

	$effect(() => {
		// Run once on mount
		updateSticky();

		// Listen to scroll + resize (important!)
		window.addEventListener('scroll', updateSticky);
		window.addEventListener('resize', updateSticky);

		return () => {
			window.removeEventListener('scroll', updateSticky);
			window.removeEventListener('resize', updateSticky);
		};
	});
</script>

<!-- Snippet for Metadata Table -->
{#snippet MetadataTable()}
	{#if resDoc?.item}
		<div class="rounded-xl border-surface-500 p-5 pt-0">
			<h5 class="mb-4 h5"><strong>Metadaten</strong></h5>

			{#snippet metadataButton(state: string, text: string)}
				<button
					class={['my-btn-round', stateMetadata === state && 'my-btn-active']}
					onclick={() => {
						if (stateMetadata !== state) {
							stateMetadata = state;
						}
					}}>{text}</button
				>
			{/snippet}
			{#snippet metadataEntry(label: string, content: string | undefined)}
				<tr class="mb-5 flex flex-col @lg:mb-0 @lg:block">
					<td class="w-80 p-0 font-bold @lg:py-2">{label}:</td>
					<td class="p-0 text-left @lg:py-2">{@html content}</td>
				</tr>
			{/snippet}
			{#snippet metadataEntryWithRegLink(
				label: string,
				content: { name: string; regType: TRegTypes; regKey: TRegKeysFlat }[] | undefined
			)}
				<tr class="mb-5 flex flex-col @lg:mb-0 @lg:block">
					<td class="w-80 p-0 font-bold @lg:py-2">{label}:</td>
					<td class="p-0 text-left @lg:py-2">
						<div class="flex flex-wrap gap-4">
							{#each content ? content : [] as item (item)}
								<a
									class="whitespace-nowrap text-surface-950"
									data-type="entity"
									data-entitytype={item.regType}
									href={resolve(`/edition/register/${item.regKey as string}`)}
									target="_blank"
									rel="noopener noreferrer"
								>
									{item.name}
								</a>
							{/each}
						</div>
					</td>
				</tr>
			{/snippet}
			<div class="flex w-full flex-wrap justify-start gap-5">
				{@render metadataButton('eckdaten', 'Eckdaten Publikation')}
				{@render metadataButton('sources', 'Quellenangaben')}
				{@render metadataButton('globalEntities', 'Schlagworte')}
				{@render metadataButton('citation', 'Zitierhinweise')}
				{@render metadataButton('download', 'Download-Links')}
				{@render metadataButton('all', 'Alles (Temporär)')}
			</div>

			<div class={['@container mt-5 mb-20 w-full pt-5']}>
				{#if stateMetadata === 'eckdaten'}
					<table>
						<tbody class="flex flex-col gap-2">
							{@render metadataEntry('Voller Titel', resDoc.item.metadata.title_full)}
							{@render metadataEntry('Publikationsdatum', resDoc.item.metadata.pubDate)}
							{#if resDoc.docType === 'letters'}
								{@render metadataEntry(
									'Absendeort',
									'placeOfSending' in resDoc.item.metadata
										? resDoc.item.metadata.placeOfSending
										: undefined
								)}
								{@render metadataEntry(
									'Empfangsort',
									'placeOfRecepient' in resDoc.item.metadata
										? resDoc.item.metadata.placeOfRecepient
										: undefined
								)}
							{:else}
								{@render metadataEntry(
									'Publikationsort',
									'pubPlace' in resDoc.item.metadata ? resDoc.item.metadata.pubPlace : undefined
								)}
								{@render metadataEntry(
									'Publikation einzig post-hum',
									typeof resDoc.item.metadata.pubPosthumOnly === 'boolean'
										? resDoc.item.metadata.pubPosthumOnly
											? 'Ja'
											: 'Nein'
										: '?'
								)}
							{/if}
							{@render metadataEntry('Publikationsdetails', resDoc.item.metadata.pubDetails)}
						</tbody>
					</table>
				{:else if stateMetadata === 'sources'}
					<table>
						<tbody class="flex flex-col gap-2">
							{@render metadataEntry('Signatur', resDoc.item.metadata.signature)}
							{@render metadataEntry('Archivierungsort', resDoc.item.metadata.archive)}
							{@render metadataEntry('Archive Collation', resDoc.item.metadata.archiveCollation)}
						</tbody>
					</table>
				{:else if stateMetadata === 'globalEntities'}
					<table>
						<tbody class="flex flex-col gap-2" data-dom="global_entities">
							{#if resDoc.item.metadata.globalEntities}
								{#each ['people', 'places', 'events', 'orgs', 'bibls', 'keywords'] as const as type (type)}
									{#if crossRef.globalEntities[type]?.length}
										{@render metadataEntryWithRegLink(
											dictReg[type].label_plural,
											crossRef.globalEntities[type]
										)}
									{/if}
								{/each}
							{/if}
						</tbody>
					</table>
				{:else if stateMetadata === 'citation'}
					<table>
						<tbody class="flex flex-col gap-2">
							{@render metadataEntry(
								'Dieses Dokument',
								`AUTHOR et al. 2028 "Annemarie Schwarzenbach: Digitale Edition der Kleinen Formen und Briefe. Reisetexte, Intermedialität, Netzwerke", ${resDoc.item.metadata.title_full}`
							)}
							{@render metadataEntry(
								'Aktuell sichtbare Seite',
								`AUTHOR et al. 2028 "Annemarie Schwarzenbach: Digitale Edition der Kleinen Formen und Briefe. Reisetexte, Intermedialität, Netzwerke", ${resDoc.item.metadata.title_full},  Seite ${currentPage}`
							)}
						</tbody>
					</table>
				{:else if stateMetadata === 'download'}
					<table>
						<tbody class="flex flex-col gap-2">
							{@render metadataEntry(
								'XML',
								`<a href="https://dav.annemarie-schwarzenbach.ch/data/sources/tei/smallforms/02/${docId}.xml" target="_blank" rel="noopener noreferrer">XML-Dokument</a>`
							)}
						</tbody>
					</table>
				{:else if stateMetadata === 'all'}
					<div class="h-auto">
						<div data-dom="metadata_table" class="">
							{#each Object.entries(resDoc.item.metadata) as entry (entry)}
								{#if entry[0] !== 'globalEntities' && entry[1]}
									{@render metadataEntry(entry[0], String(entry[1]))}
								{/if}
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
{/snippet}

{#if resDoc && resDoc.item}
	<div class="w-full">
		<h1 class="h1">{resDoc.item.metadata.title_full}</h1>
		{#if resDoc.docType === 'smallforms'}
			<h2 class="h2">
				Publiziert in {resDoc.item.metadata.pubPlace} ({resDoc.item.metadata.year})
			</h2>
		{/if}
		<!-- Global Comment -->
		<div id="expandableBox" class={['relative mt-5 mb-20 pt-5 pb-0']}>
			<div class={['grid grid-cols-2 gap-20', isExpanded ? 'h-auto' : 'max-h-40 overflow-hidden']}>
				<!-- Überblickskommentar -->
				<div>
					<h5 class="mb-4 h5"><strong>Überblickskommentar</strong></h5>
					<div data-dom="global_comment">
						{@html globalComment}
					</div>
				</div>
				<!-- Metadata Tables -->
				{@render MetadataTable()}
			</div>

			<!-- Gradient -->
			{#if !isExpanded}
				<button
					class="absolute right-0 bottom-0 left-0 h-full bg-linear-to-t from-surface-50-950 to-transparent"
					aria-label="expand box"
					onclick={toggleExpandableBox}
				></button>
			{/if}

			<!-- Button to Open/Close -->
			<!-- <div class="absolute left-1/2 -translate-x-1/2 transform" style="bottom: -40px;"> -->
			<div
				class={[
					buttonIsSticky ? 'fixed bottom-5' : 'absolute -bottom-10',
					'left-1/2 -translate-x-1/2'
				]}
			>
				<button
					class="h-12 w-12 rounded-full bg-surface-950-50 text-surface-50-950"
					aria-label="expand box"
					onclick={toggleExpandableBox}
				>
					<i class={['fa-solid', isExpanded ? 'fa-chevron-up' : 'fa-chevron-down']}></i>
				</button>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";

	:global([data-dom='global_entities']) {
		:global([data-type='entity']) {
			@apply rounded-xl px-2 font-bold;
		}
		:global([data-type='entity']::before) {
			content: '↗';
			padding-right: 4px;
		}
		:global([data-entitytype='people']) {
			@apply bg-red-100;
		}
		:global([data-entitytype='places']) {
			@apply bg-green-100;
		}
		:global([data-entitytype='events']) {
			@apply bg-yellow-100;
		}
		:global([data-entitytype='orgs']) {
			@apply bg-orange-100;
		}
		:global([data-entitytype='smallforms']),
		:global([data-entitytype='longforms']),
		:global([data-entitytype='letters']) {
			@apply bg-blue-100;
		}
		:global([data-entitytype='bibls']) {
			@apply bg-purple-100;
		}
		:global([data-entitytype='keywords']) {
			@apply bg-gray-100;
		}
	}
</style>
