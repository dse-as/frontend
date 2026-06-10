<script lang="ts">
	import { activeRegisterTab } from '$lib/globals/ui-states.svelte';
	import Annotations from './Annotations.svelte';
	import Register from './Register.svelte';
	import TextFluid from './TextFluid.svelte';

	import { Tabs } from 'bits-ui';
	type TActiveRegisterTab = 'notes' | 'register';

	let { docId, docItem, ceteiData } = $props();
</script>

<div data-fassung="LF" class="pt-10 xl:grid xl:grid-cols-[auto_600px_auto]">
	<!-- Text -->
	<TextFluid {ceteiData} classes="mx-auto w-full max-w-300 md:max-w-[760]" />

	<!-- Sidebar -->
	<aside class="hidden w-full xl:block">
		<div class="sticky top-5 flex h-[calc(100vh-2.5rem)] flex-col gap-4 overflow-hidden pt-6">
			<Tabs.Root bind:value={activeRegisterTab.value} class="h-full">
				<Tabs.List
					class="mx-2 grid grid-cols-2 rounded-full border-[1.5px] border-surface-800-200 text-base leading-[0.01em] font-semibold"
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

				<Tabs.Content value="register" class="mx-2 mt-10 ml-6 h-full overflow-y-auto">
					<Register {docId} {docItem} />
				</Tabs.Content>

				<Tabs.Content value="notes" class="mx-2 mt-10 h-full overflow-y-auto">
					<Annotations {ceteiData} />
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</aside>
</div>
