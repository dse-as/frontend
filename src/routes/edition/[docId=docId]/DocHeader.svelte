<script lang="ts">
	import register from '$lib/data/register.json';
	import dict_register from '$lib/dictionaries/dict_register.json';
	import { resolve } from '$app/paths';
	let isExpandedBox1 = $state(false);

	let { docId, docType, docMeta, ceteiData, currentPage } = $props();

	const reg = register.register as Record<string, Record<string, any>>;
	const dictReg = dict_register.dict_register as Record<
		string,
		{ key_singular: string; label_plural: string }
	>;
	let globalComment = $derived.by(() => {
		const match = ceteiData.serialized.match(/<tei-notesstmt\b[^>]*>(.*?)<\/tei-notesstmt>/s);
		return match ? match[1] : '';
	});

	let stateMetadata = $state('eckdaten');
	let isExpandedMetadata = $state(true);
</script>

<!-- Snippet for Metadata Table -->
{#snippet MetadataTable()}
	<div class="rounded-xl border-surface-500 p-5 pt-0">
		<h5 class="mb-4 h5"><strong>Metadaten</strong></h5>

		{#snippet metadataButton(state: string, text: string)}
			<button
				class={['my-btn-round', stateMetadata === state && 'my-btn-active']}
				onclick={() => {
					if (stateMetadata === state) {
						stateMetadata = null;
						isExpandedMetadata = false;
					} else {
						stateMetadata = state;
						isExpandedMetadata = true;
					}
				}}>{text}</button
			>
		{/snippet}
		{#snippet metadataEntry(label, content)}
			<tr>
				<td class="w-80 px-4 py-2 font-bold">{label}:</td>
				<td class="px-4 py-2 text-left">{@html content}</td>
			</tr>
		{/snippet}
		<div class="flex w-full flex-wrap justify-start gap-5">
			{@render metadataButton('eckdaten', 'Eckdaten Publikation')}
			{@render metadataButton('sources', 'Quellenangaben')}
			{@render metadataButton('keywords', 'Schlagwörter')}
			{@render metadataButton('citation', 'Zitierhinweise')}
			{@render metadataButton('download', 'Download-Links')}
			<!-- {@render metadataButton('all', 'Alles (Temporär)')} -->
		</div>
		{#if isExpandedMetadata}
			<div class={['mt-5 mb-20 px-5 pt-5']}>
				{#if stateMetadata === 'eckdaten'}
					<table>
						<tbody class="flex flex-col gap-2">
							{@render metadataEntry('Voller Titel', docMeta.metadata.title_full)}
							{@render metadataEntry('Publikationsdatum', docMeta.metadata.pubDate)}
							{@render metadataEntry('Publikationsort', docMeta.metadata.pubPlace)}
							{@render metadataEntry(
								'Publikation einzig post-hum',
								docMeta.metadata.pubPosthumOnly
							)}
							{@render metadataEntry('Publikationsdetails', docMeta.metadata.pubDetails)}
						</tbody>
					</table>
				{:else if stateMetadata === 'sources'}
					<table>
						<tbody class="flex flex-col gap-2">
							{@render metadataEntry('Signatur', docMeta.metadata.signature)}
						</tbody>
					</table>
				{:else if stateMetadata === 'keywords'}
					<!-- Global Entities -->
					{#if Object.keys(dictReg).some((regType) => {
						const keywords = docMeta.metadata.keywords[regType];
						return keywords && keywords.length > 0;
					})}
						<h5 class="mb-4 h5"><strong>Schlagwörter</strong></h5>
						<div data-dom="global_entities" class="flex flex-wrap gap-4">
							{#each Object.keys(dictReg) as regType}
								{@const regKeys = docMeta.metadata.keywords[regType]}
								{#each regKeys ? Object.values(regKeys) : [] as regKey}
									<a
										class="whitespace-nowrap text-surface-950"
										data-type="entity"
										data-entitytype={dictReg[regType].key_singular}
										href={resolve(`/edition/register/${regKey}`)}
										target="_blank"
										rel="noopener noreferrer"
									>
										{reg[regType][regKey]?.name}
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
								`AUTHOR et al. 2028 "Annemarie Schwarzenbach: Digitale Edition der Kleinen Formen und Briefe. Reisetexte, Intermedialität, Netzwerke", ${docMeta.metadata.title_full}`
							)}
							{@render metadataEntry(
								'Aktuell sichtbare Seite',
								`AUTHOR et al. 2028 "Annemarie Schwarzenbach: Digitale Edition der Kleinen Formen und Briefe. Reisetexte, Intermedialität, Netzwerke", ${docMeta.metadata.title_full},  Seite ${currentPage}`
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
					<div class={[isExpandedMetadata ? 'h-auto' : 'max-h-13 overflow-hidden']}>
						<h5 class="mb-7 h5"><strong>Metadaten</strong></h5>
						<div data-dom="metadata_table" class="">
							{#each Object.entries(docMeta.metadata) as entry}
								{#if entry[0] !== 'keywords'}
									<p><strong>{entry[0]}:</strong> {entry[1]}</p>
								{/if}
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/snippet}

{#if docMeta}
	<div class="w-full">
		<h1 class="h1">{docMeta.metadata.title_full}</h1>
		{#if docType === 'smallforms'}
			<h2 class="h2">
				Publiziert in {docMeta.metadata.pubPlace} ({docMeta.metadata.year})
			</h2>
		{/if}
		<!-- Global Comment -->
		{#if globalComment}
			<div class={['relative mt-5 mb-20 pt-5', isExpandedBox1 ? 'pb-20' : 'pb-0']}>
				<div
					class={[
						'grid grid-cols-2 gap-20',
						isExpandedBox1 ? 'h-auto' : 'max-h-40 overflow-hidden'
					]}
				>
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
				{#if !isExpandedBox1}
					<button
						class="absolute right-0 bottom-0 left-0 h-full bg-linear-to-t from-surface-50-950 to-transparent"
						aria-label="expand box"
						onclick={() => {
							isExpandedBox1 = !isExpandedBox1;
						}}
					></button>
				{/if}

				<!-- Button to Open/Close -->
				<div class="absolute left-1/2 -translate-x-1/2 transform" style="bottom: -40px;">
					<button
						class="h-12 w-12 rounded-full bg-surface-950-50 text-surface-50-950"
						aria-label="expand box"
						onclick={() => {
							isExpandedBox1 = !isExpandedBox1;
						}}
					>
						<i class={['fa-solid', isExpandedBox1 ? 'fa-chevron-up' : 'fa-chevron-down']}></i>
					</button>
				</div>
			</div>
		{/if}
	</div>
{:else}
	<h1 class="text-red-500">metadata is not defined</h1>
{/if}

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";

	[data-dom='global_comment'] {
		:global([data-type='entity']) {
			@apply underline decoration-2;
		}
		:global(p) {
			@apply my-4;
		}
	}

	[data-dom='global_entities'] {
		:global([data-type='entity']::before) {
			@apply rounded-xl px-1 font-bold;
			content: '↗';
		}
		:global([data-entitytype='person']) {
			@apply rounded-xl bg-red-100 px-2 font-bold;
		}
		:global([data-entitytype='place']) {
			@apply rounded-xl bg-green-100 px-2 font-bold;
		}
		:global([data-entitytype='event']) {
			@apply rounded-xl bg-yellow-100 px-2 font-bold;
		}
		:global([data-entitytype='org']) {
			@apply rounded-xl bg-orange-100 px-2 font-bold;
		}
		:global([data-entitytype='smallform']),
		:global([data-entitytype='longform']),
		:global([data-entitytype='letter']) {
			@apply rounded-xl bg-blue-100 px-2 font-bold;
		}
		:global([data-entitytype='bibls']) {
			@apply rounded-xl bg-purple-100 px-2 font-bold;
		}
		:global([data-entitytype='keyword']) {
			@apply rounded-xl bg-gray-100 px-2 font-bold;
		}
	}
</style>
