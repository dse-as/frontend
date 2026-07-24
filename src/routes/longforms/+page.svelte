<script lang="ts">
	import { doc_sequences as seqAll } from '$lib/data/doc_sequences.json';
	import type { TSeqLongformsKeys } from '$lib/types/TSequences';
	import { resolve } from '$app/paths';
	import { dict_docs as dictDoc } from '$lib/dictionaries/dict_docs.json';
	import DocumentsNav from '$lib/components/DocumentsNav.svelte';

	let seqData = $derived(seqAll.longforms);
</script>

<!-- Series -->
{#snippet keyList(keys: TSeqLongformsKeys[])}
	<div class={['preset-btn-list items-center justify-center', '--spacing-sm']}>
		{#each keys as key (key)}
			<a class="preset-btn-round --normal" href={resolve(`/${key}` as any)}
				>{seqData[key as TSeqLongformsKeys].name}</a
			>
		{/each}
	</div>
{/snippet}

<div class={['z-100 mx-auto flex max-w-300 flex-col gap-10 bg-background px-10']}>
	<!-- Navigation -->
	<DocumentsNav docType="longforms" />
	<h1 class={['h1 text-center whitespace-nowrap transition-all duration-200']}>
		{dictDoc['longforms']?.label_plural}
	</h1>

	<div class={['flex flex-col gap-5']}>
		<p>
			Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem
			ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
			Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem
			ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
			Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem
			ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
			Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem
			ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
			Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem
			ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
			Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem
			ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
			Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem
			ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
			Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem
			ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
			Lorem ipsum Lorem ipsum Lorem ipsum
		</p>
	</div>

	<div class={['flex flex-col gap-25 py-5']}>
		<!-- Chronologie -->
		<div class="flex flex-col gap-7">
			<h2 class="h2 text-center">Chronologie</h2>
			<p>Alle {dictDoc['longforms']?.label_plural}, chronologisch geordnet.</p>
			<div class="flex flex-wrap justify-center gap-2">
				{@render keyList(
					Object.keys(seqData).filter((key) => {
						return (key as string) === 'longforms_all';
					}) as TSeqLongformsKeys[]
				)}
			</div>
			<p class="text-center text-muted-foreground">(ev. später als Zeitstrahl)</p>
		</div>

		<!-- Dokumentform -->
		<div class="flex flex-col gap-7">
			<h2 class="h2 text-center">Dokumentform</h2>
			<p>
				Der Zugang aller {dictDoc['longforms']?.label_plural} über ihre Dokumentform lorem ipsum lorem
				ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem
				ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.
			</p>
			<p class="text-center text-muted-foreground">(ev. später als ausklappbare Baumstruktur)</p>

			<h5 class="h5 text-center">Entwürfe</h5>
			<div class="flex flex-wrap justify-center gap-2">
				{@render keyList(
					Object.entries(seqData)
						.filter(([, val]) => (val.type as string) === 'unpublished')
						.map(([key]) => key as TSeqLongformsKeys)
				)}
			</div>

			<h5 class="h5 text-center">Publikationen</h5>
			<div class="flex flex-wrap justify-center gap-2">
				{@render keyList(
					Object.entries(seqData)
						.filter(([, val]) => (val.type as string) === 'published')
						.map(([key]) => key as TSeqLongformsKeys)
				)}
			</div>
		</div>
	</div>
</div>
