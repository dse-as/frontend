<script lang="ts">
	import { invertScroll } from '$lib/functions/invertScroll.svelte';
	import type { Snippet } from 'svelte';

	let {
		rerun = null,
		isBeforeEmpty,
		isAfterEmpty,
		classesCurrent = '',
		childrenBefore,
		childrenCurrent,
		childrenAfter
	}: {
		rerun: any;
		isBeforeEmpty: boolean;
		isAfterEmpty: boolean;
		classesCurrent: string;
		childrenBefore: Snippet;
		childrenCurrent: Snippet;
		childrenAfter: Snippet;
	} = $props();

	function centerCurrentItemInGallery(el: HTMLElement) {
		/* eslint-disable @typescript-eslint/no-unused-vars */
		let _foreRerun = rerun; // force rerun on change of docId

		const container = el.parentElement;
		if (!container) return;
		// Scroll the container to the specified position
		container.scroll({
			behavior: 'instant',
			left:
				el.getBoundingClientRect().left -
				container.getBoundingClientRect().left +
				container.scrollLeft -
				container.clientWidth / 2 +
				el.clientWidth / 2
		});
	}

	export function nonPassiveWheel(node: HTMLElement, handler: (ev: WheelEvent) => void) {
		// Attach with passive: false to allow preventDefault()
		node.addEventListener('wheel', handler, { passive: false });

		// Return cleanup function for when the component unmounts or element updates
		return {
			update(newHandler: (ev: WheelEvent) => void) {
				// If handler changes, remove old and add new
				node.removeEventListener('wheel', handler);
				node.addEventListener('wheel', newHandler, { passive: false });
				handler = newHandler;
			},
			destroy() {
				node.removeEventListener('wheel', handler);
			}
		};
	}
</script>

{#snippet ListContent()}
	<!-- Documents before -->
	<div
		class={[
			'disableScrollChaining flex min-w-[calc(50%-70px)] shrink-0 justify-end gap-2 rounded-thumbbox',
			isBeforeEmpty ? 'bg-transparent' : 'bg-dark-04'
		]}
	>
		{@render childrenBefore()}
	</div>
	<!-- Current Document -->
	<div
		class={['flex grow justify-center rounded-thumbbox bg-transparent', classesCurrent]}
		{@attach centerCurrentItemInGallery}
	>
		{@render childrenCurrent()}
	</div>
	<!-- Documents after -->
	<div
		class={[
			'flex min-w-[calc(50%-70px)] shrink-0 justify-start gap-2 rounded-thumbbox',
			isAfterEmpty ? 'bg-transparent' : 'bg-dark-04'
		]}
	>
		{@render childrenAfter()}
	</div>
{/snippet}

<!-- Div-Variant -->
<div
	class="flex h-full overflow-x-auto overflow-y-hidden pb-6"
	onwheel={(ev) => {
		invertScroll(ev);
	}}
>
	{@render ListContent()}
</div>

<!-- ScrollArea-Variant (not working yet) -->
<!-- <ScrollArea.Root
	onwheel={(ev) => {
		invertScroll(ev);
	}}
>
	<ScrollArea.Viewport>
		<div class="flex h-full overflow-x-auto overflow-y-hidden pb-6">
			{@render ListContent()}
		</div>
	</ScrollArea.Viewport>
	<ScrollArea.Scrollbar
		orientation="horizontal"
		class="flex w-2.5 touch-none rounded-full border-l border-l-transparent bg-muted p-px transition-all duration-200 select-none hover:w-3 hover:bg-dark-10 data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:animate-in data-[state=visible]:fade-in-0"
	>
		<ScrollArea.Thumb class="flex-1 rounded-full bg-muted-foreground" />
	</ScrollArea.Scrollbar>
	<ScrollArea.Corner />
</ScrollArea.Root> -->
