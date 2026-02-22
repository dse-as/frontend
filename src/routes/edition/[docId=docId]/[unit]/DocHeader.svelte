<script lang="ts">
	let { metadata, annot, docId } = $props();
	let isExpandedBox1 = $state(false);
	let isExpandedBox2 = $state(false);

	import register from '$lib/data/register.json';
	import dict_register from '$lib/dictionaries/dict_register.json';
	const reg = register.register;
	const dictReg = dict_register.dict_register;

	// Load Component with Global Comment
	import type { Component } from 'svelte';
	let GlobalComment: Component | null = $state(null);
	let globalCommentId = annot[docId]?.globCommId;
	(async () => {
		if (docId && globalCommentId) {
			GlobalComment = (await import(`$lib/data/global_comments/${globalCommentId}.svelte`)).default;
		}
	})();
</script>

{#if metadata[docId]}
	<div class="px-40 pb-10">
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
						{#each regKeys ? Object.values(regKeys) : [] as regKey}
							<a
								class="whitespace-nowrap text-surface-950"
								data-type="entity"
								data-entitytype={dictReg[regType].singular}
								href={`/edition/register#${regKey}`}
								target="_blank"
								rel="noopener noreferrer"
								>{reg[regType][regKey].name}
							</a>
						{/each}
					{/each}
				</div>
			</div>
		{/if}

		<!-- Global Comment -->
		{#if globalCommentId}
			<div class={['relative mt-5 mb-20 pt-5', isExpandedBox1 ? 'pb-20' : 'pb-0']}>
				<div class={[isExpandedBox1 ? 'h-auto' : 'max-h-40 overflow-hidden']}>
					<h5 class="mb-4 h5"><strong>Kommentar</strong></h5>
					<div data-dom="global_comment">
						<GlobalComment />
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
		<div
			class={[
				'relative mt-5 mb-20 bg-surface-700-300 px-5 pt-5 text-surface-100-900',
				isExpandedBox2 ? 'pb-20' : 'pb-0'
			]}
		>
			<div class={[isExpandedBox2 ? 'h-auto' : 'max-h-13 overflow-hidden']}>
				<h5 class="mb-7 h5"><strong>Metadaten</strong></h5>
				<div data-dom="metadata_table" class="">
					{#each Object.entries(metadata[docId]?.metadata) as entry}
						<!-- //! Later, the metadata section should be restructured, such that no filtering out is needed.
					Alternatively, this list here could be created manually, which is actually better for ordering.-->
						{#if entry[0] !== 'keywords'}
							<p><strong>{entry[0]}:</strong> {entry[1]}</p>
						{/if}
					{/each}
				</div>
			</div>

			<!-- Button to Open/Close -->
			<div class="absolute left-1/2 -translate-x-1/2 transform" style="bottom: -20px;">
				<button
					class="z-10 h-12 w-12 rounded-full border-2 border-surface-700-300 bg-surface-50-950 text-surface-700-300"
					aria-label="expand box"
					onclick={() => {
						isExpandedBox2 = !isExpandedBox2;
					}}
				>
					<i class={['fa-solid', isExpandedBox2 ? 'fa-chevron-up' : 'fa-chevron-down']}></i>
				</button>
			</div>
		</div>
	</div>
{:else}
	<h1 class="text-red-500">metadata.{docId} is not defined</h1>
{/if}

<style>
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
		:global([data-entitytype='bibl']) {
			@apply rounded-xl bg-purple-100 px-2 font-bold;
		}
		:global([data-entitytype='keyword']) {
			@apply rounded-xl bg-gray-100 px-2 font-bold;
		}
	}
</style>
