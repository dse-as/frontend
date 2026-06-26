<script lang="ts">
	import { dict_docs as dictDoc } from '$lib/dictionaries/dict_docs.json';
	import { NavigationMenu, Dialog } from 'bits-ui';
	import Lightswitch from './Lightswitch.svelte';
	import { resolve } from '$app/paths';
	import type { TDocKeys, TDocTypes } from '$lib/types/documents/TDocuments';
	import { onMount } from 'svelte';

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

	const menubarMenusWithoutDropdown = [
		{ longName: 'Register', shortName: 'Register', url: resolve('/register') },
		{ longName: 'Über Schwarzenbach', shortName: 'Schwarzenbach', url: resolve('/schwarzenbach') },
		{ longName: 'Über das Projekt', shortName: 'Projekt', url: resolve('/project') }
	];

	// UI
	let activeDocType: { singular: string; plural: TDocTypes } = $state({
		singular: 'letter',
		plural: 'letters'
	});
	const randomPreviews = {
		letters: [
			{
				altText: 'Sample Letter Thumbnail 1',
				docKey: 'letter_0001',
				url: 'https://patrinum.ch/nanna/api/multimedia/image/v2/recid%3A587676-BCUL-PREVIEW-426354_0002.jpg/full/300,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: Math.floor(Math.random() * 15)
			},
			{
				altText: 'Sample Letter Thumbnail 2',
				docKey: 'letter_0004',
				url: 'https://patrinum.ch/nanna/api/multimedia/image/v2/recid%3A587679-BCUL-PREVIEW-426357_0003.jpg/full/300,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: -Math.floor(Math.random() * 15)
			},
			{
				altText: 'Sample Letter Thumbnail 3',
				docKey: 'letter_0012',
				url: 'https://patrinum.ch/nanna/api/multimedia/image/v2/recid%3A587687-BCUL-PREVIEW-426365_0001.jpg/full/300,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: Math.floor(Math.random() * 15)
			}
		],
		smallforms: [
			{
				altText: 'Sample Smallform Thumbnail 1',
				docKey: 'smallform_0231',
				url: 'https://iiif.ub.unibe.ch/image/v3.0/a21e9b64-0740-4576-94d3-61595cda3e80/full/300,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: Math.floor(Math.random() * 15)
			},
			{
				altText: 'Sample Smallform Thumbnail 2',
				docKey: 'smallform_0270',
				url: 'https://iiif.library.ethz.ch/iiif/2/e-periodica%21zui%211938_014%21zui-001_1938_014_0261.jpg/full/300,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: -Math.floor(Math.random() * 15)
			},
			{
				altText: 'Sample Smallform Thumbnail 3',
				docKey: 'smallform_0276',
				url: 'https://iiif.ub.unibe.ch/image/v3.0/07fbd801-4b9f-4e7c-ab04-a7ec240e4b5e/full/300,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: Math.floor(Math.random() * 15)
			}
		],
		longforms: [
			{
				altText: 'Sample Longforms Thumbnail 1',
				docKey: 'longform_0001',
				url: 'https://iiif.ub.unibe.ch/image/v3.0/f7a771e2-036b-4ee8-b2d8-08d8bbf8c9ad/full/300,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: Math.floor(Math.random() * 15)
			},
			{
				altText: 'Sample Longforms Thumbnail 2',
				docKey: 'longform_0003',
				url: 'https://iiif.ub.unibe.ch/image/v3.0/ed670c9a-b769-4b34-896d-1c5dd97e4c7e/full/300,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: -Math.floor(Math.random() * 15)
			},
			{
				altText: 'Sample Longforms Thumbnail 3',
				docKey: 'longform_0008',
				url: 'https://iiif.ub.unibe.ch/image/v3.0/012daa33-5ac4-4460-9c2d-ec8291502499/full/300,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: Math.floor(Math.random() * 15)
			}
		],
		photos: [
			{
				altText: 'Sample Photos Thumbnail 1',
				docKey: 'photo_0097',
				url: 'https://www.e-manuscripta.ch/i3f/v21/2002037/full/300,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: Math.floor(Math.random() * 15)
			},
			{
				altText: 'Sample Photos Thumbnail 2',
				docKey: 'photo_1294',
				url: 'https://www.e-manuscripta.ch/i3f/v21/1985083/full/300,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: -Math.floor(Math.random() * 15)
			},
			{
				altText: 'Sample Photos Thumbnail 3',
				docKey: 'photo_4000',
				url: 'https://www.e-manuscripta.ch/i3f/v21/1990657/full/300,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: Math.floor(Math.random() * 15)
			}
		],
		map: [
			{
				altText: 'Sample Map',
				docKey: 'map',
				url: '/imgs/map-baltics.webp',
				classes: 'max-w-180 max-h-80',
				rotation: 0
			}
		],
		timeline: [
			{
				altText: 'Sample Preview',
				docKey: 'timeline',
				url: '/imgs/timeline.webp',
				classes: 'max-w-150 max-h-80',
				rotation: Math.floor(Math.random() * 15)
			}
		],
		networks: [
			{
				altText: 'Sample Preview',
				docKey: 'networks',
				url: '/imgs/networks.webp',
				classes: 'max-w-150 max-h-80',
				rotation: Math.floor(Math.random() * 15)
			}
		],
		topics: [
			{
				altText: 'Sample Preview',
				docKey: 'topics',
				url: '/imgs/topics.webp',
				classes: 'max-w-150 max-h-80',
				rotation: Math.floor(Math.random() * 15)
			}
		]
	};

	onMount(() => {
		// Preload function
		function preloadImages(urls: string[]) {
			urls.forEach((url) => {
				const img = new Image();
				img.src = url;
				// Optional: track loaded images
				img.onload = () => console.log(`Loaded: ${url}`);
				img.onerror = () => console.warn(`Failed to load: ${url}`);
			});
		}
		const allImageUrls = [
			...randomPreviews.letters.map((item) => item.url),
			...randomPreviews.smallforms.map((item) => item.url),
			...randomPreviews.longforms.map((item) => item.url),
			...randomPreviews.photos.map((item) => item.url)
		];
		preloadImages(allImageUrls);
	});
