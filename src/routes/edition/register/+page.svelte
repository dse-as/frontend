<script lang="ts">
	import register from '$lib/data/register.json';

	//! How to use the types? (@sebi)
	import { type TRegister } from '$lib/types/register/TRegister';

	//! How to make this nicer? (@sebi)
	let reg = register.register;
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

{#snippet regWindow(type, title, subreg)}
	<div>
		<h2 id={type} class="bg-surface-950-50 p-3 h2 text-surface-50-950">
			{title}
		</h2>
		{#each Object.keys(subreg) as key}
			<div class="border-t-2 border-surface-200 py-3 pl-5">
				{@render content(type, subreg[key])}
			</div>
		{/each}
	</div>
{/snippet}

<div class="grid h-screen grid-cols-[1fr_5fr] gap-10">
	<div>
		<h2 class="h2"><a href="#people">Personen</a></h2>
		<h2 class="h2"><a href="#places">Orte</a></h2>
		<h2 class="h2"><a href="#events">Events</a></h2>
		<h2 class="h2"><a href="#organisations">Organisationen</a></h2>
		<h2 class="h2"><a href="#works">Werke</a></h2>
		<h2 class="h2"><a href="#keywords">Schlagwörter</a></h2>
	</div>
	<div class="h-full overflow-scroll">
		{@render regWindow('people', 'Personen', reg.people)}
		{@render regWindow('places', 'Orte', reg.places)}
		{@render regWindow('events', 'Events', reg.events)}
		{@render regWindow('organisations', 'Organisationen', reg.organisations)}
		{@render regWindow('works', 'Werke', reg.works)}
		{@render regWindow('keywords', 'Schlagwörter', reg.keywords)}
	</div>
</div>
