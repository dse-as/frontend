<script>
	import { resolve } from '$app/paths';
	import { doc_sequences as seqAll } from '$lib/data/doc_sequences.json';

	let corrData = $derived(seqAll.correspondence);
	const specialCorrs = ['corr_spec_0001'];
</script>

<div class="mx-auto mt-13 flex w-full max-w-300 flex-col items-center justify-center">
	<h1 class="h1">Korrespondenz</h1>
	<div class="mt-10 flex flex-wrap justify-center gap-4">
		<a
			class="my-btn-round text-2xl"
			href={resolve(`/edition/${corrData['corr_spec_0001'].docs[0]}?seq=corr_spec_0001`)}
			>Gesamtkorrespondenz</a
		>
	</div>

	<h2 class="mt-30 h2">Spezifische Korrespondenzen</h2>
	<div class="mt-10 flex flex-wrap justify-center gap-2">
		{#each Object.keys(corrData).filter((corrId) => {
			return !specialCorrs.includes(corrId);
		}) as corrId}
			{@const firstDocId = corrData[corrId].docs[0]}
			<a
				class={[
					'my-btn-round',
					!firstDocId && 'pointer-events-none border-surface-500 text-surface-500'
				]}
				href={resolve(`/edition/${firstDocId}?seq=${corrId}`)}>{corrData[corrId].name}</a
			>
		{/each}
	</div>

	<h2 class="mt-30 h2">Korrespondenzen auf Reisen o.ä. ...</h2>
	<div class="mt-10 flex flex-wrap justify-center gap-2"><span>TODO...</span></div>
</div>
