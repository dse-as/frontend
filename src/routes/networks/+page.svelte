<script>
	import { resolve } from '$app/paths';
	import { doc_sequences as seqAll } from '$lib/data/doc_sequences.json';

	let corrData = $derived(seqAll.correspondence);
	const specialCorrs = ['corr_spec_0001'];
</script>

<h1 class="h1">Korrespondenz</h1>
<div class="mt-5 flex flex-wrap gap-2">
	<a
		class="my-btn-round"
		href={resolve(`/edition/${corrData['corr_spec_0001'].docs[0]}?seq=corr_spec_0001`)}
		>Gesamtkorrespondenz</a
	>
</div>

<h2 class="mt-10 h2">Spezifische Korrespondenzen</h2>
<div class="mt-5 flex flex-wrap gap-2">
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

<h2 class="mt-10 h2">Korrespondenzen in...</h2>
<div class="mt-5 flex flex-wrap gap-2"><span>TODO:</span> z.B. Reisen usw.</div>
