<script lang="ts">
	import { resolve } from '$app/paths';
	import { findEdTypeByDocId } from '$lib/functions/ease_of_use/findEdTypeByDocId';

	let { data } = $props();
	const fullMetaRecord = $derived(data.fullMeta as Record<string, Record<string, any>>);
</script>

<h1 class="h1">{data.topicData?.preamble}</h1>

<div class="mt-5 rounded-xl bg-surface-200-800 p-5">
	<h4 class="h4">Alle Dokumente</h4>
	<ul>
		{#each data.topicData?.docs as docId}
			{@const docType = findEdTypeByDocId(docId as any)}
			{@const docMeta = docType ? fullMetaRecord[docType]?.[docId] : undefined}
			<li class="mt-2">
				<a href={resolve(`/edition/${docId}`)}>{docMeta?.metadata?.title_full || docId}</a>
			</li>
		{/each}
	</ul>
</div>
