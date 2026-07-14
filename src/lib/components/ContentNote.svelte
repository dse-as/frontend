<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';
	import { tick } from 'svelte';

	let {
		type = undefined,
		Title = undefined,
		Comment = undefined
	}: {
		type?: string | undefined;
		Title?: Snippet | undefined;
		Comment?: Snippet | undefined;
	} = $props();

	let self: HTMLButtonElement | undefined = $state();
	let expanded = $state(false);

	const colorType = $derived(
		type === 'sensitive' ? 'warning' : type === 'authorship' ? 'unclear' : 'neutral'
	);

	const defaultTitle = $derived(
		type === 'sensitive'
			? 'Sensibler Inhalt'
			: type === 'authorship'
				? 'Autor:innenschaft unklar'
				: '---'
	);

	const defaultComment = $derived(
		type === 'sensitive'
			? `Dieser Inhalt wurde als sensibel klassifiziert. \nVgl. die <a class="hyperlink" href="${resolve('/project/docs/nicht-edieren-von-diskriminierung')}" target="blank" rel="noopener noreferrer"><em>Richtlinien &laquo;(Nicht-)edieren diskriminierender Inhalte&raquo;</em></a>.`
			: type === 'authorship'
				? 'Die Autor:innenschaft dieses Dokuments ist unsicher.'
				: '---'
	);

	function handleEscape(ev: KeyboardEvent) {
		if (expanded) {
			console.log(self);
			console.log(document.activeElement);
		}
		if (ev.key === 'Escape' && expanded && self === document.activeElement) {
			expanded = false;
		}
	}
</script>

<svelte:document onkeydown={handleEscape} />

<!-- Icon -->
{#snippet Icon()}
	{#if type === 'sensitive'}
		<i class="fa-solid fa-triangle-exclamation aspect-square h-1/2"></i>
	{:else if type === 'authorship'}
		<i class="fa-solid fa-circle-question aspect-square h-1/2"></i>
	{:else}
		<i class="fa-solid fa-triangle-exclamation aspect-square h-1/2"></i>
	{/if}
{/snippet}

<!-- Note -->
{#if !expanded}
	<!-- Note (collapsed as pill) -->
	<button
		tabindex="0"
		class={[
			colorType === 'warning' &&
				'[--cncolor-border:var(--color-cn-warning-border)] [--cncolor-iconhead:var(--color-cn-warning-iconhead)] [--cncolor:var(--color-cn-warning)]',
			colorType === 'unclear' &&
				'[--cncolor-border:var(--color-cn-unclear-border)] [--cncolor-iconhead:var(--color-cn-unclear-iconhead)] [--cncolor:var(--color-cn-unclear)]',
			colorType === 'neutral' &&
				'[--cncolor-border:var(--color-cn-neutral-border)] [--cncolor-iconhead:var(--color-cn-neutral-iconhead)] [--cncolor:var(--color-cn-neutral)]',
			'flex w-max items-center justify-center overflow-hidden rounded-full border border-[var(--cncolor-border)] bg-[var(--cncolor)] text-cn-contrast hover:scale-[1.02] focus:ring-2 active:ring-2'
		]}
		onclick={() => {
			expanded = !expanded;
			tick().then(() => {
				self?.focus();
			});
		}}
	>
		<!-- Icon -->
		<div
			class="flex items-center justify-center self-stretch rounded-l-full border-r border-[var(--cncolor-border)] bg-[var(--cncolor-iconhead)] pr-1 pl-2 text-cn-iconhead-contrast dark:text-[var(--cncolor)]"
		>
			{@render Icon()}
		</div>
		<!-- Title -->
		<span class="px-4 py-1 text-sm whitespace-nowrap select-none">
			{#if Title}
				<span>{@render Title()}</span>
			{:else}
				<span>{defaultTitle}</span>
			{/if}
		</span>
	</button>
{:else}
	<!-- Note (expanded with Comment) -->
	<div
		class={[
			colorType === 'warning' &&
				'[--cncolor-border:var(--color-cn-warning-border)] [--cncolor-iconhead:var(--color-cn-warning-iconhead)] [--cncolor:var(--color-cn-warning)]',
			colorType === 'unclear' &&
				'[--cncolor-border:var(--color-cn-unclear-border)] [--cncolor-iconhead:var(--color-cn-unclear-iconhead)] [--cncolor:var(--color-cn-unclear)]',
			colorType === 'neutral' &&
				'[--cncolor-border:var(--color-cn-neutral-border)] [--cncolor-iconhead:var(--color-cn-neutral-iconhead)] [--cncolor:var(--color-cn-neutral)]',
			'flex w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-[var(--cncolor-border)] focus:ring-2 active:ring-2'
		]}
	>
		<!-- Head with Icon, Title and Close button-->
		<div
			class="relative w-full border-b border-[var(--cncolor-border)] bg-[var(--cncolor)] px-2 py-1 text-cn-contrast"
		>
			{@render Icon()}
			{#if Title}
				<span>{@render Title()}</span>
			{:else}
				<span>{@html defaultTitle}</span>
			{/if}
			<button
				bind:this={self}
				tabindex="0"
				class="absolute top-0 right-2 flex aspect-square h-full items-center justify-center rounded-full"
				aria-label="Content Note schliessen"
				onclick={() => {
					expanded = !expanded;
				}}
			>
				<i class="fa-solid fa-xmark"></i>
			</button>
		</div>
		<!-- Body with Comment Snippet -->
		<div class="overflow-h-scroll max-h-60 min-h-max w-full p-5 text-left text-background-contrast">
			<p>{@html defaultComment}</p>
			{#if Comment}
				<h6 class="h6 mt-5 mb-2">Weitere Erläuterungen</h6>
				<p>{@render Comment()}</p>
			{/if}
		</div>
	</div>
{/if}
