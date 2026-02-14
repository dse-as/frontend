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
		<p>{items.firstname} {items.lastname}</p>
		<p class="text-secondary-500">{items.type}</p>
		<a href={`https://d-nb.info/gnd/${items.gndNumber}`}>{items.gndNumber}</a>
	{:else if type === 'places'}
		<p>{items.name}</p>
		<a href={`https://d-nb.info/gnd/${items.gndNumber}`}>{items.gndNumber}</a>
	{:else if type === 'events'}
		<p>{items.name}</p>
		<a href={`https://d-nb.info/gnd/${items.gndNumber}`}>{items.gndNumber}</a>
	{:else if type === 'organisations'}
		<p>{items.name}</p>
		<a href={`https://d-nb.info/gnd/${items.gndNumber}`}>{items.gndNumber}</a>
	{:else if type === 'works'}
		<p>{items.name}</p>
		{@const author = reg.people?.[items.authorId]}
		<p>{author.firstname} {author.lastname}</p>
		<a href={`https://d-nb.info/gnd/${items.gndNumber}`}>{items.gndNumber}</a>
	{:else if type === 'keywords'}
		<p>{items.name}</p>
		<a href={`https://d-nb.info/gnd/${items.gndNumber}`}>{items.gndNumber}</a>
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
						<h3 class="h3">{subreg[key].name}</h3>
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
