<script>
	import { resolve } from '$app/paths';
	let { meta, seqData, seqId } = $props();
</script>

<ul>
	{#each seqData?.docs as docId}
		<li class="mt-2">
			<a href={resolve(`/edition/${docId}?seq=${seqId}`)}>{meta[docId].metadata.title_full}</a>
		</li>
	{/each}
</ul>
