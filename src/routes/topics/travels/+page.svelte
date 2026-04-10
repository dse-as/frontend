<script lang="ts">
	import List from '../List.svelte';

	let { data } = $props();
	let dataset = $derived(data.seqAll.travels as Record<string, any>);
</script>

<h1 class="h1">Reisen</h1>

{#each Object.keys(dataset) as id}
	<div class="mt-5 rounded-xl bg-surface-200-800 p-5">
		<h4 class="mt-5 h4">{dataset[id].preamble}</h4>
		<List meta={data.meta} seqData={dataset[id]} seqId={id} />
	</div>
{/each}
