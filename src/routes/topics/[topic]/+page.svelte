<script>
	import { resolve } from '$app/paths';
	import { findEdTypeByDocId } from '$lib/functions/ease_of_use/findEdTypeByDocId';

	let { data } = $props();
</script>

<h1 class="h1">{data.topicData?.preamble}</h1>

<div class="mt-5 rounded-xl bg-surface-200-800 p-5">
	<h4 class="h4">Alle Dokumente</h4>
	<ul>
		{#each data.topicData?.docs as docId}
			{@const docType = findEdTypeByDocId(docId)}
			<li class="mt-2">
				<a href={resolve(`/edition/${docId}`)}
					>{data.fullMeta[docType]?.[docId].metadata.title_full}</a
				>
			</li>
		{/each}
	</ul>
</div>
