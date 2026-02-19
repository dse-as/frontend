<script lang="ts">
	import Comments from './Comments.svelte';
	import Register from './Register.svelte';
	import TextFluid from './TextFluid.svelte';

	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	type TVisibleTab = 'register' | 'comments';
	let visibleTab: TVisibleTab = $state('register');

	let { meta, text, annot, docID, currentPage } = $props();
</script>

<div class="h-[20vh] w-full bg-surface-200-800 text-surface-800-200">
	<h1 class="h1">LF</h1>
	<div class="grid h-full grid-cols-[auto_500px]">
		<TextFluid text={text[docID].text} {annot} />
		<!-- //! @sebi: How to type "visibleTab"? -->
		<Tabs
			class="h-full"
			value={visibleTab}
			onValueChange={(details) => (visibleTab = details.value)}
		>
			<Tabs.List>
				<Tabs.Trigger value="register">Register</Tabs.Trigger>
				<Tabs.Trigger value="comments">Kommentare</Tabs.Trigger>
				<Tabs.Indicator />
			</Tabs.List>
			<Tabs.Content value="register">
				<Register {text} {meta} {docID} />
			</Tabs.Content>
			<Tabs.Content value="comments">
				<Comments />
			</Tabs.Content>
		</Tabs>
	</div>
</div>
