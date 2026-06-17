<script lang="ts">
	import { resolve } from '$app/paths';
	import { doc_sequences as seqAll } from '$lib/data/doc_sequences.json';
	import { type TSeqCorrespondenceKeys } from '$lib/types/TSequences';

	let corrData = $derived(seqAll.correspondence);
	const specialCorrs = ['corr_spec_0001'];
</script>

<div class="mx-auto mt-13 flex w-full max-w-300 flex-col items-center justify-center">
	<h1 class="h1">Korrespondenz</h1>
	<div class="mt-10 flex flex-wrap justify-center gap-4">
		<a
			class="preset-btn-round --2xl"
			href={resolve(`/${corrData['corr_spec_0001'].docs[0]}?seq=corr_spec_0001`)}>Alle Briefe</a
		>
	</div>

	<h2 class="h2 mt-30">Spezifische Korrespondenzen</h2>
	<div class="mt-10 flex flex-wrap justify-center gap-2">
		{#each Object.keys(corrData).filter((corrId) => {
			return !specialCorrs.includes(corrId);
		}) as corrId (corrId)}
			{@const firstDocId = corrData[corrId as TSeqCorrespondenceKeys].docs[0]}
			{#if firstDocId}
				<a class="preset-btn-round --lg" href={resolve(`/${firstDocId}?seq=${corrId}`)}
					>{corrData[corrId as TSeqCorrespondenceKeys].name}</a
				>
			{:else}
				<span class="preset-btn-round --lg --muted"
					>{corrData[corrId as TSeqCorrespondenceKeys].name}</span
				>
			{/if}
		{/each}
	</div>

	<h2 class="h2 mt-30">Korrespondenzen auf Reisen o.ä. ...</h2>
	<div class="mt-10 flex flex-wrap justify-center gap-2"><span>TODO...</span></div>
</div>
