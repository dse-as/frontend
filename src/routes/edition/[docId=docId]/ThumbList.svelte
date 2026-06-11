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

<div
	class="flex h-full overflow-x-auto overflow-y-hidden pb-6"
	onwheel={(ev) => {
		invertScroll(ev);
	}}
>
	<!-- Documents before -->
	<div
		class={[
			'disableScrollChaining flex min-w-1/2 shrink-0 justify-end gap-2 rounded-xl',
			isBeforeEmpty ? 'bg-transparent' : 'bg-surface-200'
		]}
	>
		{@render childrenBefore()}
	</div>
	<!-- Current Document -->
	<div
		class={['flex grow justify-center rounded-xl bg-transparent', classesCurrent]}
		{@attach centerCurrentItemInGallery}
	>
		{@render childrenCurrent()}
	</div>
	<!-- Documents after -->
	<div
		class={[
			'flex min-w-1/2 shrink-0 justify-start gap-2 rounded-xl',
			isAfterEmpty ? 'bg-transparent' : 'bg-surface-200'
		]}
	>
		{@render childrenAfter()}
	</div>
</div>
