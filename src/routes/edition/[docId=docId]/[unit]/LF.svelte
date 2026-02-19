<script lang="ts">
	import Comments from './Comments.svelte';
	import Register from './Register.svelte';
	import TextFluid from './TextFluid.svelte';

	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	type TVisibleTab = 'register' | 'comments';
	let visibleTab: TVisibleTab = $state('register');

	let { meta, text, annot, docId, currentPage } = $props();
</script>

<div class="h-[90vh] w-full grow overflow-hidden bg-surface-100-900">
	<div class="grid h-full grid-cols-[auto_500px] overflow-hidden">
		<TextFluid text={text[docId]?.text} {annot} />

		<!-- //! @sebi how to type visibleTab = details.value if I cannot access Skeleton's internals? -->
		<Tabs
			class="h-full overflow-hidden bg-surface-200-800"
			value={visibleTab}
			onValueChange={(details) => (visibleTab = details.value)}
		>
			<Tabs.List>
				<Tabs.Trigger value="register" class="h5">Register</Tabs.Trigger>
				<Tabs.Trigger value="comments" class="h5">Kommentare</Tabs.Trigger>
				<Tabs.Indicator />
			</Tabs.List>
			<Tabs.Content value="register" class="h-full overflow-y-auto">
				<Register {text} {meta} {docId} />
			</Tabs.Content>

			<Tabs.Content value="comments" class="h-full overflow-hidden">
				<Comments />
			</Tabs.Content>
		</Tabs>
	</div>
</div>
