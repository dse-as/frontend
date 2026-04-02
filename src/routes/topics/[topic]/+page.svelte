<script>
	import { resolve } from '$app/paths';

	let { data } = $props();
	let topicData = $derived(
		Object.values(data.seqAll.topics).find((item) => item.url_slug === data.slug)
	);
	console.log(data.seqAll.topics);
	$inspect(topicData?.preamble);
</script>

<h1 class="h1">{topicData?.preamble}</h1>

<div class="mt-5 rounded-xl bg-surface-200-800 p-5">
	<h4 class="h4">Alle Dokumente</h4>
	<ul>
		{#each topicData?.docs as docId}
			<li class="mt-2">
				<a href={resolve(`/edition/${docId}`)}>{data.meta[docId].metadata.title_full}</a>
			</li>
		{/each}
	</ul>
</div>
