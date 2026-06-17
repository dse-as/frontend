<script lang="ts">
	import { resolve } from '$app/paths';
	import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc.js';

	let { data } = $props();
</script>

<h1 class="h1">{data.topicData?.preamble}</h1>

<div class="mt-5 rounded-card p-5">
	<h4 class="h4">Alle Dokumente</h4>
	<ul>
		{#each data.topicData?.docs as docId (docId)}
			{@const { item: resDoc } = resolveDoc(data.allDocs, docId) || { item: null }}
			<li class="mt-2">
				<a href={resolve(`/${docId as string}`)}>{resDoc?.metadata.title_full}</a>
			</li>
		{/each}
	</ul>
</div>
