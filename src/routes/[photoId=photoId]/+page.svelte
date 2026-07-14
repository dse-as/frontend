<script lang="ts">
	import { page } from '$app/state';

	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import { findSeqTypeBySeqKey } from '$lib/functions/ease_of_use/findSeqTypeBySeqKey.js';
	import Sequences from '../[docId=docId]/Sequences.svelte';
	let { data } = $props();
	let imgdata = $derived(data.resolvedPhoto?.item);

	import { building } from '$app/environment';
	import ContentNote from '$lib/components/ContentNote.svelte';

	// Current Sequence
	const currentSeqKey = $derived(building ? null : page.url.searchParams.get('seq'));
	let currentSeq = $derived({ type: findSeqTypeBySeqKey(currentSeqKey), key: currentSeqKey });

	// Data
	let resPhoto = $derived(data.resolvedPhoto);

	// UI-States
	let stateMetadata = $state<string | null>('eckdaten');
</script>

<div class="relative flex h-full flex-col items-center gap-6">
	<!-- Sequences -->
	<Sequences docId={data.resolvedPhoto?.docId} {currentSeq} />

	<!-- Title -->
	<div class="w-full px-10">
		<h1 class="h1">{imgdata?.name}</h1>
	</div>

	<!-- Content Notes -->
	{#if data.resolvedPhoto?.item?.editorialNotes?.contentNotes}
		{@const contentNotes = data.resolvedPhoto?.item?.editorialNotes.contentNotes}
		<div class="preset-btn-list --spacing-sm px-10">
			{#each contentNotes as contentNote (contentNote)}
				{#if contentNote.title && contentNote.comment}
					<ContentNote type={contentNote.type}>
						{#snippet Title()}{@html contentNote.title}{/snippet}
						{#snippet Comment()}{@html contentNote.comment}{/snippet}
					</ContentNote>
				{:else if contentNote.title}
					<ContentNote type={contentNote.type}>
						{#snippet Title()}{@html contentNote.title}{/snippet}
					</ContentNote>
				{:else if contentNote.comment}
					<ContentNote type={contentNote.type}>
						{#snippet Comment()}{@html contentNote.comment}{/snippet}
					</ContentNote>
				{:else}
					<ContentNote type={contentNote.type}></ContentNote>
				{/if}
			{/each}
		</div>
	{/if}

	<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
		<!-- Image -->
		<div class="h-full w-full p-4">
			{#key imgdata?.faksimile.iiif_image_emanuscripta}
				<IIIF_Thumb
					iiif_imageAPI_width={800}
					blur={imgdata?.manuscript?.rendition?.blur ? true : false}
					//! remove the .replace() hack as soon as we have clean IIIF-manifests.
					url={imgdata?.faksimile.iiif_image_emanuscripta?.replace('/full/304/0/default.jpg', '')}
					classes="min-h-80 md:min-h-120 lg:min-h-200"
				/>
			{/key}
		</div>

		<!-- <IIIFViewer url={imgdata?.faksimile.iiif_manifest_emanuscripta} /> -->

		<!-- Metadata -->
		<div class="flex flex-col items-start justify-start p-4">
			<h5 class="h5 mb-6 font-bold">Metadaten</h5>

			<!-- (2) Metadata Table -->
			{#snippet metadataButton(state: string, text: string)}
				<button
					class={['preset-btn-round --sm lg:--lg', stateMetadata === state && '--active']}
					onclick={() => {
						if (stateMetadata !== state) {
							stateMetadata = state;
						}
					}}>{text}</button
				>
			{/snippet}
			{#snippet metadataEntry(label: string, content: string | null | undefined)}
				<tr class="mb-5 flex flex-col @lg:mb-0 @lg:block">
					<td class="w-80 p-0 align-top font-bold @lg:py-2">{label}:</td>
					<td class="p-0 text-left align-top @lg:py-2">{@html content}</td>
				</tr>
			{/snippet}
			{#snippet metadataEntryWithURL(label: string, content: string | null | undefined)}
				<tr class="mb-5 flex flex-col @lg:mb-0 @lg:block">
					<td class="w-80 p-0 align-top font-bold @lg:py-2">{label}:</td>
					<td class="hyperlink p-0 text-left align-top @lg:py-2"
						><i class="fa-solid fa-arrow-up-right-from-square mr-2"></i><a href={content}
							>{@html content}</a
						></td
					>
				</tr>
			{/snippet}
			<!-- {#snippet metadataEntryWithRegLink(
				label: string,
				content: { name: string; regType: TRegTypes; regKey: TRegKeysFlat }[] | null | undefined
			)}
				<tr class="mb-5 flex flex-col @lg:mb-0 @lg:block">
					<td class="w-80 p-0 align-top font-bold @lg:py-2">{label}:</td>
					<td class="p-0 text-left align-top @lg:py-2">
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
			{/snippet} -->
			{#snippet metadataContent()}
				{#if resPhoto?.item}
					<div data-dom="metadata">
						<div class="preset-btn-list --spacing-normal">
							{@render metadataButton('eckdaten', 'Eckdaten Publikation')}
							{@render metadataButton('sources', 'Quellenangaben')}
							{@render metadataButton('globalEntities', 'Schlagwörter')}
							{@render metadataButton('links', 'Verknüpfungen')}
							{@render metadataButton('citation', 'Zitierhinweise')}
							{@render metadataButton('download', 'Download-Links')}
							<!-- {@render metadataButton('all', 'Alles (Temporär)')} -->
						</div>

						<div class={['@container mt-5 mb-20 w-full pt-5']}>
							{#if stateMetadata === 'eckdaten'}
								<table>
									<tbody class="flex flex-col gap-2">
										{@render metadataEntry('Titel', resPhoto.item.metadata.title)}
										{@render metadataEntry('Fotograf:in', resPhoto.item.metadata.photographer)}
										{@render metadataEntry(
											'Publikationsort',
											(resPhoto.item.metadata.published_in || ['']).join(' | ')
										)}
										<!-- //!FIX -->
										{@render metadataEntry('Datum', resPhoto.item.metadata.date_normalised?.from)}
										{@render metadataEntry('Reise', resPhoto.item.metadata.travel)}
										{@render metadataEntry(
											'Caption 1',
											(resPhoto.item.metadata.captions_1 || ['']).join(' | ')
										)}
										{@render metadataEntry(
											'Caption 2',
											(resPhoto.item.metadata.captions_2 || ['']).join(' | ')
										)}
										{@render metadataEntry('Kommentar 1', resPhoto.item.metadata.comments_1)}
										{@render metadataEntry('Kommentar 2', resPhoto.item.metadata.comments_2)}
										{@render metadataEntry(
											'Signiert',
											resPhoto.item.metadata.signed ? 'Ja' : 'Nein'
										)}
										{@render metadataEntry(
											'Gestempelt',
											resPhoto.item.metadata.stamped ? 'Ja' : 'Nein'
										)}
										{@render metadataEntry('Form', resPhoto.item.metadata.shape)}
										{@render metadataEntry('Orientierung', resPhoto.item.metadata.orientation)}
										{@render metadataEntry('Umfang', resPhoto.item.metadata.characteristics)}
									</tbody>
								</table>
							{:else if stateMetadata === 'sources'}
								<table>
									<tbody class="flex flex-col gap-2">
										{@render metadataEntry('Repository', resPhoto.item.metadata.repository)}
										{@render metadataEntry('SLA-ID', resPhoto.item.metadata.sla_id_full)}
									</tbody>
								</table>
							{:else if stateMetadata === 'globalEntities'}
								<table>
									<tbody class="flex flex-col gap-2" data-dom="global_entities">
										<!-- {#if resPhoto.item.metadata.globalEntities}
											{#each ['people', 'places', 'events', 'orgs', 'bibls', 'keywords'] as const as type (type)}
												{#if data.crossRef.globalEntities[type]?.length}
													{@render metadataEntryWithRegLink(
														dictReg[type].label_plural,
														data.crossRef.globalEntities[type]
													)}
												{/if}
											{/each}
										{/if} -->
									</tbody>
								</table>
							{:else if stateMetadata === 'links'}
								<table>
									<tbody class="flex flex-col gap-2" data-dom="global_entities">
										{@render metadataEntry(
											'Erwähung in Forschungsliteratur',
											(resPhoto.item.metadata.mentioned_in || ['']).join(' | ')
										)}
										{@render metadataEntry(
											'Publikation (Editionen & Artikel)',
											(resPhoto.item.metadata.published_in || ['']).join(' | ')
										)}
										{@render metadataEntry(
											'Abgebildete Personen',
											(resPhoto.item.metadata.people_on_photo || ['']).join(' | ')
										)}
										{@render metadataEntry('Reise', resPhoto.item.metadata.travel)}
									</tbody>
								</table>
							{:else if stateMetadata === 'citation'}
								<table>
									<tbody class="flex flex-col gap-2">
										{@render metadataEntry(
											'Zitierung (ad-hoc)',
											`${resPhoto.item.metadata.sla_id_coll}`
										)}
									</tbody>
								</table>
							{:else if stateMetadata === 'download'}
								<table>
									<tbody class="flex flex-col gap-2">
										{@render metadataEntryWithURL(
											'e-manuscripta',
											resPhoto.item.metadata.url_emanuscripta
										)}
										{@render metadataEntryWithURL(
											'Helvetic Archives',
											resPhoto.item.metadata.url_helveticarchives
										)}
										{@render metadataEntryWithURL(
											'Wikimedia',
											resPhoto.item.metadata.url_wikimedia
										)}
									</tbody>
								</table>
							{:else if stateMetadata === 'all'}
								<div class="h-auto">
									<div data-dom="metadata_table" class="">
										{#each Object.entries(resPhoto.item.metadata) as entry (entry)}
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

			{@render metadataContent()}
		</div>
	</div>
</div>
