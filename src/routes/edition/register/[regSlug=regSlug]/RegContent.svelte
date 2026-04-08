<script lang="ts">
	import { register as reg } from '$lib/data/register.json';
	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import { lookupDocInfo } from '$lib/functions/lookupDocInfo';

	let { metadata, regType, regItem } = $props();
</script>

<div class="w-full p-20 pt-10">
	<!-- People -->
	{#if regType === 'people'}
		<h1 id={regItem.key} class="h1">{regItem.name ? `${regItem.name}` : '...'}</h1>
		<p>{regItem.type}</p>

		<div class="mt-2">
			{#if regItem.nameVariants.length}
				<p>
					<strong>Alternative Namen: </strong>
					<span class="italic">{regItem.nameVariants.join(', ')}</span>
				</p>
			{/if}

			{#if regItem.orgId}
				<p>
					<strong>Affiliationen:</strong>
					<a href={`#${regItem.orgId}`}>
						{`${reg.orgs[regItem.orgId]?.name}`}
					</a>
				</p>
			{/if}
		</div>

		<p class="mt-2">
			{#if regItem.note}{regItem.note}{/if}
			{#if regItem.gndNumber}
				(<a class="text-primary-500 underline" href={`https://d-nb.info/gnd/${regItem.gndNumber}`}
					>GND</a
				>)
			{/if}
		</p>

		<!-- Places / Organisations / Keywords -->
	{:else if regType === 'places' || regType === 'orgs' || regType === 'keywords'}
		<h1 id={regItem.key} class="h1">{regItem.name}</h1>
		<div class="p-10">
			{#each Object.keys(regItem) as key}<p><strong>{key}:</strong> {regItem[key]}</p>{/each}
		</div>
		{#if regItem.gndNumber}<a
				class="text-primary-500 underline"
				href={`https://d-nb.info/gnd/${regItem.gndNumber}`}>See in GND</a
			>
		{/if}

		<!-- Events -->
	{:else if regType === 'events'}
		<h1 id={regItem.key} class="h1">{regItem.name}</h1>
		{#if regItem.date}
			<p>{regItem.date.from} bis {regItem.date.to}</p>
		{/if}

		<!-- Works -->
	{:else if regType === 'works'}
		<h1 id={regItem.key} class="h1">{regItem.name}</h1>
		{@const author = reg.people?.[regItem.authorId]}
		<p>
			{#if author?.firstname}
				<a href={`#${regItem.authorId}`}>By {author.firstname} {author.lastname}</a>
			{:else}
				<a href={`#${regItem.authorId}`}>By {author.firstname} {author.lastname}</a>
			{/if}
			{#if regItem.pubDate}
				<span>({regItem.pubDate})</span>
			{/if}
		</p>

		{#if regItem.gndNumber}<a
				class="text-primary-500 underline"
				href={`https://d-nb.info/gnd/${regItem.gndNumber}`}>See in GND</a
			>
		{/if}
	{/if}

	<!-- Linked documents -->
	<div class="flex w-full flex-wrap gap-5 rounded-xl border-2 p-10">
		<p>{regType} - {regItem.key} - {Object.keys(reg[regType][regItem.key])}</p>
		{#each reg[regType][regItem.key]?.docs as docId}
			{@const regItemInfo = lookupDocInfo(docId, metadata)}
			<a
				href={`/edition/${docId}`}
				class="w-70 rounded-xl bg-surface-50-950 p-1 hover:bg-surface-200-800"
				target="blank"
				rel="noopener noreferrer"
			>
				<div class="grid h-full w-full grid-cols-[1fr_3fr] gap-3 px-3 py-1">
					<div class="flex h-full w-full items-center justify-center">
						<IIIF_Thumb url={regItemInfo.fac} maxWidth="80" maxHeight="80" classes="rounded-xl" />
					</div>
					<div class="flex flex-col">
						<span class="italic">{regItemInfo.details.title}</span>
						<span class="">{regItemInfo.details.datestring}</span>
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
