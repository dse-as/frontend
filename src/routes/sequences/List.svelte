<script>
	import { resolve } from '$app/paths';
	import { findEdTypeByDocId } from '$lib/functions/ease_of_use/findEdTypeByDocId';
	let { fullMeta, seqData, seqKey } = $props();
</script>

<ul>
	{#each seqData?.docs as docId}
		{@const docType = findEdTypeByDocId(docId)}
		{#if docType}
			<li class="mt-2">
				<a href={resolve(`/edition/${docId}?seq=${seqKey}`)}
					>{fullMeta[docType]?.[docId].metadata.title_full}</a
				>
			</li>
		{/if}
	{/each}
</ul>
