<script lang="ts">
	import { resolve } from '$app/paths';

	let { data, children } = $props();

	import { dict_docPicker as dictDocPicker } from '$lib/dictionaries/dict_docPicker.json';

	const docTypeIdsForButtons = ['smallforms', 'longforms', 'letters'];
</script>

<!-- Snippet for List -->

{#if data.edView}
	<!-- Snippet for Navigation -->
	{#snippet nav()}
		<nav
			class={[
				'flex transition-all duration-200',
				data.edView === 'edView1'
					? 'mx-auto mt-50 w-2/3 max-w-200 flex-wrap items-center justify-center gap-4 p-2'
					: 'h-full w-full gap-2'
			]}
		>
			{#each docTypeIdsForButtons as docTypeId (docTypeId)}
				<a
					class={[
						'my-btn-round hover:bg-surface-200-800!',
						data.edView === 'edView1' ? 'border-2 text-2xl' : 'border text-sm',
						data.regType === docTypeId && 'my-btn-active'
					]}
					href={resolve(`/edition/${docTypeId}`)}
				>
					{dictDocPicker[docTypeId]?.label_plural}
				</a>
			{/each}
		</nav>
	{/snippet}

	<!-- Navigation -->
	{#if data.edView === 'edView2' || data.edView === 'edView3'}
		{@render nav()}
	{/if}

	<!-- Large docPicker-Menu  -->
	<!-- The animated transition uses the width of the element -->
	<h1
		class={[
			'absolute transition-all duration-400',
			data.edView === 'edView1'
				? 'top-45 left-0 w-full text-center h1'
				: data.edView === 'edView2'
					? 'top-45 left-0 w-1 pl-10  text-center h1 whitespace-nowrap'
					: 'top-38 left-0 w-1 pl-10 text-center h4 whitespace-nowrap'
		]}
	>
		{data.edView === 'edView1' ? 'Dokumente' : dictDocPicker[data.edType]?.name}
	</h1>

	<!-- Navigation  -->
	{#if data.edView === 'edView1'}
		{@render nav()}
	{/if}
	{@render children()}
{:else}
	{@render children()}
{/if}
