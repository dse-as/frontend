<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';

	import register from '$lib/data/register.json';
	//! use types
	import { type TRegister } from '$lib/types/register/TRegister';
	let reg = register.register; //! how to make this nicer? (@sebi)
	console.log(reg.people);
</script>

{#snippet content(type, items)}
	{#if type === 'people'}
		<h3 class="h3">{items.firstname} {items.lastname}</h3>
		<p class="text-secondary-500">{items.type}</p>
		{#if items.gndNumber}<a
				class="text-primary-500 underline"
				href={`https://d-nb.info/gnd/${items.gndNumber}`}>See in GND</a
			>{/if}
	{:else if type === 'places'}
		<h3 class="h3">{items.name}</h3>
		<p>{items.name}</p>
		{#if items.gndNumber}<a
				class="text-primary-500 underline"
				href={`https://d-nb.info/gnd/${items.gndNumber}`}>See in GND</a
			>{/if}
	{:else if type === 'events'}
		<h3 class="h3">{items.name}</h3>
		<p>{items.name}</p>
		{#if items.gndNumber}<a
				class="text-primary-500 underline"
				href={`https://d-nb.info/gnd/${items.gndNumber}`}>See in GND</a
			>{/if}
	{:else if type === 'organisations'}
		<h3 class="h3">{items.name}</h3>
		<p>{items.name}</p>
		{#if items.gndNumber}<a
				class="text-primary-500 underline"
				href={`https://d-nb.info/gnd/${items.gndNumber}`}>See in GND</a
			>{/if}
	{:else if type === 'works'}
		<h3 class="h3">{items.name}</h3>
		<p>{items.name}</p>
		{@const author = reg.people?.[items.authorId]}
		<p>{author.firstname} {author.lastname}</p>
		{#if items.gndNumber}<a
				class="text-primary-500 underline"
				href={`https://d-nb.info/gnd/${items.gndNumber}`}>See in GND</a
			>{/if}
	{:else if type === 'keywords'}
		<h3 class="h3">{items.name}</h3>
		<p>{items.name}</p>
		{#if items.gndNumber}<a
				class="text-primary-500 underline"
				href={`https://d-nb.info/gnd/${items.gndNumber}`}>See in GND</a
			>{/if}
	{/if}
{/snippet}
{#snippet accordion(type, title, subreg)}
	<Accordion collapsible multiple>
		<Accordion.Item value={title}>
			<h2 class="h2">
				<Accordion.ItemTrigger>{title}</Accordion.ItemTrigger>
			</h2>
			<Accordion.ItemContent>
				{#each Object.keys(subreg) as key}
					<div class="border-t-2 py-3 pl-5">
						{@render content(type, subreg[key])}
					</div>
				{/each}
			</Accordion.ItemContent>
		</Accordion.Item>
	</Accordion>
{/snippet}

{@render accordion('people', 'Personen', reg.people)}
{@render accordion('places', 'Orte', reg.places)}
{@render accordion('events', 'Events', reg.events)}
{@render accordion('organisations', 'Organisationen', reg.organisations)}
{@render accordion('works', 'Werke', reg.works)}
{@render accordion('keywords', 'Schlagwörter', reg.keywords)}
