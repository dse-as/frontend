<script lang="ts">
	import { doc_sequences as seqAll } from '$lib/data/doc_sequences.json';
	import { type TSeqCorrespondenceKeys } from '$lib/types/TSequences';
	import { resolve } from '$app/paths';
	import { dict_docs as dictDoc } from '$lib/dictionaries/dict_docs.json';
	import DocumentsNav from '$lib/components/DocumentsNav.svelte';

	let correspondendeData = $derived(seqAll.correspondence);
	const specialCorrespondences = ['corr_spec_0001'];

	let { data } = $props();
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

<div
	data-dom="topStickyElement"
	class={['z-100 flex flex-col bg-background px-10 ', 'mx-auto max-w-300 gap-10']}
>
	<!-- Navigation -->
	<DocumentsNav docType="letters" />
	<h1 class={['h1 text-center whitespace-nowrap transition-all duration-200']}>
		{dictDoc['letters']?.label_plural}
	</h1>
	<div class={['flex flex-col gap-5']}>
		<p>
			Die Korrespondenz von Annemarie Schwarzenbach entstanden auf ihren Reisen durch Europa, den
			Nahen Osten, Asien und die USA in den 1930er und 1940er Jahren. Erhalten sind einzig die
			Briefe und Postkarten, welche Schwarzenbach gesendet hat.
		</p>
	</div>

	<!-- Series Keys Large -->
	<div class={['flex flex-col gap-25 py-5']}>
		<div class="flex flex-col gap-7">
			<h2 class="h2 text-center">Erhaltene Korrespondenzen</h2>
			<div class="flex flex-wrap justify-center gap-2">
				{@render keyList(Object.keys(correspondendeData) as TSeqCorrespondenceKeys[])}
			</div>
		</div>
		<div class="flex flex-col gap-7 text-muted-foreground">
			<h2 class="h2 text-center">Korrespondenzen auf Reisen o.ä. ...</h2>
			<div class="flex flex-wrap justify-center gap-2">
				<span>TODO...</span>
			</div>
		</div>
	</div>
</div>
