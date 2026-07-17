<script lang="ts">
	import { doc_sequences as seqAll } from '$lib/data/doc_sequences.json';
	import { type TSeqCorrespondenceKeys } from '$lib/types/TSequences';
	import { resolve } from '$app/paths';
	import { dict_docs as dictDoc } from '$lib/dictionaries/dict_docs.json';
	import DocumentsNav from '$lib/components/DocumentsNav.svelte';

	let correspondendeData = $derived(seqAll.correspondence);
</script>

<!-- Series -->
{#snippet keyList(keys: TSeqPhotoseriesKeys[])}
	<div class={['preset-btn-list items-center justify-center', '--spacing-sm']}>
		{#each keys as key (key)}
			<a class="preset-btn-round --normal" href={resolve(`/${key}`)}
				>{correspondendeData[key as TSeqCorrespondenceKeys].name}</a
			>
		{/each}
	</div>
{/snippet}

<div class={['z-100 mx-auto flex max-w-300 flex-col gap-10 bg-background px-10']}>
	<!-- Navigation -->
	<DocumentsNav docType="letters" />
	<h1 class={['h1 text-center whitespace-nowrap transition-all duration-200']}>
		{dictDoc['letters']?.label_plural}
	</h1>
	<div class={['flex flex-col gap-5']}>
		<p>
			Die erhaltene Korrespondenz von Annemarie Schwarzenbach umfasst über 900 Briefe sowie ein
			Netzwerk von rund 60 Personen. Bis auf wenige Ausnahmen sind einzig die Briefe aus der Hand
			von Annemarie Schwarzenbach erhalten.
		</p>
	</div>

	<!-- Series Keys Large -->
	<div class={['flex flex-col gap-25 py-5']}>
		<div class="flex flex-col gap-7">
			<h2 class="h2 text-center">Korrespondenzpartner:innen</h2>
			<div class="flex flex-wrap justify-center gap-2">
				{@render keyList(
					Object.keys(correspondendeData).filter((key) => {
						return !key.includes('correspondence_spec_');
					}) as TSeqCorrespondenceKeys[]
				)}
			</div>
		</div>
		<div class="flex flex-col gap-7">
			<h2 class="h2 text-center">Spezial-Sammlungen</h2>
			<div class="flex flex-wrap justify-center gap-2">
				{@render keyList(
					Object.keys(correspondendeData).filter((key) => {
						return key.includes('correspondence_spec_');
					}) as TSeqCorrespondenceKeys[]
				)}
			</div>
		</div>
		<div class="flex flex-col gap-7 text-muted-foreground">
			<h2 class="h2 text-center">Korrespondenz nach Reise o.ä. ...</h2>
			<div class="flex flex-wrap justify-center gap-2">
				<span>TODO...</span>
			</div>
		</div>
	</div>
</div>
