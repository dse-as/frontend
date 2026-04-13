<script lang="ts">
	import Annotations from './Annotations.svelte';
	import Register from './Register.svelte';
	import TextFluid from './TextFluid.svelte';

	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	type TVisibleTab = 'register' | 'comments';
	let visibleTab: TVisibleTab = $state('register');

	let { docId, docMeta, ceteiData } = $props();
</script>

<div
	data-fassung="LF"
	class="grid h-full grid-cols-1 gap-25 overflow-hidden md:grid-cols-[auto_600px]"
>
	<TextFluid {ceteiData} />

	<Tabs
		class="mx-auto h-full w-full overflow-hidden pl-5"
		value={visibleTab}
		onValueChange={(details) => (visibleTab = details.value as TVisibleTab)}
	>
		<Tabs.List>
			<Tabs.Trigger value="register" class="h5">Register</Tabs.Trigger>
			<Tabs.Trigger value="comments" class="h5 ">Stellenkommentare</Tabs.Trigger>
			<Tabs.Indicator />
		</Tabs.List>
		<Tabs.Content value="register" class="h-full overflow-y-auto">
			<Register {docId} {docMeta} />
		</Tabs.Content>

		<Tabs.Content value="comments" class="h-full overflow-hidden">
			<Annotations {ceteiData} />
		</Tabs.Content>
	</Tabs>
</div>
