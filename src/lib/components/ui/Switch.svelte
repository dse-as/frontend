<script lang="ts">
	import { Label, Switch, useId } from 'bits-ui';
	import type { Snippet } from 'svelte';

	let {
		checked = $bindable(),
		height = 24,
		classesLabel = '',
		onCheckedChange = () => {},
		children = undefined,
		icon = undefined
	}: {
		checked: boolean | undefined;
		height?: number;
		classesLabel?: string;
		onCheckedChange?: (checked: boolean) => void;
		children?: Snippet;
		icon?: Snippet;
	} = $props();

	const id = useId(); // Generate a unique ID
	function calculateDimensions(h: number) {
		const safeH = typeof h === 'number' && !isNaN(h) ? h : 24;
		const width = Math.round(safeH * 1.8);
		const thumbSize = Math.round(safeH * 0.8);
		const paddingTotal = 4;
		const translateX = width - thumbSize - paddingTotal;

		return {
			switchStyle: {
				height: `${safeH}px`,
				minHeight: `${safeH}px`,
				width: `${width}px`,
				'--thumb-translate': `${translateX}px`
			},
			thumbStyle: {
				width: `${thumbSize}px`,
				height: `${thumbSize}px`,
				'--thumb-translate': `${translateX}px`
			}
		};
	}

	let { switchStyle, thumbStyle } = $derived(calculateDimensions(height));
</script>

<Switch.Root
	{id}
	name="toggle groups"
	{onCheckedChange}
	bind:checked
	style={switchStyle}
	class={[
		'inline-flex shrink-0 cursor-pointer items-center rounded-full px-[2px] transition-colors',
		'focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden',
		'disabled:cursor-not-allowed disabled:opacity-50',
		'transition-transform duration-200 ease-in-out',
		'data-[state=checked]:bg-accent data-[state=unchecked]:bg-dark-10 data-[state=unchecked]:shadow-mini-inset'
	]}
>
	<Switch.Thumb
		style={thumbStyle}
		class={[
			'pointer-events-none block shrink-0 rounded-full bg-background transition-transform duration-200 ease-in-out',
			'data-[state=unchecked]:translate-x-0 data-[state=unchecked]:shadow-mini',
			'data-[state=checked]:translate-x-(--thumb-translate)'
		]}
	>
		{#if icon}
			{@render icon()}
		{/if}
	</Switch.Thumb>
</Switch.Root>

<Label.Root for={id} class={classesLabel}>
	{#if children}
		{@render children()}
	{/if}
</Label.Root>
