<script>
	import { assets } from '$app/paths';
	import { onMount } from 'svelte';

	// MISSING VARIABLES
	const URL_STATIC_API = '';
	const filename = '';

	let OpenSeadragon;
	let generateViewer;
	let overlayEl = $state(null);
	let { meta, docId } = $props();
	let iiif = $state({
		id: null,
		tpData: null,
		manifest: null,
		overlay: null
	});
	const uuid = crypto.randomUUID();
	onMount(async () => {
		iiif = {
			id: uuid,
			tpData: null,
			// using id.toUpperCase() to match the iiif file naming convention - this might change in the future
			iiif: fetch(meta[docId].manuscript.url_iiif).then((r) => r.json()),
			overlay: `${URL_STATIC_API}/svg/${filename}.svg`
		};

		// OpenSeadragon
		let { default: OpenSeadragon } = await import('openseadragon');
		let viewer;
		generateViewer = (node, manifest) => {
			if (!viewer) {
				viewer = new OpenSeadragon.Viewer({
					id: node.id,
					prefixUrl: `${assets}/openseadragon-svg-icons/icons/`,
					showNavigator: true,
					sequenceMode: false,
					navImages: {
						zoomIn: {
							REST: 'zoomin_rest.svg',
							GROUP: 'zoomin_grouphover.svg',
							HOVER: 'zoomin_hover.svg',
							DOWN: 'zoomin_pressed.svg'
						},
						next: {
							REST: 'next_rest.svg',
							GROUP: 'next_grouphover.svg',

							HOVER: 'next_hover.svg',
							DOWN: 'next_pressed.svg'
						},
						previous: {
							REST: 'previous_rest.svg',
							GROUP: 'previous_grouphover.svg',
							HOVER: 'previous_hover.svg',
							DOWN: 'previous_pressed.svg'
						},
						fullpage: {
							REST: 'fullpage_rest.svg',
							GROUP: 'fullpage_grouphover.svg',
							HOVER: 'fullpage_hover.svg',
							DOWN: 'fullpage_pressed.svg'
						},
						home: {
							REST: 'home_rest.svg',
							GROUP: 'home_grouphover.svg',
							HOVER: 'home_hover.svg',
							DOWN: 'home_pressed.svg'
						},
						zoomOut: {
							REST: 'zoomout_rest.svg',
							GROUP: 'zoomout_grouphover.svg',
							HOVER: 'zoomout_hover.svg',
							DOWN: 'zoomout_pressed.svg'
						},
						rotateleft: {
							REST: 'rotateleft_rest.svg',
							GROUP: 'rotateleft_grouphover.svg',
							HOVER: 'rotateleft_hover.svg',
							DOWN: 'rotateleft_pressed.svg'
						},
						rotateright: {
							REST: 'rotateright_rest.svg',
							GROUP: 'rotateright_grouphover.svg',
							HOVER: 'rotateright_hover.svg',
							DOWN: 'rotateright_pressed.svg'
						},
						flip: {
							REST: 'flip_rest.svg',
							GROUP: 'flip_grouphover.svg',
							HOVER: 'flip_hover.svg',
							DOWN: 'flip_pressed.svg'
						}
					},
					overlays: [
						{
							element: overlayEl,
							location: new OpenSeadragon.Rect(0, 0, 1, manifest?.height / manifest?.width),
							placement: OpenSeadragon.Placement.TOP_LEFT
						}
					]
				});

				observer = new ResizeObserver((_entries) => {
					setTimeout(() => {
						viewer.viewport.goHome(false);
					}, 50);
				});
				observer.observe(node);
				if (!manifest) return;
				viewer.open(manifest);
			}
			if (!OpenSeadragon) {
				import('openseadragon').then((r) => {
					OpenSeadragon = r.default;
					createViewer();
				});
			} else {
				createViewer();
			}

			return {
				/**
				 * @param {Promise<Object>} iiif
				 */
				update(iiif) {
					if (!viewer) return;
					viewer.open($state.snapshot(iiif));
				},
				destroy() {
					viewer.destroy();
					if (observer) {
						observer.disconnect();
					}
				}
			};
		};
	});
</script>

{#await iiif.manifest then imageObject}
	{iiif.manifest}
	{overlayEl}
	<div id={'viewer-' + uuid} class="h-full w-full" use:generateViewer={imageObject}></div>
{/await}

<img
	id={'overlay-' + uuid}
	class="max-h-none max-w-none"
	src={iiif.overlay}
	alt=""
	bind:this={overlayEl}
/>
