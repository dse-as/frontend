<script lang="ts">
	import { Menubar } from 'bits-ui';
	import CustomMenubar from '$lib/components/ui/CustomMenubar.svelte';
	import { NavigationMenu, Dialog } from 'bits-ui';
	import { page } from '$app/state';

	import Lightswitch from './Lightswitch.svelte';
	import { resolve } from '$app/paths';

	let openStateMenu = $state(false);

	// Menu
	const links = [
		{ name: 'Texte und Fotografien', path: resolve('/') },
		{ name: 'Zugänge', path: resolve('/') },
		{ name: 'Register', path: resolve('/register') },
		{ name: 'Über die Autorin', path: resolve('/schwarzenbach') },
		{ name: 'Über das Projekt', path: resolve('/project') },
		{ name: 'Suche', path: resolve('/search') }
	];
	// Menu
	const docs = [
		{ label: 'letters', value: resolve('/letters') },
		{ label: 'smallforms', value: resolve('/smallforms') },
		{ label: 'longforms', value: resolve('/longforms') },
		{ label: 'photos', value: resolve('/photos') }
	];
	const zugaenge = [
		{ label: 'Karte', value: resolve('/map') },
		{ label: 'Zeitstrahl', value: resolve('/timeline') },
		{ label: 'Netzwerk', value: resolve('/network') },
		{ label: 'Themen', value: resolve('/topics') }
	];
	const menubarMenus = [
		{ title: 'Texte und Fotografien', items: docs },
		{ title: 'Zugänge', items: zugaenge },
		{ title: 'Register', value: resolve('/register') },
		{ title: 'Über die Autorin', value: resolve('/schwarzenbach') },
		{ title: 'Über das Projekt', value: resolve('/project') },
		{ title: 'Suche', value: resolve('/search') }
	];
</script>

<!-- Menu -->
<NavigationMenu.Root
	class="rounded-10px bg-background-alt hidden h-12 items-center gap-1 border border-dark-10 px-[3px] shadow-mini lg:flex"
>
	<!-- Lead for Home Button -->
	<div class="flex items-center">
		<a class="flex items-center py-2 font-bold whitespace-nowrap" href={resolve('/')}>DSE-AS</a>
	</div>

	<!-- Top Navigation Bar -->
	<Menubar.Root
		class="rounded-10px bg-background-alt flex h-12 items-center gap-1 border border-dark-10 px-[3px] shadow-mini"
	>
		{@const menubarItemsWithDropdown = menubarMenus.filter((menu) => 'items' in menu)}
		{@const menubarItemsWithoutDropdown = menubarMenus.filter((menu) => 'value' in menu)}
		{#each menubarItemsWithDropdown as { title, items }}
			<CustomMenubar triggerText={title} {items} />
		{/each}
		{#each menubarItemsWithoutDropdown as item (item.title)}
			<li
				class={[
					'list-nav-item inline-block h-full hover:text-accent',
					item.value!.split('/').pop() === `/${page.url.pathname.split('/').pop()}`
						? 'text-accent-foreground'
						: ''
				]}
			>
				<a href={item.value}>{@html item.title}</a>
			</li>
		{/each}
	</Menubar.Root>
	<!-- <div class="">
		<nav class="hidden lg:block">
			<ul class="my-2 flex w-full flex-wrap items-start justify-start gap-x-8 gap-y-6">
				{#each links as link (link)}
					<li
						class={[
							'list-nav-item inline-block h-full hover:text-accent',
							link.path.split('/').pop() === `/${page.url.pathname.split('/').pop()}`
								? 'text-accent-foreground'
								: ''
						]}
					>
						<a href={link.path}>{@html link.name}</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div> -->

	<!-- Spacer -->
	<div class="grow"></div>

	<div class="mr-4">
		<!-- Lightswitch for Large Screen -->
		<div class="hidden lg:block">
			<Lightswitch />
		</div>

		<!-- Menu for Smartphone -->
		<div class="lg:hidden">
			<Dialog.Root bind:open={openStateMenu}>
				<!-- Trigger aligned right on small screens -->
				<Dialog.Trigger
					class="inline-flex h-full items-center justify-center rounded p-4 text-foreground-contrast hover:bg-foreground-hover"
				>
					<i class="fa-solid fa-bars"></i>
				</Dialog.Trigger>

				<Dialog.Portal>
					<Dialog.Overlay
						class="fixed inset-0 z-500000000 bg-black/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
					/>
					<Dialog.Content
						class="fixed top-[50%] left-[50%] z-500000000 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-card border bg-background p-5 shadow-popover outline-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-[490px] md:w-full"
					>
						<!-- Top bar with title and close in top-right -->
						<div class="flex min-h-12 items-center justify-between">
							<Dialog.Title class="text-xl font-semibold">Menu</Dialog.Title>

							<div class="flex h-full items-center gap-4">
								<Lightswitch />
								<!-- Close button top-right -->
								<Dialog.Close class="preset-btn-round --ghost --square" aria-label="Close menu">
									<i class="fa-solid fa-x"></i>
								</Dialog.Close>
							</div>
						</div>

						<!-- Nav content full height -->
						<nav class="mt-6">
							<ul class="flex flex-col gap-1">
								{#each links as link (link)}
									<li class="m-2!">
										<a
											href={link.path}
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
				</Dialog.Portal>
			</Dialog.Root>
		</div>
	</div>
</NavigationMenu.Root>
