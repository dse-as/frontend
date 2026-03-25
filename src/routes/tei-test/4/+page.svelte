<script>
	import { onMount } from 'svelte';
	import CETEI from '$lib/CETEIcean/CETEI';

	let textContainer;
	let sidebarContainer;

	// ---------------- STORE ----------------
	function createStore() {
		let annotations = $state([]);
		let hovered = $state([]);
		let active = $state([]);

		let anchors = new Map();
		let notes = new Map();

		function registerAnchor(id, el) {
			anchors.set(id, el);
		}

		function registerNote(id, target, el) {
			notes.set(id, { el, target });
		}

		function build() {
			annotations.length = 0;

			// Step 1: collect ranges
			const ranges = [];

			notes.forEach((n, id) => {
				const anchor = anchors.get(n.target);
				if (!anchor || !anchor.nextSibling) return;

				const range = document.createRange();
				range.setStartBefore(anchor.nextSibling);
				range.setEndBefore(n.el);

				ranges.push({
					id,
					range,
					startNode: anchor.nextSibling,
					endNode: n.el
				});
			});

			// Step 2: collect all boundary points
			const boundaries = [];

			ranges.forEach((r) => {
				boundaries.push({ node: r.startNode, type: 'start', id: r.id });
				boundaries.push({ node: r.endNode, type: 'end', id: r.id });
			});

			// Step 3: iterate through DOM nodes
			const walker = document.createTreeWalker(textContainer, NodeFilter.SHOW_TEXT, null);

			const segments = [];

			let currentNode;
			let active = new Set();

			while ((currentNode = walker.nextNode())) {
				// apply boundary changes
				boundaries.forEach((b) => {
					if (b.node === currentNode) {
						if (b.type === 'start') active.add(b.id);
						if (b.type === 'end') active.delete(b.id);
					}
				});

				if (!currentNode.textContent.trim()) continue;

				segments.push({
					node: currentNode,
					ids: [...active]
				});
			}

			// Step 4: wrap segments
			segments.forEach((seg) => {
				if (!seg.ids.length) return;

				const span = document.createElement('span');
				span.className = 'tei-seg';
				span.dataset.ids = seg.ids.join(' ');

				seg.node.parentNode.replaceChild(span, seg.node);
				span.appendChild(seg.node);

				// interactions
				span.onmouseover = () => seg.ids.forEach((id) => hover(id, true));
				span.onmouseout = () => seg.ids.forEach((id) => hover(id, false));

				span.onclick = (e) => {
					if (e.target.closest('a, tei-ref')) return;
					activate(seg.ids[0], 'text');
				};
			});

			// Step 5: build annotation objects + superscripts
			ranges.forEach((r, i) => {
				const sup = document.createElement('sup');
				sup.className = 'tei-marker';
				sup.textContent = i + 1;

				r.endNode.parentNode.insertBefore(sup, r.endNode);

				const annotation = {
					id: r.id,
					noteEl: notes.get(r.id).el,
					sup,
					index: i + 1
				};

				annotations.push(annotation);

				sup.onmouseover = () => hover(r.id, true);
				sup.onmouseout = () => hover(r.id, false);
				sup.onclick = () => activate(r.id, 'text');
			});
		}

		function hover(id, state) {
			hovered = state ? [...new Set([...hovered, id])] : hovered.filter((x) => x !== id);

			update();
		}

		function activate(id, source) {
			active = [id];
			update();

			const a = annotations.find((x) => x.id === id);
			if (!a) return;

			if (source === 'text') {
				a.noteEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
			} else {
				a.wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		}

		function update() {
			const allSegs = textContainer.querySelectorAll('.tei-seg');

			allSegs.forEach((seg) => {
				const ids = seg.dataset.ids.split(' ');

				const isHover = ids.some((id) => hovered.includes(id));
				const isActive = ids.some((id) => active.includes(id));

				seg.classList.toggle('hover', isHover);
				seg.classList.toggle('active', isActive);
			});

			annotations.forEach((a) => {
				const h = hovered.includes(a.id);
				const act = active.includes(a.id);

				a.sup.classList.toggle('hover', h);
				a.sup.classList.toggle('active', act);

				a.noteEl.classList.toggle('hover', h);
				a.noteEl.classList.toggle('active', act);
			});
		}

		return {
			annotations,
			registerAnchor,
			registerNote,
			build,
			hover,
			activate
		};
	}

	let store = createStore();

	// ---------------- CETEI ----------------
	function createCETEI() {
		const cetei = new CETEI();

		cetei.addBehaviors({
			tei: {
				anchor: function (el) {
					const id = el.getAttribute('xml:id');
					if (id) store.registerAnchor(id, el);
					return el;
				},

				note: function (el) {
					const id = el.getAttribute('xml:id');
					const target = el.getAttribute('targetEnd');

					if (id && target) {
						store.registerNote(id, target, el);
					}

					// hide original notes (we render sidebar)
					el.style.display = 'none';

					return el;
				}
			}
		});

		return cetei;
	}

	// ---------------- INIT ----------------
	onMount(() => {
		const cetei = createCETEI();

		cetei.getHTML5('/test-tei/example.xml', (data) => {
			textContainer.innerHTML = '';
			textContainer.appendChild(data);

			// 🔥 IMPORTANT: build AFTER render
			requestAnimationFrame(() => {
				store.build();
			});
		});
	});
</script>

<!-- LAYOUT -->
<div class="grid h-screen grid-cols-2 gap-4">
	<div bind:this={textContainer} class="prose overflow-auto border p-4"></div>

	<div bind:this={sidebarContainer} class="overflow-auto border p-4">
		{#each store.annotations as a}
			<div
				class="note-item cursor-pointer p-2"
				onmouseover={() => store.hover(a.id, true)}
				onmouseout={() => store.hover(a.id, false)}
				onclick={() => store.activate(a.id, 'sidebar')}
			>
				<sup>{a.index}</sup>
				{@html a.noteEl.innerHTML}
			</div>
		{/each}
	</div>
</div>

<style>
	.tei-annotation.hover {
		background: #fef08a;
	}
	.tei-annotation.active {
		background: #fde047;
	}
	.tei-marker {
		font-size: 0.75rem;
		margin-left: 2px;
		cursor: pointer;
		color: blue;
	}
	.note-item.hover {
		background: #fef9c3;
	}
	.note-item.active {
		background: #fde68a;
		border-left: 4px solid #facc15;
	}
</style>
