<script lang="ts">
	let { metadata, docid } = $props();
</script>

<div class="p-5">
	<h1 class="h1">{metadata[docid].metadata.title_full}</h1>
	<h2 class="h2">{metadata[docid].metadata.pubPlace} in {metadata[docid].metadata.year}</h2>

	<div class="m-5 border-4 p-5">
		{#each Object.entries(metadata[docid].metadata) as entry}
			<p><strong>{entry[0]}:</strong> {entry[1]}</p>
		{/each}
	</div>
	<!-- <p><strong>Metadata:</strong> {data.meta[].docType}</p> -->
</div>
