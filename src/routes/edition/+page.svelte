<script lang="ts">
	let { data } = $props();
</script>

<div class="m-10">
	{#snippet list(meta)}
		<ul class="my-4">
			{#each Object.keys(meta) as key (key)}
				<li>
					<a href={`edition/${key}`}>{meta[key].metadata.title_full} ({meta[key].metadata.year})</a>
				</li>
			{/each}
		</ul>
	{/snippet}

	<h1 class="mt-5 h1">Letters</h1>
	{@render list(data.let_meta.letters_meta)}

	<h1 class="mt-5 h1">Longforms</h1>
	{@render list(data.lgf_meta.longforms_meta)}

	<h1 class="mt-5 h1">Smallforms</h1>
	{@render list(data.smf_meta.smallforms_meta)}
</div>
