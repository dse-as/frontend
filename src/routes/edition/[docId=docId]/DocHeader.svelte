<script lang="ts">
	import { register as reg } from '$lib/data/register.json';
	import dict_register from '$lib/dictionaries/dict_register.json';
	import { resolve } from '$app/paths';
	import { type TRegTypes } from '$lib/types/register/TRegister';
	import ResponsiveAccordion from './ResponsiveAccordion.svelte';

	let { docId, docType, docItem, ceteiData, currentPage } = $props();

	const dictReg = dict_register.dict_register as Record<
		string,
		{ key_singular: string; label_plural: string }
	>;
	let globalComment = $derived.by(() => {
		const match = ceteiData.serialized.match(/<tei-notesstmt\b[^>]*>(.*?)<\/tei-notesstmt>/s);
		return match ? match[1] : '';
	});

	let stateMetadata = $state<string | null>('eckdaten');
</script>

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
{#snippet metadataEntry(label: string, content: string)}
	<tr class="mb-5 flex flex-col @lg:mb-0 @lg:block">
		<td class="w-80 p-0 font-bold @lg:py-2">{label}:</td>
		<td class="p-0 text-left @lg:py-2">{@html content}</td>
	</tr>
{/snippet}

{#if docItem}
	<div class="w-full px-10">
		<h1 class="h1">{docItem.metadata.title_full}</h1>
		{#if docType === 'smallforms'}
			<h2 class="h2">
				Publiziert in {docItem.metadata.pubPlace} ({docItem.metadata.year})
			</h2>
		{/if}
		<!-- Global Comment -->
		<ResponsiveAccordion titleOverview="Überblickskommentar" titleMeta="Metadaten">
			<!-- (1) Übersichtskommentar -->
			{#snippet overviewContent()}
				<div data-dom="global_comment">
					{@html globalComment}
				</div>
			{/snippet}

			<!-- (2) Metadata Table -->
			{#snippet metadataContent()}
				<div data-dom="metadata">
					<div class="flex w-full flex-wrap justify-start gap-5">
						{@render metadataButton('eckdaten', 'Eckdaten Publikation')}
						{@render metadataButton('sources', 'Quellenangaben')}
						{@render metadataButton('keywords', 'Schlagwörter')}
						{@render metadataButton('citation', 'Zitierhinweise')}
						{@render metadataButton('download', 'Download-Links')}
						{@render metadataButton('all', 'Alles (Temporär)')}
					</div>

					<div class={['@container mt-5 mb-20 w-full pt-5']}>
						{#if stateMetadata === 'eckdaten'}
							<table>
								<tbody class="flex flex-col gap-2">
									{@render metadataEntry('Voller Titel', docItem.metadata.title_full)}
									{@render metadataEntry('Publikationsdatum', docItem.metadata.pubDate)}
									{@render metadataEntry('Publikationsort', docItem.metadata.pubPlace)}
									{@render metadataEntry(
										'Publikation einzig post-hum',
										docItem.metadata.pubPosthumOnly
									)}
									{@render metadataEntry('Publikationsdetails', docItem.metadata.pubDetails)}
								</tbody>
							</table>
						{:else if stateMetadata === 'sources'}
							<table>
								<tbody class="flex flex-col gap-2">
									{@render metadataEntry('Signatur', docItem.metadata.signature)}
								</tbody>
							</table>
						{:else if stateMetadata === 'keywords'}
							<!-- Global Entities -->
							{#if Object.keys(dictReg).some((regType) => {
								const keywords = docItem.metadata.keywords[regType];
								return keywords && keywords.length > 0;
							})}
								<div data-dom="global_entities" class="flex flex-wrap gap-4">
									{#each Object.keys(dictReg) as regType (regType)}
										{@const regKeys = docItem.metadata.keywords[regType]}
										{#each regKeys ? Object.values(regKeys) : [] as regKey (regKey)}
											<a
												class="whitespace-nowrap text-surface-950"
												data-type="entity"
												data-entitytype={dictReg[regType].key_singular}
												href={resolve(`/edition/register/${regKey}`)}
												target="_blank"
												rel="noopener noreferrer"
											>
												<!-- //! FIX hardcoded type -->
												{(reg[regType as TRegTypes][regKey as never] as Record<'name', any>)?.name}
											</a>
										{/each}
									{/each}
								</div>
							{/if}
						{:else if stateMetadata === 'citation'}
							<table>
								<tbody class="flex flex-col gap-2">
									{@render metadataEntry(
										'Dieses Dokument',
										`AUTHOR et al. 2028 "Annemarie Schwarzenbach: Digitale Edition der Kleinen Formen und Briefe. Reisetexte, Intermedialität, Netzwerke", ${docItem.metadata.title_full}`
									)}
									{@render metadataEntry(
										'Aktuell sichtbare Seite',
										`AUTHOR et al. 2028 "Annemarie Schwarzenbach: Digitale Edition der Kleinen Formen und Briefe. Reisetexte, Intermedialität, Netzwerke", ${docItem.metadata.title_full},  Seite ${currentPage}`
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
									{#each Object.entries(docItem.metadata) as entry (entry)}
										{#if entry[0] !== 'keywords' && entry[1]}
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
	@reference "@skeletonlabs/skeleton";

	[data-dom='global_entities'] {
		:global([data-type='entity']) {
			@apply rounded-xl px-2 font-bold;
		}
		:global([data-type='entity']::before) {
			content: '↗';
			padding-right: 4px;
		}
		:global([data-entitytype='person']) {
			@apply bg-red-100;
		}
		:global([data-entitytype='place']) {
			@apply bg-green-100;
		}
		:global([data-entitytype='event']) {
			@apply bg-yellow-100;
		}
		:global([data-entitytype='org']) {
			@apply bg-orange-100;
		}
		:global([data-entitytype='smallform']),
		:global([data-entitytype='longform']),
		:global([data-entitytype='letter']) {
			@apply bg-blue-100;
		}
		:global([data-entitytype='bibls']) {
			@apply bg-purple-100;
		}
		:global([data-entitytype='keyword']) {
			@apply bg-gray-100;
		}
	}
</style>
