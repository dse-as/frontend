<script lang="ts">
	import type { Snippet } from 'svelte';

	let { type, explanation }: { type: 'sensitive' | 'authorship'; explanation: Snippet } = $props();

	let colorType: string | undefined = undefined;
	let iconType: string | undefined = undefined;
	if (type === 'sensitive' || type === 'authorship') {
		colorType = 'warning';
		iconType = 'warning';
	} else {
		colorType = 'neutral';
		iconType = 'warning';
	}

	let expanded = $state(false);

	const labelText =
		type === 'sensitive'
			? 'Sensibler Inhalt'
			: type === 'authorship'
				? 'Autor:innenschaft unklar'
				: '---';
</script>

{#if !expanded}
	<button
		class={[
			'flex w-max cursor-pointer items-center justify-center overflow-hidden rounded-full hover:scale-[1.02] focus:ring-2 active:ring-2',
			colorType === 'warning' && 'border border-cn-warning bg-cn-warning text-cn-warning-contrast'
		]}
		onclick={() => {
			expanded = !expanded;
		}}
	>
		{#if colorType === 'warning'}
			<div
				class="flex items-center justify-center self-stretch rounded-l-full bg-white/60 pr-1 pl-2"
			>
				{#if iconType === 'warning'}
					<i class="fa-solid fa-triangle-exclamation aspect-square h-1/2"></i>
				{/if}
			</div>
		{/if}
		<span class="px-4 py-1 text-sm whitespace-nowrap select-none">
			{labelText}
		</span>
	</button>
{:else}
	<button
		class={[
			'flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl focus:ring-2 active:ring-2',
			colorType === 'warning' && 'border border-cn-warning'
		]}
		onclick={() => {
			expanded = !expanded;
		}}
	>
		<div class="w-full bg-cn-warning px-2 py-1 text-cn-warning-contrast">
			{#if iconType === 'warning'}
				<i class="fa-solid fa-triangle-exclamation aspect-square h-1/2"></i>
			{/if}
			<span>{labelText}</span>
		</div>
		<div class="overflow-h-scroll max-h-60 min-h-40 w-full p-5 text-left text-cn-warning-contrast">
			{@render explanation()}
		</div>
	</button>
{/if}
