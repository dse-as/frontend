<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
</script>

<Accordion multiple>
	{#each ['1', '2', '3', '4', '5'] as item (item)}
		<Accordion.Item value={item}>
			<h3>
				<Accordion.ItemTrigger>Item {item}</Accordion.ItemTrigger>
			</h3>
			<Accordion.ItemContent
				>Content for item {item}

				<Accordion multiple>
					{#each ['1', '2'] as item (item)}
						<Accordion.Item value={item}>
							<h3>
								<Accordion.ItemTrigger>Item {item}</Accordion.ItemTrigger>
							</h3>
							<Accordion.ItemContent>Content for item {item}</Accordion.ItemContent>
						</Accordion.Item>
					{/each}
				</Accordion>
			</Accordion.ItemContent>
		</Accordion.Item>
	{/each}
</Accordion>
