<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';

	import dict_register from '$lib/dictionaries/dict_register.json'; //! @sebi: Why do I get "Cannot find module '$lib/dictionaries/dict_register.json' or its corresponding type declarations"?
	import register from '$lib/data/register.json';
	import { type TEntityTypes } from '$lib/types/register/TRegister';

	const reg = register.register;
	const DReg = dict_register.dict_register;

	let { text, meta, docId } = $props();

	let openRegisters: TEntityTypes[] = $state(['people', 'places']);
</script>

<div class="h-full bg-surface-500">
	<Accordion
		multiple
		class="h-full overflow-y-scroll"
		value={openRegisters}
		onValueChange={(details) => (openRegisters = details.value)}
	>
		{#each ['people', 'places', 'events', 'organisations', 'works', 'keywords'] as regType (regType)}
			<Accordion.Item value={regType} class="gap-0">
				<h3 class="h3">
					<Accordion.ItemTrigger class="flex items-center justify-between">
						{DReg[regType].name_de}
						<Accordion.ItemIndicator class="group">
							<i class="fa-solid fa-chevron-down hidden size-4 group-data-[state=open]:block"></i>
							<i class="fa-solid fa-chevron-up block size-4 group-data-[state=open]:hidden"></i>
						</Accordion.ItemIndicator>
					</Accordion.ItemTrigger>
				</h3>
				<Accordion.ItemContent class="m-0 p-0">
					{#each meta[docId]?.entities[regType] as entry (entry)}
						<div class="border-t-2 border-surface-200-800 bg-surface-50-950 px-3 py-2">
							<h6 class="h6">{reg[regType][entry].name}</h6>
							<a class="text-blue-500 underline" href={`/edition/register#${entry}`}
								>Go to Register</a
							>
						</div>
					{/each}
				</Accordion.ItemContent>
			</Accordion.Item>
		{/each}
	</Accordion>
	<p>{meta[docId]?.entities.people}</p>
</div>
