<script lang="ts">
	import { resolve } from '$app/paths';
	let { data, children } = $props();

	import { dict_docs as dictDoc } from '$lib/dictionaries/dict_docs.json';

	const docTypeIdsForButtons = ['smallforms', 'longforms', 'letters'] as const;
</script>

{#if data.edView}
	<!-- Snippet for Navigation -->
	{#snippet nav()}
		<nav
			class={[
				'flex transition-all duration-200',
				data.edView === 'edView1'
					? 'mx-auto mt-40 w-2/3 max-w-200 flex-wrap items-center justify-center gap-4 p-2'
					: 'h-full w-full gap-2'
			]}
		>
			{#each docTypeIdsForButtons as docTypeId (docTypeId)}
				<a
					class={[
						'my-btn-round hover:bg-surface-200-800!',
						data.edView === 'edView1' ? 'border-2 text-2xl' : 'border text-sm',
						data.docType === docTypeId && 'my-btn-active'
					]}
					href={resolve(`/edition/${docTypeId}`)}
				>
					{dictDoc[docTypeId]?.label_plural}
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
				? 'top-35 left-0 w-full text-center h1'
				: data.edView === 'edView2'
					? 'top-35 left-0 w-1 pl-10  text-center h1 whitespace-nowrap'
					: 'top-38 left-0 w-1 pl-10 text-center h4 whitespace-nowrap'
		]}
	>
		{data.edView === 'edView1' ? 'Dokumente' : data.docType ? dictDoc[data.docType]?.name : ''}
	</h1>
	<!-- Navigation  -->
	{#if data.edView === 'edView1'}
		{@render nav()}
		<div class="mt-20 text-center">
			<h2 class=" mb-5 h2">Shortcuts</h2>
			<p class="text-xl">
				&rarr; <a class="underline" href={resolve('/edition/smallform_0231')}>Smallform 0231</a>
			</p>
		</div>
	{/if}
	{@render children()}
{:else}
	{@render children()}
{/if}
