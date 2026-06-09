<script lang="ts">
	import { activeRegisterTab } from '$lib/globals/ui-states.svelte';
	import Annotations from './Annotations.svelte';
	import Register from './Register.svelte';
	import TextFluid from './TextFluid.svelte';

	import { Tabs } from 'bits-ui';
	type TActiveRegisterTab = 'notes' | 'register';

	let { docId, docItem, ceteiData } = $props();
</script>

<div data-fassung="LF" class="grid grid-cols-1 gap-25 overflow-hidden md:grid-cols-[auto_600px]">
	<TextFluid {ceteiData} />

	<Tabs.Root bind:value={activeRegisterTab.value}>
		<Tabs.List
			class="grid grid-cols-2 rounded-full border-[1.5px] border-surface-800-200 text-base leading-[0.01em] font-semibold"
		>
			<Tabs.Trigger
				value="register"
				class="h-9 rounded-l-full bg-transparent py-2 data-[state=active]:bg-tabs-active data-[state=active]:text-tabs-active-foreground"
				>Register</Tabs.Trigger
			>
			<Tabs.Trigger
				value="notes"
				class="h-9 rounded-r-full bg-transparent py-2 data-[state=active]:bg-tabs-active data-[state=active]:text-tabs-active-foreground"
				>Stellenkommentare</Tabs.Trigger
			>
		</Tabs.List>

		<Tabs.Content value="register" class="h-full overflow-y-auto">
			<Register {docId} {docItem} />
		</Tabs.Content>

		<Tabs.Content value="notes" class="mt-5 h-full overflow-y-auto">
			<Annotations {ceteiData} />
		</Tabs.Content>
	</Tabs.Root>
</div>
