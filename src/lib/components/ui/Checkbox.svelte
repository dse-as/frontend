<script lang="ts">
	import { Checkbox, Label, useId } from 'bits-ui';
	import type { Snippet } from 'svelte';

	let {
		checked = $bindable(false),
		classesLabel = '',
		labelRef = $bindable(null),
		children = undefined,
		...restProps
	}: {
		checked: boolean | undefined;
		classesLabel?: string;
		labelRef?: HTMLLabelElement | null;
		children?: Snippet;
	} = $props();

	const id = useId(); // Generate a unique ID
</script>

<div class="flex-centered gap-2">
	<Checkbox.Root {id} bind:checked {...restProps} class="flex-centered aspect-square h-6  border-2">
		{#snippet children({ checked, indeterminate })}
			{#if indeterminate}
				-
			{:else if checked}
				<i class="fa-check fa-solid"></i>
			{:else}
				<!-- <i class="fa-solid fa-xmark"></i> -->
			{/if}
		{/snippet}
	</Checkbox.Root>
	<Label.Root for={id} class={[classesLabel, 'text-nowrap select-none']}>
		{#if children}
			{@render children()}
		{/if}
	</Label.Root>
</div>
