<script lang="ts">
	import { activeRegisterTab } from '$lib/globals/ui-states.svelte';
	import Annotations from './Annotations.svelte';
	import Register from './Register.svelte';
	import TextFluid from './TextFluid.svelte';

	import { Tabs } from 'bits-ui';

	let { docId, docItem, ceteiData } = $props();
</script>

<div data-fassung="LF" class="pt-10 xl:grid xl:grid-cols-[auto_600px_auto]">
	<!-- Text -->
	<TextFluid {ceteiData} classes="mx-auto w-full max-w-300 md:max-w-[760]" />

	<!-- Sidebar -->
	<aside class="sticky top-0 hidden h-screen w-full flex-col gap-4 overflow-hidden pt-6 xl:flex">
		<Tabs.Root bind:value={activeRegisterTab.value} class="flex h-full flex-col">
			<Tabs.List class="preset-tabs-list --sm shrink-0">
				<Tabs.Trigger value="notes" class="preset-tabs-trigger --left"
					>Stellenkommentare</Tabs.Trigger
				>
				<Tabs.Trigger value="register" class="preset-tabs-trigger --right">Register</Tabs.Trigger>
			</Tabs.List>

			<div class="relative min-h-0 flex-1">
				<Tabs.Content value="notes" class="absolute inset-0 overflow-y-auto p-4">
					<Annotations {ceteiData} />
				</Tabs.Content>

				<Tabs.Content value="register" class="absolute inset-0 ml-6 overflow-y-auto p-6">
					<Register {docId} {docItem} />
				</Tabs.Content>
			</div>
		</Tabs.Root>
	</aside>
</div>
