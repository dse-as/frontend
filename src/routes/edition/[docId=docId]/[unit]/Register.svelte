<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';

	import dict_register from '$lib/dictionaries/dict_register.json'; //! @sebi: Why do I get "Cannot find module '$lib/dictionaries/dict_register.json' or its corresponding type declarations"?
	import register from '$lib/data/register.json';
	import { type TEntityTypes } from '$lib/types/register/TRegister';

	let { text, meta, docId } = $props();

	const reg = register.register;
	const DReg = dict_register.dict_register;
	const regTypes = Object.keys(reg) as Array<keyof typeof reg>;

	const nonEmptyRegTypes = regTypes.reduce<TEntityTypes[]>((acc, regType) => {
		if (meta[docId]?.entities[regType]?.length > 0) {
			acc.push(regType);
		}
		return acc;
	}, []);

	let openRegisters: TEntityTypes[] = $state(nonEmptyRegTypes);
</script>

<div class="h-full">
	<!-- //! @sebi how to type openRegisters = details.value if I cannot access Skeleton's internals? -->
	<Accordion
		multiple
		class="h-full gap-0 overflow-y-scroll"
		value={openRegisters}
		onValueChange={(details) => (openRegisters = details.value)}
	>
		{#each regTypes as regType (regType)}
			<Accordion.Item value={regType} class="gap-0 p-2">
				<h3 class="h3">
					<Accordion.ItemTrigger class="flex items-center justify-between bg-surface-100-900">
						<span>
							{DReg[regType].name_de}
							<span class="font-normal">({meta[docId]?.entities[regType].length})</span>
						</span>
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
</div>
