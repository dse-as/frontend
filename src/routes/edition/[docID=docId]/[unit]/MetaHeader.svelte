<script lang="ts">
	let { metadata, docid } = $props();
	let isExpanded = $state(false);
</script>

<div class="p-5">
	<h1 class="h1">{metadata[docid].metadata.title_full}</h1>
	<h2 class="h2">{metadata[docid].metadata.pubPlace} in {metadata[docid].metadata.year}</h2>

	<!-- <div class={['m-5 border-4 p-5', !isExpanded && 'max-h-50 overflow-hidden']}> -->

	<div class={['relative m-5 border-4 p-5']}>
		<!-- Metadata -->
		<div class={[isExpanded ? 'h-auto' : 'max-h-20 overflow-hidden']}>
			{#each Object.entries(metadata[docid].metadata) as entry}
				<p><strong>{entry[0]}:</strong> {entry[1]}</p>
			{/each}
		</div>

		<!-- Gradient -->
		{#if !isExpanded}
			<button
				class="absolute right-0 bottom-0 left-0 h-full bg-gradient-to-t from-white to-transparent"
				aria-label="expand box"
				onclick={() => {
					isExpanded = !isExpanded;
				}}
			></button>
		{/if}

		<!-- Button to Open/Close -->
		<div class="absolute left-1/2 -translate-x-1/2 transform" style="bottom: -20px;">
			<button
				class="z-10 h-12 w-12 rounded-full bg-surface-950-50 text-surface-50-950"
				aria-label="expand box"
				onclick={() => {
					isExpanded = !isExpanded;
				}}
			>
				<i class={['fa-solid', isExpanded ? 'fa-chevron-up' : 'fa-chevron-down']}></i>
			</button>
		</div>
	</div>
	<!-- <p><strong>Metadata:</strong> {data.meta[].docType}</p> -->
</div>
