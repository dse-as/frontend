<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import dict_register from '$lib/dictionaries/dict_register.json';
	import register from '$lib/data/register.json';
	import { type TEntityTypes } from '$lib/types/register/TRegister';
	import { resolve } from '$app/paths';
	import { openRegisters, selectedTextNode } from '$lib/globals/state/ui.svelte';
	import { handleRegisterClick } from '$lib/functions/interactive_edendum/handleInteractiveText';

	const dictReg = dict_register.dict_register as Record<
		string,
		{ key_singular: string; label_plural: string }
	>;
	const reg = register.register as Record<string, Record<string, any>>;

	let { docId, docMeta } = $props();

	const regTypes = Object.keys(reg);
	const nonEmptyRegTypes = regTypes.reduce<TEntityTypes[]>((acc, regType) => {
		if (docMeta?.entities[regType]?.length > 0) {
			acc.push(regType as TEntityTypes);
		}
		return acc;
	}, []);
	openRegisters.list = nonEmptyRegTypes;

	// Collect all regKeys in the register that are linked to the document
	let regEntries = $derived.by(() => {
		const regEntries = {};

		Object.keys(reg).forEach((regType) => {
			regEntries[regType] = [];

			Object.entries(reg[regType]).forEach(([key, regEntry]) => {
				if (regEntry?.docs?.includes(docId)) {
					regEntries[regType].push(key);
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
	onValueChange={(details) => (openRegisters.list = details.value as TEntityTypes[])}
>
	{#each regTypes as regType (regType)}
		<Accordion.Item value={regType} class="gap-0" data-regType={regType}>
			<h1 class="h4">
				<Accordion.ItemTrigger
					class="flex items-center justify-between border-t-2 border-surface-300-700 hover:bg-transparent"
				>
					<span>
						{dictReg[regType].label_plural}
						<span class="font-normal">({regEntries[regType]?.length})</span>
					</span>
					<Accordion.ItemIndicator class="group">
						<span class="hidden group-data-[state=open]:block"
							><i class="fa-solid fa-chevron-down"></i></span
						>
						<span class="block group-data-[state=open]:hidden"
							><i class="fa-solid fa-chevron-up"></i></span
						>
					</Accordion.ItemIndicator>
				</Accordion.ItemTrigger>
			</h1>
			<Accordion.ItemContent class="m-0 p-0">
				{#each regEntries[regType] as regKey (regKey)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						data-regKey={regKey}
						class={[
							'group flex cursor-pointer flex-wrap items-center justify-start gap-5 rounded-2xl py-3 pl-10  hover:bg-surface-300-700',
							selectedTextNode.id === regKey && 'bg-mist-300 hover:bg-mist-300!'
						]}
						onclick={() => {
							handleRegisterClick(regKey);
						}}
					>
						<h2 class="h6">{reg[regType][regKey].name}</h2>
						<a
							class="text-surface-950-500 hidden underline group-hover:block"
							href={resolve(`/edition/register/${regKey}`)}
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
