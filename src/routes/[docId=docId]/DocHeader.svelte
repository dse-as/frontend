<script lang="ts">
	import { resolve } from '$app/paths';
	import type { TRegKeysFlat, TRegTypes } from '$lib/types/register/TRegister';
	import type { TDocKeys } from '$lib/types/documents/TDocuments';
	import type {
		TResolvedLetters,
		TResolvedSmallforms,
		TResolvedLongforms
	} from '$lib/functions/ease_of_use/resolveDoc';
	import { dict_register as dictReg } from '$lib/dictionaries/dict_register.json';
	import ResponsiveAccordion from './ResponsiveAccordion.svelte';
	import ScrollArea from '$lib/components/ui/ScrollArea.svelte';
	import { printDateRange } from '$lib/functions/ease_of_use/dateFunctions';

	let {
		docId,
		resDoc,
		ceteiData,
		crossRef,
		currentPage
	}: {
		docId: TDocKeys | undefined;
		resDoc: TResolvedLetters | TResolvedSmallforms | TResolvedLongforms | null;
		ceteiData: any;
		crossRef: Record<'globalEntities', any>;
		currentPage: number;
	} = $props();

	let globalComment = $derived.by(() => {
		const match = ceteiData.serialized.match(/<tei-notesstmt\b[^>]*>(.*?)<\/tei-notesstmt>/s);
		return match ? match[1] : '';
	});

	let stateMetadata = $state<string | null>('eckdaten');
</script>