</script>

<!-- Menu -->
{#snippet ListItem({ title, content, href, singular, plural })}
	<li>
		<NavigationMenu.Link
			class={[
				'block space-y-1 rounded-md p-3 leading-none text-background-contrast no-underline outline-hidden transition-colors select-none',
				'hover:bg-muted hover:text-background-contrast',
				'focus:bg-muted focus:text-background-contrast'
			]}
			onkeydown={() => {
				activeDocType.singular = singular;
				activeDocType.plural = plural;
			}}
			onmouseenter={() => {
				activeDocType.singular = singular;
				activeDocType.plural = plural;
			}}
			{href}
		>
			<h5 class="h5 font-serif leading-none font-bold">{title}</h5>
			<p class="line-clamp-2 leading-snug text-muted-foreground">
				{content}
			</p>
		</NavigationMenu.Link>
	</li>
{/snippet}

<!-- Triggers -->
{#snippet dropdownElement1()}
	<NavigationMenu.Item value="texte-und-fotografien">
		<NavigationMenu.Trigger
			class={[
				'group inline-flex h-8 w-max items-center justify-center rounded-[7px] px-4 py-2 transition-colors',
				'hover:from-foreground-contrast-40 hover:bg-background hover:text-background-contrast',
				'focus-visible:bg-muted focus-visible:text-dark-40 focus-visible:outline-hidden',
				'data-[state=open]:bg-dark-10 data-[state=open]:shadow-mini data-[state=open]:hover:text-background'
			]}
		>
			<span class="hidden lg:inline">Texte und Fotografien</span>
			<span class="inline lg:hidden">Texte & Fotos</span>
			<i
				class="fa-solid fa-chevron-down ml-2 transition-transform duration-200 group-data-[state=open]:rotate-180"
				aria-hidden="true"
			></i>
		</NavigationMenu.Trigger>

		<NavigationMenu.Content
			class={[
				'absolute top-0 left-0 w-auto'
				// 'data-[motion=from-end]:animate-enter-from-right data-[motion=from-start]:animate-enter-from-left data-[motion=to-end]:animate-exit-to-right data-[motion=to-start]:animate-exit-to-left'
			]}
		>
			<ul
				class="m-0 grid w-full list-none grid-flow-col grid-cols-[400px_auto] grid-rows-4 gap-x-10 p-3"
			>
				{@render ListItem({
					href: '/letters',
					title: `${dictDoc.letters.label_plural}`,
					content: 'Die erhaltene Korrespondenz von Schwarzenbach',
					singular: 'letter',
					plural: 'letters'
				})}
				{@render ListItem({
					href: '/smallforms',
					title: `${dictDoc.smallforms.label_plural}`,
					content:
						'Artikel, Zeitungsartikel, Sonderbeilagen, Rezensionen und weitere Kleine Formen',
					singular: 'smallform',
					plural: 'smallforms'
				})}
				{@render ListItem({
					href: '/longforms',
					title: `${dictDoc.longforms.label_plural}`,
					content: 'Romane und Reportagebücher',
					singular: 'longform',
					plural: 'longforms'
				})}
				{@render ListItem({
					href: '/photos',
					title: `${dictDoc.photos.label_plural}`,
					content: 'Fotografisches Werk von Schwarzenbach und Maillard',
					singular: 'photo',
					plural: 'photos'
				})}

				<!-- Description Area -->
				<li class="col-2 row-span-4">
					<NavigationMenu.Link
						href="/"
						class={['flex h-full shrink-0 items-start gap-7 p-6 outline-hidden']}
					>
						<div class="flex h-full w-full flex-col items-start justify-center">
							<div class="container-centered w-full gap-2">
								{#snippet RandomPreview({
									url,
									altText,
									docKey,
									classes,
									rotation
								}: {
									url: string;
									altText: string;
									docKey: TDocKeys;
									classes: string;
									rotation: number;
								})}
									<a href={resolve(`/${docKey}`)} class={['inline-block']}>
										<img
											class={['block object-contain', classes]}
											src={url}
											alt={altText}
											style={`rotate:${rotation}deg`}
										/>
									</a>
								{/snippet}
								{#each randomPreviews[activeDocType.plural] as item}
									{@render RandomPreview({ ...item })}
								{/each}
							</div>
							<a
								href={resolve(
									`/${activeDocType.singular!}_${Math.floor(Math.random() * 1000)
										.toString()
										.padStart(4, '0')}`
								)}
								class="preset-btn-round --lg"
								>{`Zufälligen ${dictDoc.letters.label_singular} anzeigen`}</a
							>
						</div>
					</NavigationMenu.Link>
				</li>
			</ul>
		</NavigationMenu.Content>
	</NavigationMenu.Item>
{/snippet}
{#snippet dropdownElement2()}
	<NavigationMenu.Item value="zugaenge">
		<NavigationMenu.Trigger
			class={[
				'group inline-flex h-8 w-max items-center justify-center rounded-[7px] px-4 py-2 transition-colors',
				'hover:from-foreground-contrast-40 hover:bg-background hover:text-background-contrast',
				'focus-visible:bg-muted focus-visible:text-dark-40 focus-visible:outline-hidden',
				'data-[state=open]:bg-dark-10 data-[state=open]:shadow-mini data-[state=open]:hover:text-background'
			]}
		>
			<span class="hidden lg:inline">Zugänge</span>
			<span class="inline lg:hidden">Zugänge</span>
			<i
				class="fa-solid fa-chevron-down ml-2 transition-transform duration-200 group-data-[state=open]:rotate-180"
				aria-hidden="true"
			></i>
		</NavigationMenu.Trigger>
		<NavigationMenu.Content
			class={[
				'absolute top-0 left-0 w-auto'
				// 'data-[motion=from-end]:animate-enter-from-right data-[motion=from-start]:animate-enter-from-left data-[motion=to-end]:animate-exit-to-right data-[motion=to-start]:animate-exit-to-left'
			]}
		>
			<ul
				class="m-0 grid w-full list-none grid-flow-col grid-cols-[400px_auto] grid-rows-4 gap-x-10 p-3"
			>
				{@render ListItem({
					href: '/map',
					title: 'Karte',
					content: 'Reisen und Orte auf einer Karte',
					singular: 'map',
					plural: ''
				})}
				{@render ListItem({
					href: '/timeline',
					title: 'Zeitstrahl',
					content: 'Allerlei Biografisches zu Schwarzenbach im historischen Kontext',
					singular: 'timeline',
					plural: ''
				})}
				{@render ListItem({
					href: '/network',
					title: 'Netzwerk',
					content: 'Schwarzenbachs Netzwerk',
					singular: 'network',
					plural: ''
				})}
				{@render ListItem({
					href: '/topics',
					title: 'Themen',
					content: 'Thematische Zugänge zu den Texten und Fotografien Schwarzenbachs',
					singular: 'topics',
					plural: ''
				})}

				<!-- Description Area -->
				<li class="col-2 row-span-4">
					<NavigationMenu.Link
						href="/"
						class={['flex h-full shrink-0 items-start gap-7 p-6 outline-hidden']}
					>
						<div class="flex h-full w-full flex-col items-start justify-center">
							<div class="container-centered w-full gap-2">
								{#snippet RandomPreview({
									url,
									altText,
									docKey,
									classes,
									rotation
								}: {
									url: string;
									altText: string;
									docKey: TDocKeys;
									classes: string;
									rotation: number;
								})}
									<a href={resolve(`/${docKey}`)} class={['inline-block']}>
										<img
											class={['block object-contain', classes]}
											src={url}
											alt={altText}
											style={`rotate:${rotation}deg`}
										/>
									</a>
								{/snippet}
								{#each randomPreviews[activeDocType.singular] as item}
									{@render RandomPreview({ ...item })}
								{/each}
							</div>
						</div>
					</NavigationMenu.Link>
				</li>
			</ul>
		</NavigationMenu.Content>
	</NavigationMenu.Item>
{/snippet}

<NavigationMenu.Root
	class="relative z-9999999999999 flex h-max w-full justify-between gap-5 border-b-2 bg-foreground text-background"
>
	<NavigationMenu.List
		class="group flex w-screen list-none items-center justify-between gap-2 p-1 px-5"
	>
		<!-- Lead for Home Button -->
		<div class="flex items-center">
			<a class="flex items-center py-2 font-bold whitespace-nowrap" href={resolve('/')}>DSE-AS</a>
		</div>
		<!-- Texte und Fotografien -->
		{@render dropdownElement1()}
		{@render dropdownElement2()}

		{#each menubarMenusWithoutDropdown as item}
			<NavigationMenu.Item>
				<NavigationMenu.Link
					class={[
						'group inline-flex h-8 w-max items-center justify-center rounded-[7px] bg-transparent px-4 py-2 transition-colors',
						'hover:bg-background hover:text-accent-foreground',
						'focus:bg-muted focus:text-accent-foreground focus:outline-hidden',
						'disabled:pointer-events-none disabled:opacity-50',
						'data-[state=open]:bg-dark-10 data-[state=open]:shadow-mini dark:hover:bg-muted dark:data-[state=open]:bg-muted'
					]}
					href={item.url}
				>
					<span class="hidden lg:inline"> {item.longName} </span>
					<span class="inline lg:hidden"> {item.shortName} </span>
				</NavigationMenu.Link>
			</NavigationMenu.Item>
		{/each}

		<!-- Spacer -->
		<div class="block w-max grow"></div>

		<!-- Search -->
		<input
			type="text"
			placeholder="Suche..."
			class="mx-4 w-50 rounded-xl border-2 border-background px-2 focus:w-70"
		/>
		<!-- Lightswitch for Large Screen -->
		<div class=" hidden justify-self-end lg:block">
			<Lightswitch />
		</div>

		<!-- Menu for Smartphone -->
		<div class="mr-4">
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
							class="fixed top-[50%] left-[50%] z-500000000 w-screen max-w-[1490px] max-w-[calc(100vw-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-card border bg-background p-5 shadow-popover outline-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 md:w-full"
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

		<!-- Indicator -->
		<NavigationMenu.Indicator
			class="top-full z-10 flex h-2.5 items-end justify-center overflow-hidden opacity-100 transition-[all,transform_250ms_ease] duration-200 data-[state=hidden]:animate-fade-out data-[state=hidden]:opacity-0 data-[state=visible]:animate-fade-in"
		>
			<div class="relative top-[70%] size-2.5 rotate-[45deg] rounded-tl-[2px] bg-border"></div>
		</NavigationMenu.Indicator>
	</NavigationMenu.List>

	<!-- Viewport for Dropdowns -->
	<div class="absolute top-full left-0 flex w-screen justify-center perspective-[2000px]">
		<NavigationMenu.Viewport
			class="text-popover-foreground relative mx-5 mt-2.5 h-[var(--bits-navigation-menu-viewport-height)] w-screen origin-[top_center] overflow-hidden rounded-md border bg-background shadow-lg transition-[width,_height] duration-200 data-[state=closed]:animate-scale-out data-[state=open]:animate-scale-in "
		/>
	</div>
</NavigationMenu.Root>
