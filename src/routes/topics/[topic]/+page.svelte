<script>
	import { resolve } from '$app/paths';

	let { data } = $props();
	let topicData = $derived(
		Object.values(data.seqAll.topics).find((item) => item.url_slug === data.topic_slug)
	);
</script>

<h1 class="h1">{topicData?.preamble}</h1>

<ul>
	{#each topicData?.docs as docId}
		<li class="mt-2">
			<a href={resolve(`/edition/${docId}`)}>{data.meta[docId].metadata.title_full}</a>
		</li>
	{/each}
</ul>
