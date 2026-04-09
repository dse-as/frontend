<script lang="ts">
	import { page } from '$app/state';
	import { register as reg } from '$lib/data/register.json';
	import { dict_register as dictReg } from '$lib/dictionaries/dict_register.json';

	let { children } = $props();
	import { findKeyBySlug } from '$lib/functions/ease_of_use/findKeyBySlug';
	import { flip } from 'svelte/animate';
	let regSlug = $derived(page.params.regSlug);
	let isOverview1 = $derived(!regSlug ? true : false);
	let isOverview2 = $derived(Object.keys(reg).includes(regSlug));
	let regType = $derived(isOverview2 ? regSlug : findKeyBySlug(reg, regSlug));

	const regIdsForButtons = ['people', 'places', 'keywords', 'orgs', 'events', 'bibls'];
</script>

<!-- Navigation -->
{#if regSlug}
	{@render nav()}
{/if}

<!-- Large Register-Menu  -->
<h1
	class={[
		'absolute pl-10 transition-all duration-400',
		isOverview1
			? 'top-45 w-full text-center h1'
			: isOverview2
				? 'top-45 left-0 w-1  text-center h1 whitespace-nowrap'
				: 'top-38 left-5 w-1 text-center h4 whitespace-nowrap'
	]}
>
	{isOverview1 ? 'Register' : dictReg[regType]?.register_name}
</h1>
<!-- Navigation for  -->
{#if isOverview1}
	{@render nav()}
{/if}

{#snippet nav()}
	<nav
		class={[
			'flex transition-all duration-200',
			isOverview1
				? 'mx-auto mt-50 w-2/3 max-w-200 flex-wrap items-center justify-center gap-4 p-2'
				: 'h-full w-full gap-2 p-2'
		]}
	>
		{#each regIdsForButtons as regId (regId)}
			<a
				class={[
					'my-btn-round hover:bg-surface-200-800!',
					isOverview1 ? 'border-2 text-2xl' : 'border text-sm',
					regType === regId && 'my-btn-active'
				]}
				href={`/edition/register/${regId}`}
				animate:flip={{ delay: 200 }}
			>
				{dictReg[regId]?.label_plural}
			</a>
		{/each}
	</nav>
{/snippet}

{@render children()}
