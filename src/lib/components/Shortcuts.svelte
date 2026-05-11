<script lang="ts">
	import { dict_register as dictReg } from '$lib/dictionaries/dict_register.json';
	import { uiRegGroupByCat } from '$lib/globals/state/ui.svelte';
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { slugify } from '$lib/functions/ease_of_use/slugify';
	import { type TRegGroups, type TRegTypes } from '$lib/types/register/TRegister';

	type K = TRegTypes;
	interface Props<T extends K = K> {
		isMultiColumn: boolean;
		hasGroupControls: boolean;
		autoCatLabels: string[];
		allGroupKeys: TRegGroups[T][];
		regType: T | null;
	}
	let { isMultiColumn, hasGroupControls, autoCatLabels, allGroupKeys, regType }: Props = $props();
</script>

{#if isMultiColumn && (!hasGroupControls || !uiRegGroupByCat.value)}
	<div class="flex w-max justify-center gap-2">
		{#each autoCatLabels as letter (letter)}
			<button
				onclick={() => {
					goto(`#${letter}`, { replaceState: true, noScroll: true });
					tick();
					window.scrollTo({ top: 0, behavior: 'auto' });
				}}
				class="center flex w-8 items-center justify-center hover:font-bold"><p>{letter}</p></button
			>
		{/each}
	</div>
{:else if regType && isMultiColumn && hasGroupControls && uiRegGroupByCat.value}
	<div class="flex w-full justify-start gap-2 overflow-x-auto pb-5">
		{#each allGroupKeys as groupKey (groupKey)}
			{@const groupLabel = (dictReg[regType].groups as any)[groupKey]?.label_plural}
			<button
				onclick={() => {
					goto(`#${slugify(groupLabel, { slash: true })}`, {
						replaceState: true,
						noScroll: true
					});
					tick();
					window.scrollTo({ top: 0, behavior: 'auto' });
				}}
				class="center flex h-10 items-center justify-center rounded-full border px-4 whitespace-nowrap hover:bg-surface-300-700"
				><p>{groupLabel}</p></button
			>
		{/each}
	</div>
{/if}
