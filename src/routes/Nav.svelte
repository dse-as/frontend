<script lang="ts">
	import { AppBar, Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { page } from '$app/state';

	import Lightswitch from './Lightswitch.svelte';
	import { resolve } from '$app/paths';

	let openStateMenu = $state(false);

	// Menu
	const links = [
		{ name: 'SNF Projekt', path: resolve('/snf-project') },
		{ name: 'Edition', path: resolve('/edition') },
		{ name: 'Register', path: resolve('/edition/register') },
		{ name: 'Netzwerke', path: resolve('/networks') },
		{ name: 'Themen', path: resolve('/topics') },
		{ name: 'Schwarzenbach', path: resolve('/schwarzenbach') },
		{ name: 'Suche', path: resolve('/search') }
	];
</script>

<!-- Menu -->
<AppBar class="flex h-12 flex-row items-center justify-between bg-surface-500 px-2 py-0">
	<!-- Lead for Home Button -->
	<AppBar.Lead class="flex items-center">
		<a class="flex items-center py-2 font-bold" href={resolve('/')}> DSE-AS </a>
	</AppBar.Lead>

	<!-- Top Navigation Bar -->
	<AppBar.Headline class="">
		<nav class="hidden lg:block">
			<ul class="my-2 flex w-full flex-wrap items-start justify-start gap-x-8 gap-y-6">
				{#each links as link}
					<li
						class={[
							'list-nav-item inline-block h-full text-surface-950 hover:text-primary-500',
							link.path.split('/').pop() === `/${page.url.pathname.split('/').pop()}`
								? 'text-primary-800-200'
								: ''
						]}
					>
						<a href={link.path}>{@html link.name}</a>
					</li>
				{/each}
			</ul>
		</nav>
	</AppBar.Headline>

	<!-- Spacer -->
	<div class="grow"></div>

	<AppBar.Trail class="mr-4">
		<!-- Lightswitch for Large Screen -->
		<div class="hidden lg:block">
			<Lightswitch />
		</div>

		<!-- Menu for Smartphone -->
		<div class="lg:hidden">
			<Dialog open={openStateMenu} onOpenChange={(e) => (openStateMenu = e.open)}>
				<!-- Trigger aligned right on small screens -->
				<Dialog.Trigger
					class="ml-4 inline-flex h-full items-center justify-center rounded p-4 text-surface-50 hover:bg-white/10"
				>
					<i class="fa-solid fa-bars"></i>
				</Dialog.Trigger>

				<Portal>
					<Dialog.Backdrop class="fixed inset-0 z-50 bg-black/50" />
					<Dialog.Positioner class="fixed inset-0 z-50">
						<Dialog.Content
							class="relative h-full w-full overflow-auto bg-primary-400-600 p-3 text-surface-50"
						>
							<!-- Top bar with title and close in top-right -->
							<div class="flex h-12 items-center justify-between">
								<Dialog.Title class="text-lg font-semibold">Menu</Dialog.Title>

								<div class="flex h-full">
									<Lightswitch />
									<!-- Close button top-right -->
									<Dialog.CloseTrigger
										class="ml-4 inline-flex h-full items-center justify-center rounded p-2 text-surface-50 hover:bg-white/10"
										aria-label="Close menu"
									>
										<i class="fa-solid fa-x"></i>
									</Dialog.CloseTrigger>
								</div>
							</div>

							<!-- Nav content full height -->
							<nav class="mt-6">
								<ul class="flex flex-col gap-1">
									{#each links as link}
										<li class="m-2!">
											<a
												href={resolve(link.path)}
												onclick={() => {
													openStateMenu = false; // close Menu
												}}
												class="block px-2 py-1 text-lg"
											>
												{@html link.name}
											</a>
										</li>
									{/each}
								</ul>
							</nav>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog>
		</div>
	</AppBar.Trail>
</AppBar>
