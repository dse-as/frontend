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
		<p>{items.firstname}</p>
		<a href={`https://d-nb.info/gnd/${items.gndNumber}`}>{items.gndNumber}</a>
	{:else if type === 'places'}
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
				<Accordion collapsible multiple>
					{#each Object.keys(subreg) as key}
						<Accordion.Item value={subreg[key].name}>
							<h3 class="h3">
								<Accordion.ItemTrigger>{subreg[key].name}</Accordion.ItemTrigger>
							</h3>
							<Accordion.ItemContent>
								{@render content(type, subreg[key])}
							</Accordion.ItemContent>
						</Accordion.Item>
					{/each}
				</Accordion>
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
