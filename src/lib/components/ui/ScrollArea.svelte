<script lang="ts">
	import { ScrollArea, type WithoutChild } from 'bits-ui';

	type Props = WithoutChild<ScrollArea.RootProps> & {
		orientation: 'vertical' | 'horizontal' | 'both';
		viewportClasses?: string;
	};

	let {
		ref = $bindable(null),
		orientation = 'vertical',
		viewportClasses,
		children,
		...restProps
	}: Props = $props();
</script>

{#snippet Scrollbar({ orientation }: { orientation: 'vertical' | 'horizontal' })}
	<ScrollArea.Scrollbar
		{orientation}
		class="hover:bg-dark-10 data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:animate-in data-[state=visible]:fade-in-0 bg-muted flex w-2.5 touch-none rounded-full border-l border-l-transparent p-px transition-all duration-200 select-none hover:w-3"
	>
		<ScrollArea.Thumb class="bg-muted-foreground flex-1 rounded-full" />
	</ScrollArea.Scrollbar>
{/snippet}

<ScrollArea.Root bind:ref {...restProps}>
	<ScrollArea.Viewport class={viewportClasses}>
		{@render children?.()}
	</ScrollArea.Viewport>
	{#if orientation === 'vertical' || orientation === 'both'}
		{@render Scrollbar({ orientation: 'vertical' })}
	{/if}
	{#if orientation === 'horizontal' || orientation === 'both'}
		{@render Scrollbar({ orientation: 'horizontal' })}
	{/if}
	<ScrollArea.Corner />
</ScrollArea.Root>
