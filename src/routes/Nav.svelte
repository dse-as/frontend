<script lang="ts">
	import { base } from '$app/paths';
	import { AppBar, Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { page } from '$app/state';

	import Lightswitch from './Lightswitch.svelte';

	let openStateMenu = $state(false);

	// Menu
	const links = [
		{ name: 'SNF Projekt', path: '', slug: '/snf-project' },
		{ name: 'Edition', path: '', slug: '/edition' },
		{ name: 'Register', path: '', slug: '/edition/register' },
		{ name: 'Netzwerke', path: '', slug: '/networks' },
		{ name: 'Themen', path: '', slug: '/topics' },
		{ name: 'Schwarzenbach', path: '', slug: '/schwarzenbach' },
		{ name: 'Suche', path: '', slug: '/search' }
	];
</script>

<!-- Menu -->
<AppBar class="flex h-12 flex-row items-center justify-between bg-primary-400-600 px-2 py-0">
	<!-- Lead for Home Button -->
	<AppBar.Lead class="flex items-center">
		<a class="flex items-center py-2" href={`${base}/`}> <p>DSE-AS</p> </a>
	</AppBar.Lead>

	<!-- Top Navigation Bar -->
	<AppBar.Headline class="">
		<nav class="hidden lg:block">
			<ul
				class="my-2 flex w-full flex-wrap items-start justify-start gap-x-8 gap-y-6 text-surface-50"
			>
				{#each links as link}
					<li
						class={[
							'list-nav-item inline-block h-full hover:text-primary-300-700',
							link.slug === `/${page.url.pathname.split('/').pop()}` ? 'text-primary-800-200' : ''
						]}
					>
						<a href="{base}{link.path}{link.slug}">{@html link.name}</a>
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
												href={`${base}${link.path}${link.slug}`}
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
