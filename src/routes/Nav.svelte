<script lang="ts">
	import { type Snippet } from 'svelte';
	import { dict_docs as dictDoc } from '$lib/dictionaries/dict_docs.json';
	import { NavigationMenu, Dialog } from 'bits-ui';
	import Lightswitch from './Lightswitch.svelte';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	let openStateMenu = $state(false);

	function randomValue(n: number) {
		return Math.floor(Math.random() * n);
	}

	// Menu
	const mainMenuInfo = {
		main1: {
			nameShort: 'Texte & Fotos',
			nameLong: 'Texte und Fotografien',
			idsSub: ['smallforms', 'longforms', 'letters', 'photos']
		},
		main2: {
			nameShort: 'Zugänge',
			nameLong: 'Zugänge',
			idsSub: ['map', 'timeline', 'network', 'topics']
		},
		main3: { nameShort: 'Register', nameLong: 'Register', path: resolve('/register') },
		main4: {
			nameShort: 'Schwarzenbach',
			nameLong: 'Über Schwarzenbach',
			path: resolve('/schwarzenbach')
		},
		main5: { nameShort: 'Projekt', nameLong: 'Über das Projekt', path: resolve('/project') }
	};

	const subMenuInfo = {
		smallforms: {
			name: 'Kleine Formen',
			description: 'Kleine Formen',
			content: 'Artikel, Zeitungsartikel, Sonderbeilagen, Rezensionen und weitere Kleine Formen',
			path: resolve('/smallforms')
		},
		longforms: {
			name: 'Romane und Reportagebücher',
			description: 'Romane und Reportagebücher',
			content: 'Romane und Reportagebücher',
			path: resolve('/longforms')
		},
		letters: {
			name: 'Briefe',
			description: 'Briefe',
			content: 'Die erhaltene Korrespondenz von Schwarzenbach',
			path: resolve('/correspondence')
		},
		photos: {
			name: 'Fotografien',
			description: 'Fotografien',
			content: 'Fotografisches Werk von Schwarzenbach und Maillard',
			path: resolve('/photos')
		},
		map: {
			name: 'Karte',
			description: '',
			content: 'Reisen und Orte auf einer Karte',
			path: resolve('/map')
		},
		timeline: {
			name: 'Zeitstrahl',
			description: '',
			content: 'Allerlei Biografisches zu Schwarzenbach im historischen Kontext',
			path: resolve('/timeline')
		},
		network: {
			name: 'Netzwerk',
			description: '',
			content: 'Schwarzenbachs Netzwerk',
			path: resolve('/network')
		},
		topics: {
			name: 'Themen',
			description: '',
			content: 'Thematische Zugänge zu den Texten und Fotografien Schwarzenbachs',
			path: resolve('/topics')
		}
	};

	const mainMenuWithoutSub = Object.values(mainMenuInfo).filter((item) => {
		return 'path' in item;
	});
	const mainMenuWithSub = Object.values(mainMenuInfo).filter((item) => {
		return 'idsSub' in item;
	});

	const dictNav = {
		random_element_text: {
			smallforms: 'Zufällige Smallform anzeigen',
			longforms: 'Zufällige Longform anzeigen',
			letters: 'Zufälligen Brief anzeigen',
			photos: 'Zufällige Fotografie anzeigen'
		}
	};

	// UI States
	let hoveredSubmenu: { key: keyof typeof subMenuInfo | undefined } = $state({
		key: 'letters'
	});

	let isDocType = $derived(hoveredSubmenu.key && hoveredSubmenu.key in dictDoc ? true : false);

	// Sample Documents
	const sampleDocuments = {
		smallforms: [
			{
				altText: 'Sample Smallform',
				targetURL: resolve('/smallform_0231'),
				imgURL:
					'https://iiif.ub.unibe.ch/image/v3.0/a21e9b64-0740-4576-94d3-61595cda3e80/full/200,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: randomValue(15)
			},
			{
				altText: 'Sample Smallform',
				targetURL: resolve('/smallform_0270'),
				imgURL:
					'https://iiif.library.ethz.ch/iiif/2/e-periodica%21zui%211938_014%21zui-001_1938_014_0261.jpg/full/200,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: -1 * randomValue(15)
			},
			{
				altText: 'Sample Smallform',
				targetURL: resolve('/smallform_0276'),
				imgURL:
					'https://iiif.ub.unibe.ch/image/v3.0/07fbd801-4b9f-4e7c-ab04-a7ec240e4b5e/full/200,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: randomValue(15)
			}
		],
		longforms: [
			{
				altText: 'Sample Longform',
				targetURL: resolve('/longform_0001'),
				imgURL:
					'https://iiif.ub.unibe.ch/image/v3.0/f7a771e2-036b-4ee8-b2d8-08d8bbf8c9ad/full/200,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: randomValue(15)
			},
			{
				altText: 'Sample Longform',
				targetURL: resolve('/longform_0003'),
				imgURL:
					'https://iiif.ub.unibe.ch/image/v3.0/ed670c9a-b769-4b34-896d-1c5dd97e4c7e/full/200,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: -1 * randomValue(15)
			},
			{
				altText: 'Sample Longform',
				targetURL: resolve('/longform_0008'),
				imgURL:
					'https://iiif.ub.unibe.ch/image/v3.0/012daa33-5ac4-4460-9c2d-ec8291502499/full/200,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: randomValue(15)
			}
		],
		letters: [
			{
				altText: 'Sample Letter',
				targetURL: resolve('/letter_0001'),
				imgURL:
					'https://patrinum.ch/nanna/api/multimedia/image/v2/recid%3A587676-BCUL-PREVIEW-426354_0002.jpg/full/200,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: randomValue(15)
			},
			{
				altText: 'Sample Letter',
				targetURL: resolve('/letter_0004'),
				imgURL:
					'https://patrinum.ch/nanna/api/multimedia/image/v2/recid%3A587679-BCUL-PREVIEW-426357_0003.jpg/full/200,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: -1 * randomValue(15)
			},
			{
				altText: 'Sample Letter',
				targetURL: resolve('/letter_0012'),
				imgURL:
					'https://patrinum.ch/nanna/api/multimedia/image/v2/recid%3A587687-BCUL-PREVIEW-426365_0001.jpg/full/200,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: randomValue(15)
			}
		],
		photos: [
			{
				altText: 'Sample Photo',
				targetURL: resolve('/photo_0097'),
				imgURL: 'https://www.e-manuscripta.ch/i3f/v21/2002037/full/200,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: randomValue(15)
			},
			{
				altText: 'Sample Photo',
				targetURL: resolve('/photo_1294'),
				imgURL: 'https://www.e-manuscripta.ch/i3f/v21/1985083/full/200,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: -1 * randomValue(15)
			},
			{
				altText: 'Sample Photo',
				targetURL: resolve('/photo_4000'),
				imgURL: 'https://www.e-manuscripta.ch/i3f/v21/1990657/full/200,/0/default.jpg',
				classes: 'max-w-40 max-h-40',
				rotation: randomValue(15)
			}
		],
		map: [
			{
				altText: 'Sample Map',
				targetURL: resolve('/map'),
				imgURL: '/imgs/map-baltics.webp',
				classes: 'max-w-180 max-h-80',
				rotation: 0
			}
		],
		timeline: [
			{
				altText: 'Sample Preview',
				targetURL: resolve('/timeline'),
				imgURL: '/imgs/timeline.webp',
				classes: 'max-w-150 max-h-80',
				rotation: randomValue(15)
			}
		],
		network: [
			{
				altText: 'Sample Preview',
				targetURL: resolve('/network'),
				imgURL: '/imgs/network.webp',
				classes: 'max-w-150 max-h-80',
				rotation: randomValue(15)
			}
		],
		topics: [
			{
				altText: 'Sample Preview',
				targetURL: resolve('/topics'),
				imgURL: '/imgs/topics.webp',
				classes: 'max-w-150 max-h-80',
				rotation: randomValue(15)
			}
		]
	};

	onMount(() => {
		// Preload sample images
		function preloadImages(urls: string[]) {
			urls.forEach((imgURL) => {
				const img = new Image();
				img.src = imgURL;
				// img.onload = () => console.log(`Loaded: ${imgURL}`);
				// img.onerror = () => console.warn(`Failed to load: ${imgURL}`);
			});
		}
		const allImageUrls = [
			...sampleDocuments.smallforms.map((item) => item.imgURL),
			...sampleDocuments.longforms.map((item) => item.imgURL),
			...sampleDocuments.letters.map((item) => item.imgURL),
			...sampleDocuments.photos.map((item) => item.imgURL)
		];
		preloadImages(allImageUrls);
	});
