<script lang="ts">
	import { activeRegisterTab } from '$lib/globals/state/ui.svelte';
	import Annotations from './Annotations.svelte';
	import Register from './Register.svelte';
	import TextFluid from './TextFluid.svelte';

	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	type TActiveRegisterTab = 'notes' | 'register';

	let { docId, docMeta, ceteiData } = $props();
</script>

<div
	data-fassung="LF"
	class="grid h-full grid-cols-1 gap-25 overflow-hidden md:grid-cols-[auto_600px]"
>
	<TextFluid {ceteiData} />

	<Tabs
		class="mx-auto h-full w-full overflow-hidden pl-5 "
		value={activeRegisterTab.value}
		onValueChange={(details) => (activeRegisterTab.value = details.value as TActiveRegisterTab)}
	>
		<Tabs.List>
			<Tabs.Trigger value="register" class="h5 hover:bg-transparent">Register</Tabs.Trigger>
			<Tabs.Trigger value="notes" class="h5 hover:bg-transparent ">Stellenkommentare</Tabs.Trigger>
			<Tabs.Indicator />
		</Tabs.List>
		<Tabs.Content value="register" class="h-full overflow-y-auto">
			<Register {docId} {docMeta} />
		</Tabs.Content>

		<Tabs.Content value="notes" class="h-full overflow-hidden">
			<Annotations {ceteiData} />
		</Tabs.Content>
	</Tabs>
</div>
