<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

{#snippet list(meta)}
	<ul class="my-4 h-full overflow-y-auto">
		{#each Object.keys(meta) as key (key)}
			<li>
				<a href={resolve(`/edition/${key}`)}
					>{meta[key].metadata.title_full} ({meta[key].metadata.year})</a
				>
			</li>
		{/each}
	</ul>
{/snippet}

<div class="mb-20 flex h-[70vh] gap-25">
	<div class="h-full w-100">
		<h1 class="mt-5 h1">Letters</h1>
		{@render list(data.let_meta.letters_meta)}
	</div>

	<div class="h-full w-100">
		<h1 class="mt-5 h1">Longforms</h1>
		{@render list(data.lgf_meta.longforms_meta)}
	</div>

	<div class="h-full w-100">
		<h1 class="mt-5 h1">Smallforms</h1>
		{@render list(data.smf_meta.smallforms_meta)}
	</div>
</div>