</script>

<!-- Triggers -->
{#snippet NavTrigger(info: (typeof mainMenuWithSub)[number])}
	<NavigationMenu.Trigger
		class={[
			'group inline-flex h-8 w-max items-center justify-center rounded-[7px] px-4 py-2 transition-colors',
			'hover:bg-background hover:text-background-contrast',
			'focus-visible:bg-muted focus-visible:text-dark-40 focus-visible:outline-hidden',
			'data-[state=open]:bg-dark-10 data-[state=open]:shadow-mini data-[state=open]:hover:text-background'
		]}
	>
		<span class="hidden lg:inline">{info.nameLong}</span>
		<span class="inline lg:hidden">{info.nameShort}</span>
		<i
			class="fa-solid fa-chevron-down ml-2 transition-transform duration-200 group-data-[state=open]:rotate-180"
			aria-hidden="true"
		></i>
	</NavigationMenu.Trigger>
{/snippet}

{#snippet NavSub(keys: (keyof typeof subMenuInfo)[], ContentArea: Snippet)}
	<NavigationMenu.Content class="absolute top-0 left-0 w-auto">
		<ul
			class="m-0 grid w-full list-none grid-flow-col grid-cols-[400px_auto] grid-rows-4 gap-x-10 p-3"
		>
			{#each keys as key (key)}
				<li>
					<NavigationMenu.Link
						class={[
							'block space-y-1 rounded-md p-3 leading-none text-background-contrast no-underline outline-hidden transition-colors select-none',
							'hover:bg-muted hover:text-background-contrast',
							'focus:bg-muted focus:text-background-contrast'
						]}
						onkeydown={() => {
							hoveredSubmenu.key = key;
						}}
						onmouseenter={() => {
							hoveredSubmenu.key = key;
						}}
						href={subMenuInfo[key].path}
					>
						<h5 class="h5 font-serif leading-none font-bold">{subMenuInfo[key].name}</h5>
						<p class="line-clamp-2 leading-snug text-muted-foreground">
							{subMenuInfo[key].content}
						</p>
					</NavigationMenu.Link>
				</li>
			{/each}

			<!-- Description Area -->
			<li class="col-2 row-span-4">
				<NavigationMenu.Link
					href={resolve('/')}
					class={['flex h-full shrink-0 items-start gap-7 p-6 outline-hidden']}
				>
					{@render ContentArea()}
				</NavigationMenu.Link>
			</li>
		</ul>
	</NavigationMenu.Content>
{/snippet}

<!-- General Elements -->

{#snippet SampleDocumentPreviews()}
	<div class="container-centered w-full gap-2">
		{#if hoveredSubmenu.key}
			{#each sampleDocuments[hoveredSubmenu.key] as item (item)}
				<a href={item.targetURL} class={['inline-block']}>
					<img
						class={['duration-scale-200 block object-contain hover:scale-[1.1]', item.classes]}
						src={item.imgURL}
						alt={item.altText}
						style={`rotate:${item.rotation}deg`}
					/>
				</a>
			{/each}
		{/if}
	</div>
{/snippet}

<!-- Panel 1: Texte und Fotografien -->
{#snippet ContentPanelArea1()}
	<div class="grid h-full w-full grid-cols-1 xl:grid-cols-2">
		<div class="flex h-full w-full flex-col items-start justify-start xl:justify-center">
			{@render SampleDocumentPreviews()}
			{#if isDocType}
				<a
					href={resolve(
						`/${dictDoc[hoveredSubmenu.key as keyof typeof dictDoc].key_singular}_${Math.floor(
							Math.random() * 8 //! improve heurisic
						)
							.toString()
							.padStart(4, '0')}`
					)}
					class="preset-btn-round --lg"
					>{dictNav.random_element_text[hoveredSubmenu.key as keyof typeof dictDoc]}</a
				>
			{/if}
		</div>

		<!-- Shortcuts -->
		<div class="flex h-full flex-col justify-end">
			{#if hoveredSubmenu.key === 'smallforms'}
				<h5 class="h5 mt-5 text-background-contrast">Shortcuts:</h5>
				<div class="preset-btn-list --spacing-normal">
					<a href={resolve('/smallform_0231')} class="preset-btn-round --sm"
						>Smallform 0231 (Kleine Begegnungen in Danzig)</a
					>
					<a href={resolve('/smallform_0529')} class="preset-btn-round --sm"
						>Smallform 0529 (Schweizer Pionierarbeit)</a
					>
				</div>
			{/if}
		</div>
	</div>
{/snippet}

<!-- Panel 2: Zugänge -->
{#snippet ContentPanelArea2()}
	<div class="flex h-full w-full flex-col items-start justify-center">
		{@render SampleDocumentPreviews()}
	</div>
{/snippet}

<!-- Navigation Large Screens -->
<NavigationMenu.Root
	onValueChange={() => {
		// make sure hoveredSubmenu (for previews) does not leak to foreign panels
		hoveredSubmenu.key = undefined;
	}}
	class="relative z-9999999999999 hidden h-max w-full justify-between gap-5 border-b-2 bg-foreground text-background lg:flex"
>
	<NavigationMenu.List
		class="group flex w-screen list-none items-center justify-between gap-2 p-1 px-5"
	>
		<!-- Lead for Home Button -->
		<div class="flex items-center">
			<a class="flex items-center py-2 font-bold whitespace-nowrap" href={resolve('/')}>DSE-AS</a>
		</div>

		<!-- Texte und Fotografien -->
		<NavigationMenu.Item value="texte-und-fotografien" openOnHover={false}>
			{@render NavTrigger(mainMenuInfo.main1)}
			{@render NavSub(
				mainMenuInfo.main1.idsSub as ('smallforms' | 'longforms' | 'letters' | 'photos')[],
				ContentPanelArea1
			)}
		</NavigationMenu.Item>

		<!-- Zugänge -->
		<NavigationMenu.Item value="zugaenge" openOnHover={false}>
			{@render NavTrigger(mainMenuInfo.main2)}
			{@render NavSub(
				mainMenuInfo.main2.idsSub as ('map' | 'timeline' | 'network' | 'topics')[],
				ContentPanelArea2
			)}
		</NavigationMenu.Item>

		<!-- Main Menu without Submenues -->
		{#each mainMenuWithoutSub as item (item)}
			<NavigationMenu.Item>
				<NavigationMenu.Link
					class={[
						'group inline-flex h-8 w-max items-center justify-center rounded-[7px] px-4 py-2 transition-colors',
						'hover:bg-background hover:text-background-contrast',
						'focus-visible:bg-muted focus-visible:text-dark-40 focus-visible:outline-hidden',
						'data-[state=open]:bg-dark-10 data-[state=open]:shadow-mini',
						'disabled:pointer-events-none disabled:opacity-50'
					]}
					href={item.path}
				>
					<span class="hidden lg:inline"> {item.nameLong} </span>
					<span class="inline lg:hidden"> {item.nameShort} </span>
				</NavigationMenu.Link>
			</NavigationMenu.Item>
		{/each}

		<!-- Spacer -->
		<div class="block w-max grow"></div>

		<!-- Search -->
		<input
			type="text"
			placeholder="Suche..."
			class="mx-4 w-50 rounded-xl border-2 border-background px-2 duration-200 focus:w-70"
		/>
		<!-- Shortcuts Info -->
		<NavigationMenu.Item value="info_shortcuts" openOnHover={false}>
			<NavigationMenu.Trigger
				class={[
					'group mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full px-2 py-2 transition-colors',
					'hover:bg-background hover:text-background-contrast',
					'focus-visible:bg-muted focus-visible:text-dark-40 focus-visible:outline-hidden',
					'data-[state=open]:bg-dark-10 data-[state=open]:shadow-mini data-[state=open]:hover:text-background'
				]}
			>
				<i class="fa-solid fa-info text-xl"></i>
			</NavigationMenu.Trigger>
			<NavigationMenu.Content class=" absolute top-0 left-0 w-auto text-background-contrast">
				<div class=" m-0 w-full list-none p-5">
					<h5 class="h5 mb-5">Tastaturkürzel</h5>
					<table>
						<tbody class="flex flex-col gap-2">
							<tr class="mb-5 flex flex-col lg:mb-0 lg:block">
								<td class="w-50 p-0 font-bold lg:py-2">S:</td>
								<td class="p-0 text-left lg:py-2">Sequenz-Panel öffnen.</td>
							</tr>
							<tr class="mb-5 flex flex-col lg:mb-0 lg:block">
								<td class="w-50 p-0 font-bold lg:py-2">Escape:</td>
								<td class="p-0 text-left lg:py-2">Sequenz-Panel schliessen.</td>
							</tr>
							<tr class="mb-5 flex flex-col lg:mb-0 lg:block">
								<td class="w-50 p-0 font-bold lg:py-2">Pfeiltaste Links:</td>
								<td class="p-0 text-left lg:py-2">Zum vorherigen Dokument in Sequenz.</td>
							</tr>
							<tr class="mb-5 flex flex-col lg:mb-0 lg:block">
								<td class="w-50 p-0 font-bold lg:py-2">Pfeiltaste Rechts:</td>
								<td class="p-0 text-left lg:py-2">Zum nächsten Dokument in Sequenz.</td>
							</tr>
						</tbody>
					</table>
				</div>
			</NavigationMenu.Content>
		</NavigationMenu.Item>

		<!-- Lightswitch for Large Screen -->
		<div class="hidden justify-self-end lg:block">
			<Lightswitch />
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

<!-- Smartphone Menu -->
<div
	class="relative z-9999999999999 flex h-max w-full justify-between gap-5 border-b-2 bg-foreground text-background"
>
	<div class="group flex w-screen list-none items-center justify-end gap-2 p-1 px-5 lg:hidden">
		<div class="mr-4">
			<Dialog.Root bind:open={openStateMenu}>
				<!-- Trigger aligned right on small screens -->
				<Dialog.Trigger
					class="inline-flex h-full items-center justify-center rounded p-4 text-foreground-contrast hover:bg-foreground-hover"
				>
					<!-- Hamburger Menu -->
					<i class="fa-solid fa-bars"></i>
				</Dialog.Trigger>

				<Dialog.Portal>
					<Dialog.Overlay
						class="fixed inset-0 z-500000000 bg-black/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
					/>
					<Dialog.Content
						class="fixed top-[50%] left-[50%] z-500000000 w-screen max-w-[calc(100vw-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-card border bg-background p-5 shadow-popover outline-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 md:w-full"
					>
						<!-- Top bar with title and close in top-right -->
						<div class="flex min-h-12 items-center justify-between p-10 pb-5">
							<Dialog.Title><h1 class="h2">Menu</h1></Dialog.Title>

							<div class="flex h-full items-center gap-4">
								<Lightswitch />
								<!-- Close button top-right -->
								<Dialog.Close class="preset-btn-round --ghost --square" aria-label="Close menu">
									<i class="fa-solid fa-x"></i>
								</Dialog.Close>
							</div>
						</div>
						<nav class="p-10 pt-0">
							<ul class="flex flex-col gap-6 overflow-auto">
								{#each Object.values(mainMenuWithSub) as item (item)}
									<li>
										<h1 class="h4">
											{@html item.nameLong}
										</h1>
										<ul class="my-2 flex flex-col gap-2">
											{#each item.idsSub as idSub (idSub)}
												<li>
													<a
														href={subMenuInfo[idSub as keyof typeof subMenuInfo].path}
														onclick={() => {
															openStateMenu = false; // close Menu
														}}
													>
														<h1 class="text-sans">
															{@html subMenuInfo[idSub as keyof typeof subMenuInfo].name}
														</h1>
													</a>
												</li>
											{/each}
										</ul>
									</li>
								{/each}
								{#each Object.values(mainMenuWithoutSub) as item (item)}
									<li>
										<a
											href={item.path}
											onclick={() => {
												openStateMenu = false; // close Menu
											}}
										>
											<h1 class="h4">{@html item.nameLong}</h1>
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
</div>
