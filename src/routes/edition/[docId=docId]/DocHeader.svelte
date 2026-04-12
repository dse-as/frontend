<script lang="ts">
	let { metadata, ceteiData, docId } = $props();
	import register from '$lib/data/register.json';
	import dict_register from '$lib/dictionaries/dict_register.json';
	import { resolve } from '$app/paths';
	let isExpandedBox1 = $state(false);
	let isExpandedBox2 = $state(false);

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
	let isExpandedMetadata = $state(false);
</script>

{#if metadata[docId]}
	<div class="w-full pb-10">
		<h1 class="h1">{metadata[docId]?.metadata.title_full}</h1>
		<h2 class="h2">
			Publiziert in {metadata[docId]?.metadata.pubPlace} ({metadata[docId]?.metadata.year})
		</h2>

		<!-- Global Entities -->
		{#if Object.keys(dictReg).some((regType) => {
			const keywords = metadata[docId]?.metadata.keywords[regType];
			return keywords && keywords.length > 0;
		})}
			<div class="mt-10">
				<h5 class="mb-4 h5"><strong>Schlagwörter</strong></h5>
				<div data-dom="global_entities" class="flex flex-wrap gap-2">
					{#each Object.keys(dictReg) as regType}
						{@const regKeys = metadata[docId]?.metadata.keywords[regType]}
						{#each regKeys ? (Object.values(regKeys) as string[]) : [] as regKey}
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
			</div>
		{/if}

		<!-- Global Comment -->
		{#if globalComment}
			<div class={['relative mt-5 mb-20 pt-5', isExpandedBox1 ? 'pb-20' : 'pb-0']}>
				<div class={[isExpandedBox1 ? 'h-auto' : 'max-h-40 overflow-hidden']}>
					<h5 class="mb-4 h5"><strong>Kommentar</strong></h5>
					<div data-dom="global_comment">
						{@html globalComment}
					</div>
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
				<div class="absolute left-1/2 -translate-x-1/2 transform" style="bottom: -20px;">
					<button
						class="z-10 h-12 w-12 rounded-full bg-surface-950-50 text-surface-50-950"
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

		<!-- Metadata Table -->
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
			<p><span class="font-bold">{label}:</span>{content}</p>
		{/snippet}
		<div class="rounded-xl border-2 p-5">
			<div class="flex w-full justify-center gap-5">
				{@render metadataButton('eckdaten', 'Eckdaten Publikation')}
				{@render metadataButton('sources', 'Quellenangaben')}
				{@render metadataButton('keywords', 'Schlagwörter')}
				{@render metadataButton('citation', 'Zitierhinweise')}
				{@render metadataButton('download', 'Download-Links')}
				{@render metadataButton('all', 'Alles (Temporär)')}
			</div>
			{#if isExpandedMetadata}
				<div class={['relative mt-5 mb-20 px-5 pt-5']}>
					{#if stateMetadata === 'eckdaten'}
						<div class="flex flex-col gap-2">
							{@render metadataEntry('Voller Titel', metadata[docId]?.metadata.title_full)}
							{@render metadataEntry('Publikationsdatum', metadata[docId]?.metadata.pubDate)}
							{@render metadataEntry('Publikationsort', metadata[docId]?.metadata.pubPlace)}
							{@render metadataEntry(
								'Publikation einzig post-hum',
								metadata[docId]?.metadata.pubPosthumOnly
							)}
							{@render metadataEntry('Publikationsdetails', metadata[docId]?.metadata.pubDetails)}
						</div>
					{:else if stateMetadata === 'sources'}
						<div>
							{@render metadataEntry('Signatur', metadata[docId]?.metadata.signature)}
						</div>
					{:else if stateMetadata === 'keywords'}
						<!-- Global Entities -->
						{#if Object.keys(dictReg).some((regType) => {
							const keywords = metadata[docId]?.metadata.keywords[regType];
							return keywords && keywords.length > 0;
						})}
							<h5 class="mb-4 h5"><strong>Schlagwörter</strong></h5>
							<div data-dom="global_entities" class="flex flex-wrap gap-2">
								{#each Object.keys(dictReg) as regType}
									{@const regKeys = metadata[docId]?.metadata.keywords[regType]}
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
						<div></div>
					{:else if stateMetadata === 'download'}
						<div></div>
					{:else if stateMetadata === 'all'}
						<div class={[isExpandedMetadata ? 'h-auto' : 'max-h-13 overflow-hidden']}>
							<h5 class="mb-7 h5"><strong>Metadaten</strong></h5>
							<div data-dom="metadata_table" class="">
								{#each Object.entries(metadata[docId]?.metadata) as entry}
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
	</div>
{:else}
	<h1 class="text-red-500">metadata.{docId} is not defined</h1>
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
