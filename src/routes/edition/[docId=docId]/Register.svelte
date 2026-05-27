<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import dict_register from '$lib/dictionaries/dict_register.json';
	import register from '$lib/data/register.json';
	import { type TRegKeysFlat, type TRegTypes } from '$lib/types/register/TRegister';
	import { resolve } from '$app/paths';
	import { openRegisters, selectedTextNode } from '$lib/globals/ui-states.svelte';
	import { handleRegisterClick } from '$lib/functions/interactive_edendum/handleInteractiveText';

	const dictReg = dict_register.dict_register as Record<
		string,
		{ key_singular: string; label_plural: string }
	>;
	const reg = register.register as Record<string, Record<string, any>>;

	let { docId, docItem } = $props();

	const regTypes = Object.keys(reg);
	const nonEmptyRegTypes = regTypes.reduce<TRegTypes[]>((acc, regType) => {
		if (docItem?.entities[regType]?.length > 0) {
			acc.push(regType as TRegTypes);
		}
		return acc;
	}, []);
	openRegisters.list = nonEmptyRegTypes;

	// Collect all regKeys in the register that are linked to the document
	let regEntries = $derived.by(() => {
		const regEntries: Record<string, TRegKeysFlat[]> = {};

		Object.keys(reg).forEach((regType) => {
			regEntries[regType] = [];

			Object.entries(reg[regType]).forEach(([key, regEntry]) => {
				if (regEntry?.docs?.includes(docId)) {
					regEntries[regType].push(key as TRegKeysFlat);
				}
			});
		});
		return regEntries;
	});
</script>

<Accordion
	data-dom="containerRegister"
	multiple
	class="h-full gap-0 overflow-y-auto"
	value={openRegisters.list}
	onValueChange={(details) => (openRegisters.list = details.value as TRegTypes[])}
>
	{#each regTypes as regType (regType)}
		<Accordion.Item value={regType} class="gap-0" data-regType={regType}>
			<h1 class="h4">
				<Accordion.ItemTrigger
					class="flex items-center justify-start gap-5 rounded-none border-t-2 border-surface-300-700 hover:bg-transparent"
				>
					<Accordion.ItemIndicator class="group">
						<span class="hidden group-data-[state=open]:block"
							><i class="fa-regular fa-chevron-down text-lg"></i></span
						>
						<span class="block group-data-[state=open]:hidden"
							><i class="fa-regular fa-chevron-right text-lg"></i></span
						>
					</Accordion.ItemIndicator>
					<span class="">
						{dictReg[regType].label_plural}
						<span class="font-normal">({regEntries[regType]?.length})</span>
					</span>
				</Accordion.ItemTrigger>
			</h1>
			<Accordion.ItemContent class="m-0 p-0">
				{#each regEntries[regType] as regKey (regKey)}
					<div
						role="button"
						tabindex="0"
						data-regKey={regKey}
						class={[
							'group flex min-h-14 cursor-pointer flex-wrap items-center justify-start gap-5 rounded-2xl py-1 pl-17  hover:bg-surface-300-700',
							selectedTextNode.id === regKey && 'bg-mist-300 hover:bg-mist-300!'
						]}
						onclick={() => {
							handleRegisterClick(regKey);
						}}
						onkeydown={() => {
							handleRegisterClick(regKey);
						}}
					>
						<p class="text-lg">{reg[regType][regKey].name}</p>
						<a
							class="text-surface-950-500 hidden rounded-full px-2 py-2 underline group-hover:block hover:bg-surface-100-900"
							href={resolve(`/edition/register/${regKey as string}`)}
							target="_blank"
							aria-label="In Register öffnen"
							rel="noopener noreferrer"><i class="fa-rectangle-list fa-regular"></i></a
						>
					</div>
				{/each}
			</Accordion.ItemContent>
		</Accordion.Item>
	{/each}
</Accordion>
