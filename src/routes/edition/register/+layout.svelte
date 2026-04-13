<script lang="ts">
	import { dict_register as dictReg } from '$lib/dictionaries/dict_register.json';
	import { resolve } from '$app/paths';

	let { data, children } = $props();

	const regIdsForButtons = ['people', 'places', 'keywords', 'orgs', 'events', 'bibls'];

	// Locally used datasets
	// - data.regView
	// - data.regSlug
	// - data.regType
</script>

<!-- Snippet for Navigation -->
{#snippet nav()}
	<nav
		class={[
			'flex transition-all duration-200',
			data.regView === 'regView1'
				? 'mx-auto mt-40 w-2/3 max-w-200 flex-wrap items-center justify-center gap-4 p-2'
				: 'h-full w-full gap-2'
		]}
	>
		{#each regIdsForButtons as regId (regId)}
			<a
				class={[
					'my-btn-round hover:bg-surface-300-700!',
					data.regView === 'regView1' ? 'border-2 text-2xl' : 'border text-sm',
					data.regType === regId && 'my-btn-active'
				]}
				href={resolve(`/edition/register/${regId}`)}
			>
				{dictReg[regId]?.label_plural}
			</a>
		{/each}
	</nav>
{/snippet}

<!-- Navigation -->
{#if data.regView === 'regView2' || data.regView === 'regView3'}
	{@render nav()}
{/if}

<!-- Large Register-Menu  -->
<!-- The animated transition uses the width of the element -->
<h1
	class={[
		'absolute transition-all duration-400',
		data.regView === 'regView1'
			? 'top-35 left-0 w-full text-center h1'
			: data.regView === 'regView2'
				? 'top-35 left-0 w-1 pl-10  text-center h1 whitespace-nowrap'
				: 'top-38 left-0 w-1 pl-10 text-center h4 whitespace-nowrap'
	]}
>
	{data.regView === 'regView1' ? 'Register' : dictReg[data.regType]?.register_name}
</h1>

<!-- Navigation -->
{#if data.regView === 'regView1'}
	{@render nav()}
{/if}

{@render children()}
