<script>
	import List from '../List.svelte';

	let { data } = $props();
	let seqId = 'corr_spec_0002';
	let seqData = $derived(data.seqAll.correspondence[seqId]);
</script>

<h1 class="h1">Hotelbriefe</h1>
<div class="mt-5 rounded-xl bg-surface-200-800 p-5">
	<h4 class="h4">Alle Dokumente</h4>
	<List meta={data.meta} {seqData} {seqId} />
</div>
