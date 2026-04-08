<script module lang="ts">
	let OpenSeadragon;
</script>

<script lang="ts">
	import { asset } from '$app/paths';
	const uuid = crypto.randomUUID();
	let viewer;

	let { iiif_url } = $props();

	const generateViewer = (node, manifest) => {
		let observer;
		const createViewer = () => {
			viewer = new OpenSeadragon.Viewer({
				id: node.id,
				prefixUrl: asset(`/openseadragon-svg-icons/`),
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
				showNavigator: true,
				sequenceMode: false,
				crossOriginPolicy: 'Anonymous'
			});

			observer = new ResizeObserver((_entries) => {
				setTimeout(() => {
					viewer.viewport.goHome(false);
				}, 50);
			});
			observer.observe(node);
			if (!manifest) return;
			viewer.open(manifest);
		};
		if (!OpenSeadragon) {
			import('openseadragon').then((r) => {
				OpenSeadragon = r.default;
				createViewer();
			});
		} else {
			createViewer();
		}

		return {
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
	// wait = false;
</script>

<div
	id={'viewer-' + uuid}
	class="h-screen w-full"
	use:generateViewer={`${iiif_url}/info.json`}
></div>