{#snippet metadataButton(state: string, text: string)}
	<button
		class={['preset-btn-round --lg', stateMetadata === state && '--active']}
		onclick={() => {
			if (stateMetadata !== state) {
				stateMetadata = state;
			}
		}}>{text}</button
	>
{/snippet}
{#snippet metadataEntry(label: string, content: string | null | undefined)}
	<tr class="mb-5 flex flex-col @lg:mb-0 @lg:block">
		<td class="w-80 p-0 font-bold @lg:py-2">{label}:</td>
		<td class="p-0 text-left @lg:py-2">{@html content}</td>
	</tr>
{/snippet}
{#snippet metadataEntryWithRegLink(
	label: string,
	content: { name: string; regType: TRegTypes; regKey: TRegKeysFlat }[] | null | undefined
)}
	<tr class="mb-5 flex flex-col @lg:mb-0 @lg:block">
		<td class="w-80 p-0 font-bold @lg:py-2">{label}:</td>
		<td class="p-0 text-left @lg:py-2">
			<div class="flex flex-wrap gap-4">
				{#each content ? content : [] as item (item)}
					<a
						class="preset-btn-round --linkarrow"
						data-type="entity"
						data-entitytype={item.regType}
						href={resolve(`/register/${item.regKey as string}`)}
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

{#if resDoc?.item}
	<div class="w-full px-10">
		<h1 class="h1 text-center">
			{#if resDoc.docType === 'letters'}
				<span>{resDoc.item.name}</span>
			{:else}
				<span>{resDoc.item.metadata.title_full}</span>
			{/if}
		</h1>
		<h3 class="h3 mt-2 text-center">
			{#if resDoc.docType === 'letters'}
				<span>{printDateRange(resDoc.item.metadata.date.from, resDoc.item.metadata.date.to)}</span>
			{:else if resDoc.docType === 'smallforms'}
				Publiziert in {resDoc.item.metadata.pubPlace} ({resDoc.item.metadata.year})
			{/if}
		</h3>
		<!-- Global Comment -->
		<ResponsiveAccordion titleOverview="Überblickskommentar" titleMeta="Metadaten">
			<!-- (1) Übersichtskommentar -->
			{#snippet overviewContent()}
				<!-- <div data-dom="global_comment" class="h-full overflow-auto pb-20">
					{@html globalComment}
				</div> -->
				<ScrollArea
					orientation="vertical"
					type="hover"
					viewportClasses="h-full w-full"
					data-dom="global_comment"
					class="bg-background-alt relative h-full overflow-hidden px-4 pb-20 xl:px-0"
				>
					{@html globalComment}
				</ScrollArea>
			{/snippet}

			<!-- (2) Metadata Table -->
			{#snippet metadataContent()}
				<div data-dom="metadata">
					<div class="preset-btn-list --spacing-normal">
						{@render metadataButton('eckdaten', 'Eckdaten')}
						{@render metadataButton('sources', 'Quellenangaben')}
						{@render metadataButton('globalEntities', 'Schlagwörter')}
						{@render metadataButton('citation', 'Zitierhinweise')}
						{@render metadataButton('download', 'Download-Links')}
						<!-- {@render metadataButton('all', 'Alles (Temporär)')} -->
					</div>

					<div class={['@container mt-5 mb-20 w-full pt-5']}>
						{#if stateMetadata === 'eckdaten'}
							<table>
								<tbody class="flex flex-col gap-2">
									{#if resDoc.docType === 'letters'}
										{@render metadataEntry(
											'Dokumenttyp',
											'type' in resDoc.item!.metadata
												? resDoc.item!.metadata.type?.join(', ')
												: undefined
										)}
										{@render metadataEntry(
											'Datum',
											printDateRange(resDoc.item!.metadata.date.from, resDoc.item!.metadata.date.to)
										)}
										{@render metadataEntry(
											'Datum Stempel',
											'date_stamp' in resDoc.item!.metadata
												? resDoc.item!.metadata.date_stamp
												: undefined
										)}
										{@render metadataEntry(
											'Absernder:in(nen)',
											'people_sending' in resDoc.item!.metadata
												? resDoc.item!.metadata.people_sending?.join(', ')
												: undefined
										)}
										{@render metadataEntry(
											'Addressat:in(nen) (Anschrift)',
											'people_addressed' in resDoc.item!.metadata
												? resDoc.item!.metadata.people_addressed?.join(', ')
												: undefined
										)}
										{@render metadataEntry(
											'Addressat:in(nen) (Adressfeld)',
											'people_addressfield' in resDoc.item!.metadata
												? resDoc.item!.metadata.people_addressfield?.join(', ')
												: undefined
										)}
										{@render metadataEntry(
											'Absendeort',
											'place_of_sender' in resDoc.item!.metadata
												? resDoc.item!.metadata.place_of_sender
												: undefined
										)}
										{@render metadataEntry(
											'Empfangsort',
											'place_of_recepient' in resDoc.item!.metadata
												? resDoc.item!.metadata.place_of_recepient
												: undefined
										)}
										{@render metadataEntry(
											'Zusammenfassung',
											'summary' in resDoc.item!.metadata ? resDoc.item!.metadata.summary : undefined
										)}
										{@render metadataEntry(
											'Umfang und Medium',
											'content_and_medium' in resDoc.item!.metadata
												? resDoc.item!.metadata.content_and_medium
												: undefined
										)}
										{@render metadataEntry(
											'Sprache',
											'language' in resDoc.item!.metadata
												? resDoc.item!.metadata.language
												: undefined
										)}
										{@render metadataEntry(
											'Beilagen',
											'attachments' in resDoc.item!.metadata
												? resDoc.item!.metadata.attachments
												: undefined
										)}
									{:else}
										{@render metadataEntry('Voller Titel', resDoc.item!.metadata.title_full)}
										{@render metadataEntry('Publikationsdatum', resDoc.item!.metadata.pubDate)}
										{@render metadataEntry(
											'Publikationsort',
											'pubPlace' in resDoc.item!.metadata
												? resDoc.item!.metadata.pubPlace
												: undefined
										)}
										{@render metadataEntry(
											'Publikation einzig post-hum',
											typeof resDoc.item!.metadata.pubPosthumOnly === 'boolean'
												? resDoc.item!.metadata.pubPosthumOnly
													? 'Ja'
													: 'Nein'
												: '?'
										)}
										{@render metadataEntry('Publikationsdetails', resDoc.item!.metadata.pubDetails)}
									{/if}
								</tbody>
							</table>
						{:else if stateMetadata === 'sources'}
							<table>
								<tbody class="flex flex-col gap-2">
									{#if resDoc.docType === 'letters'}
										{@render metadataEntry('Ordnername', resDoc.item!.metadata.archive.folder_name)}
										{@render metadataEntry(
											'Fonds (ref. code)',
											resDoc.item!.metadata.archive.ref_code_fonds
										)}
										{@render metadataEntry('Shelfmark', resDoc.item!.metadata.archive.shelfmark)}
										{@render metadataEntry('Repository', resDoc.item!.metadata.archive.repository)}
										{@render metadataEntry(
											'Repository URL',
											resDoc.item!.metadata.archive.repo_url
										)}
										{@render metadataEntry('Rechte', resDoc.item!.metadata.archive.rights)}
										{@render metadataEntry(
											'Archivierungsgeschichte',
											resDoc.item!.metadata.archive.archival_history
										)}
										{@render metadataEntry(
											'Publikation / Abdrucke',
											resDoc.item!.metadata.archive.published_in?.join(' | ')
										)}
										{@render metadataEntry(
											'In Forschungsliteratur thematisiert',
											resDoc.item!.metadata.archive.cited_in?.join(' | ')
										)}
									{:else}
										{@render metadataEntry('Signatur', resDoc.item!.metadata.signature)}
										{@render metadataEntry('Archivierungsort', resDoc.item!.metadata.archive)}
										{@render metadataEntry(
											'Archive Collation',
											resDoc.item!.metadata.archiveCollation
										)}
									{/if}
								</tbody>
							</table>
						{:else if stateMetadata === 'globalEntities'}
							<table>
								<tbody class="flex flex-col gap-2" data-dom="global_entities">
									{#each ['people', 'places', 'events', 'orgs', 'bibls', 'keywords'] as const as type (type)}
										{#if crossRef.globalEntities[type]?.length}
											{@render metadataEntryWithRegLink(
												dictReg[type].label_plural,
												crossRef.globalEntities[type]
											)}
										{/if}
									{/each}
								</tbody>
							</table>
						{:else if stateMetadata === 'citation'}
							<table>
								<tbody class="flex flex-col gap-2">
									{#if resDoc.docType === 'letters'}
										{@render metadataEntry(
											'Dieses Dokument',
											`AUTHOR et al. 2028 "Annemarie Schwarzenbach: Digitale Edition der Kleinen Formen und Briefe. Reisetexte, Intermedialität, Netzwerke", ${resDoc.item!.name} (${docId})`
										)}
										{@render metadataEntry(
											'Aktuell sichtbare Seite',
											`AUTHOR et al. 2028 "Annemarie Schwarzenbach: Digitale Edition der Kleinen Formen und Briefe. Reisetexte, Intermedialität, Netzwerke", ${resDoc.item!.name} (${docId}),  Seite ${currentPage}`
										)}
									{:else}
										{@render metadataEntry(
											'Dieses Dokument',
											`AUTHOR et al. 2028 "Annemarie Schwarzenbach: Digitale Edition der Kleinen Formen und Briefe. Reisetexte, Intermedialität, Netzwerke", ${resDoc.item!.metadata.title_full}`
										)}
										{@render metadataEntry(
											'Aktuell sichtbare Seite',
											`AUTHOR et al. 2028 "Annemarie Schwarzenbach: Digitale Edition der Kleinen Formen und Briefe. Reisetexte, Intermedialität, Netzwerke", ${resDoc.item!.metadata.title_full},  Seite ${currentPage}`
										)}
									{/if}
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
									{#each Object.entries(resDoc.item!.metadata) as entry (entry)}
										{#if entry[0] !== 'globalEntities' && entry[1]}
											{@render metadataEntry(entry[0], String(entry[1]))}
										{/if}
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/snippet}
		</ResponsiveAccordion>
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss";

	/* Global Entities */
	:global([data-dom='global_comment']) {
		:global(tei-p) {
			@apply mt-0;
		}
	}
	:global([data-dom='global_entities']) {
		/* Entity Colors */
		:global([data-entitytype='people']) {
			@apply bg-(--color-rs-person-20);
		}
		:global([data-entitytype='places']) {
			@apply bg-(--color-rs-place-20);
		}
		:global([data-entitytype='events']) {
			@apply bg-(--color-rs-event-20);
		}
		:global([data-entitytype='orgs']) {
			@apply bg-(--color-rs-org-20);
		}
		:global([data-entitytype='smallforms']),
		:global([data-entitytype='longforms']),
		:global([data-entitytype='letters']) {
			@apply bg-(--color-rs-doc-20);
		}
		:global([data-entitytype='bibls']) {
			@apply bg-(--color-rs-bibl-20);
		}
		:global([data-entitytype='keywords']) {
			@apply bg-(--color-rs-keyword-20);
		}
	}
</style>
