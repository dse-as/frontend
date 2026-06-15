<script lang="ts">
	import { Accordion } from 'bits-ui';
	import dict_register from '$lib/dictionaries/dict_register.json';
	import register from '$lib/data/register.json';
	import { type TRegKeysFlat, type TRegTypes } from '$lib/types/register/TRegister';
	import { resolve } from '$app/paths';
	import { openRegisters, selectedTextNode } from '$lib/globals/ui-states.svelte';
	import {
		handleRegisterClick,
		handleJumpToSibling
	} from '$lib/functions/interactive_edendum/handleInteractiveText';
	import { slide } from 'svelte/transition';

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

<Accordion.Root
	type="multiple"
	bind:value={openRegisters.list}
	data-dom="containerRegister"
	class=""
>
	{#each regTypes as regType (regType)}
		<Accordion.Item value={regType} data-regType={regType}>
			<h1 class="h4">
				<Accordion.Trigger
					class="group flex w-full gap-2 border-surface-300 py-3 hover:bg-transparent"
				>
					<div>
						<i
							class="fa-regular fa-chevron-right text-lg transition-transform group-data-[state=open]:rotate-90"
						></i>
					</div>
					<span class="">
						{dictReg[regType].label_plural}
						<span class="font-sans font-normal">({regEntries[regType]?.length})</span>
					</span>
				</Accordion.Trigger>
			</h1>
			<Accordion.Content class="" forceMount={true}>
				{#snippet child({ props, open })}
					{#if open}
						<div {...props} transition:slide={{ duration: 300 }}>
							<div class="pb-[25px]">
								{#each regEntries[regType] as regKey (regKey)}
									<div
										role="button"
										tabindex="0"
										data-regKey={regKey}
										class={[
											'group flex min-h-14 cursor-pointer flex-wrap items-center justify-start gap-5 py-1 pl-2 hover:bg-(--color-note-active) hover:text-(--color-note-active-foreground)',
											selectedTextNode.key === regKey &&
												'bg-(--color-note-active) text-(--color-note-active-foreground) hover:bg-(--color-note-active) hover:text-(--color-note-active-foreground)'
										]}
										onclick={() => {
											handleRegisterClick(regKey);
										}}
										onkeydown={() => {
											handleRegisterClick(regKey);
										}}
									>
										<p class="text-lg">{reg[regType][regKey].name}</p>
										{#if selectedTextNode.key === regKey}
											<button
												class="flex h-9 w-9 items-center justify-center rounded-full hover:bg-light-10 hover:text-background-contrast"
												aria-label="select previous match"
												onclick={(ev) => {
													ev.stopPropagation();
													handleJumpToSibling(regKey, 'prev');
												}}><i class="fa-arrow-left-long fa-regular"></i></button
											>
											<button
												class="flex h-9 w-9 items-center justify-center rounded-full hover:bg-light-10"
												aria-label="select next match"
												onclick={(ev) => {
													ev.stopPropagation();
													handleJumpToSibling(regKey, 'next');
												}}><i class="fa-arrow-right-long fa-regular"></i></button
											>
										{/if}
										<a
											class="flex h-9 w-9 items-center justify-center rounded-full group-hover:flex group-[data-active]:flex hover:bg-light-10"
											href={resolve(`/edition/register/${regKey as string}`)}
											target="_blank"
											aria-label="In Register öffnen"
											rel="noopener noreferrer"><i class="fa-rectangle-list fa-regular"></i></a
										>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				{/snippet}
			</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
