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
	<aside class="hidden w-full xl:block">
		<div class="sticky top-5 flex h-[calc(100vh-2.5rem)] flex-col gap-4 overflow-hidden pt-6 pb-24">
			<Tabs.Root bind:value={activeRegisterTab.value}>
				<Tabs.List class="preset-tabs-list --sm">
					<Tabs.Trigger value="register" class="preset-tabs-trigger --left">Register</Tabs.Trigger>
					<Tabs.Trigger value="notes" class="preset-tabs-trigger --right"
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
