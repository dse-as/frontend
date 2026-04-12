<script>
	import { resolve } from '$app/paths';
	import { findEdTypeByDocId } from '$lib/functions/ease_of_use/findEdTypeByDocId';
	let { fullMeta, seqData, seqId } = $props();
</script>

<ul>
	{#each seqData?.docs as docId}
		{@const docType = findEdTypeByDocId(docId)}
		<li class="mt-2">
			<a href={resolve(`/edition/${docId}?seq=${seqId}`)}
				>{fullMeta[docType]?.[docId].metadata.title_full}</a
			>
		</li>
	{/each}
</ul>
