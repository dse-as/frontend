<script lang="ts">
	import { Menubar, type WithoutChildrenOrChild } from 'bits-ui';

	type Props = WithoutChildrenOrChild<Menubar.MenuProps> & {
		triggerText: string;
		items: { label: string; value: string; onSelect?: () => void }[];
		contentProps?: WithoutChildrenOrChild<Menubar.ContentProps>;
		// other component props if needed
	};

	let { triggerText, items, contentProps, ...restProps }: Props = $props();
</script>

<Menubar.Menu {...restProps}>
	<Menubar.Trigger
		class="inline-flex h-10 cursor-default items-center justify-center rounded-[9px] px-3 focus-visible:outline-none data-highlighted:bg-muted data-[state=open]:bg-muted"
	>
		{triggerText}
	</Menubar.Trigger>
	<Menubar.Content
		class="focus-override z-50 w-full rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover focus-visible:outline-hidden"
		align="start"
		sideOffset={3}
		{...contentProps}
	>
		<Menubar.Group aria-label={triggerText}>
			{#each items as item (item)}
				<Menubar.Item
					textValue={item.label}
					onSelect={item.onSelect}
					class="flex h-10 items-center py-3 pr-1.5 pl-3 select-none focus-visible:border-none! focus-visible:outline-none! data-highlighted:bg-muted"
				>
					<a class="h-full w-full" href={item.value}>{item.label}</a>
				</Menubar.Item>
			{/each}
		</Menubar.Group>
	</Menubar.Content>
</Menubar.Menu>
