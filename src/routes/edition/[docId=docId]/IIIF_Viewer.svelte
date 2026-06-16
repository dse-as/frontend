<script module lang="ts">
	let OpenSeadragon: any;
</script>

<script lang="ts">
	import { asset } from '$app/paths';
	const uuid = crypto.randomUUID();
	let viewer: any;

	let { url, currentPage } = $props();

	const maxWidth = '100';
	const maxHeight = '100';

	let showSpinner = $state(true);
	let isError = $state(false);

	const generateViewer = (node: HTMLElement, manifest: string) => {
		let observer: ResizeObserver;
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
					}
				},
				showNavigator: true,
				showRotationControl: true,
				sequenceMode: false,
				crossOriginPolicy: 'Anonymous'
			});

			observer = new ResizeObserver(() => {
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
</script>

{#if url}
	{#if !showSpinner && !isError}
		<div id={'viewer-' + uuid} class="h-full w-full" use:generateViewer={`${url}/info.json`}></div>
	{/if}
	{#if showSpinner}
		<div
			class={['flex h-full w-full flex-col items-center justify-center gap-10']}
			style={`width:${Number(maxWidth) * 0.7}px; height:${maxHeight}px;`}
		>
			<i class="fa-solid fa-spinner fa-spin fa-2xl text-spinner"></i>
		</div>
	{:else if isError}
		<div
			class={['flex items-center justify-center']}
			style={`width:${Number(maxWidth) * 0.7}px; height:${maxHeight}px;`}
		>
			<i class="fa-solid fa-xmark fa-2xl text-warning"></i>
		</div>
	{/if}
{:else}
	<div class={['flex h-full w-full items-center justify-center']}>
		<i class="fa-solid fa-xmark fa-2xl"></i>
	</div>
{/if}
