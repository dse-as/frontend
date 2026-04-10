<script module lang="ts">
	import { assets } from '$app/paths';
	let OpenSeadragon: any;
</script>

<script lang="ts">
	const uuid = crypto.randomUUID();
	let viewer: any;

	let { iiif_url }: { iiif_url: string } = $props();

	const generateViewer = (node: HTMLElement, manifest: string) => {
		let observer: ResizeObserver;
		const createViewer = () => {
			viewer = new OpenSeadragon.Viewer({
				id: node.id,
				prefixUrl: `${assets}/openseadragon-svg-icons/icons/`,
				showNavigator: true,
				sequenceMode: false
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
			update(iiif: string) {
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
