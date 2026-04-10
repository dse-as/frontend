<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';

	import { dict_register as dictReg } from '$lib/dictionaries/dict_register.json';
	import { register as reg } from '$lib/data/register.json';
	import { type TEntityTypes } from '$lib/types/register/TRegister';
	import { resolve } from '$app/paths';

	let { meta, docId } = $props();

	const regTypes = Object.keys(reg) as Array<keyof typeof reg>;

	const nonEmptyRegTypes = regTypes.reduce<TEntityTypes[]>((acc, regType) => {
		if (meta[docId]?.entities[regType]?.length > 0) {
			acc.push(regType);
		}
		return acc;
	}, []);

	function getAllKeys(reg) {
		const keysList = [];

		// Iterate over each property in the reg object
		Object.keys(reg).forEach((type) => {
			// Check if the property is an object
			if (typeof reg[type] === 'object' && reg[type] !== null) {
				Object.keys(reg[type]).forEach((item) => {
					if (typeof reg[type][item] === 'object' && reg[type][item] !== null) {
						// Iterate over the keys in the nested object
						Object.keys(reg[type][item]).forEach((key) => {
							keysList.push(key);
						});
					}
				});
			}
		});

		return keysList;
	}

	let openRegisters: TEntityTypes[] = $state(nonEmptyRegTypes);

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

<div class="h-full">
	<Accordion
		multiple
		class="h-full gap-0 overflow-y-auto"
		value={openRegisters}
		onValueChange={(details) => (openRegisters = details.value as TEntityTypes[])}
	>
		{#each regTypes as regType (regType)}
			<Accordion.Item value={regType} class="gap-0">
				<h1 class="h4">
					<Accordion.ItemTrigger
						class="flex items-center justify-between border-t-2 border-surface-200-800 hover:bg-transparent"
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
					{#each regEntries[regType] as entry (entry)}
						<div class="py-3 pl-10 hover:bg-surface-50-950">
							<h2 class="h6">{reg[regType][entry].name}</h2>
							<a
								class="text-blue-500 underline"
								href={resolve(`/edition/register/${entry}`)}
								target="_blank"
								rel="noopener noreferrer">Registereintrag öffnen</a
							>
						</div>
					{/each}
				</Accordion.ItemContent>
			</Accordion.Item>
		{/each}
	</Accordion>
</div>
