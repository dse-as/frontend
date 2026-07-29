const NOTE_ID_PREFIX = 'note_';

interface BehaviorContext {
	dom: Document;
	noteIndex?: number;
}

export const behaviors = (dom: Document) => {
	return {
		tei: {
			// Handle Line Breaks and Hyphenation
			lb(this: BehaviorContext, el: HTMLElement): Text | undefined {
				if (el.getAttribute('break') === 'no') {
					// Remove the trailing whitespace of the previous text node
					const prev = el.previousSibling;

					if (prev && prev.nodeType === 3) // Node.TEXT_NODE is equivalent to 3
					{
						// Trim trailing whitespace
						prev.nodeValue = prev.nodeValue ? prev.nodeValue.replace(/\s+$/, '') : null;

						// Insert the hyphen for hyphenation
						const hyphenSpan = dom.createElement('span');
						hyphenSpan.setAttribute('data-type', 'hyphen');
						hyphenSpan.textContent = '-';
						prev.parentNode?.insertBefore(hyphenSpan, el);
					}

					// Replace the current behavior with an empty text node
					return dom.createTextNode('');
				}
			},

			// Insert Footnotes and extract note content
			// --> wrapping of commented text happens in a client-side function (see below).
			note(this: BehaviorContext, el: HTMLElement): HTMLSpanElement {
				// Create running index
				if (!this.noteIndex) {
					this['noteIndex'] = 1;
				} else {
					this.noteIndex++;
				}
				// Create noteId
				const noteId = `${NOTE_ID_PREFIX}${this.noteIndex}`;

				// Create notes-list and append to dom
				let noteList = this.dom.querySelector('ol.notes');
				if (!noteList) {
					noteList = dom.createElement('ol');
					noteList.setAttribute('class', 'notes');
					this.dom.appendChild(noteList);
				}
				const note = dom.createElement('li');
				note.setAttribute('data-noteid', `${noteId}`);
				note.innerHTML = `<div class='data-notenum'>${this.noteIndex}</div><div>${el.innerHTML}</div>`;
				noteList.appendChild(note);

				// Create footnote-span
				const footnote = dom.createElement('span');
				footnote.classList.add('footnote');
				footnote.setAttribute('data-noteid', `${noteId}`);
				footnote.dataset.noteId = String(this.noteIndex);
				footnote.innerHTML = String(this.noteIndex);

				return footnote;
			}
		}
	};
};

// Marks: Warp notes between anchors and matching notes
// --> Run after processPage()
export function wrapAnnotations(container: HTMLElement) {
	const notes = container.querySelectorAll('tei-note[targetend]');
	notes.forEach((note, runningId) => {
		const targetId = note.getAttribute('targetend');
		if (!targetId) return;
		const anchor = container.querySelector(`tei-anchor[id="${targetId}"]`);
		if (!anchor) return;

		// Collect sibling nodes between anchor and note
		let current = anchor.nextSibling;
		const nodes: Node[] = [];
		while (current && current !== note) {
			nodes.push(current);
			current = current.nextSibling;
		}
		if (!nodes.length) return;

		// Create mark (the wrapper around annotated text)
		const wrapper = container.ownerDocument.createElement('span');
		wrapper.classList.add('note-mark');
		wrapper.setAttribute('data-noteid', `${NOTE_ID_PREFIX}${runningId + 1}`);
		wrapper.dataset.noteTarget = targetId;

		nodes[0].parentNode!.insertBefore(wrapper, nodes[0]);
		nodes.forEach((n) => wrapper.appendChild(n));
	});
}

// Remove footnotes list from main text
// --> Run on client text components
export function removeNotesFromMaintext(ceteiSerialized: string) {
	return ceteiSerialized.replace(/<ol class="notes">.*?<\/ol>/s, '');
}

// Extract a single page from the serialized CETEI output by running page index.
// Linearizes the DOM into a flat node sequence, splitting at <tei-pb> boundaries.
// At each page boundary, closes all currently-open ancestor tags and reopens
// them at the start of the next page. This correctly handles <pb> appearing
// in the middle of <p>, <div>, <body>, etc.
export function extractPage(ceteiSerialized: string, pageIndex: number): string {
	const parser = new DOMParser();
	const doc = parser.parseFromString(ceteiSerialized, 'text/html');

	// Collect all <tei-pb> elements in document order
	const pageBreaks = Array.from(doc.querySelectorAll('tei-pb'));

	if (!pageBreaks.length) {
		console.warn('No <tei-pb> elements found. Returning full content.');
		return ceteiSerialized;
	}

	const targetIndex = pageIndex - 1; // Convert 1-based to 0-based
	if (targetIndex < 0 || targetIndex >= pageBreaks.length) {
		console.warn(`Page index ${pageIndex} is out of range (1–${pageBreaks.length}). Returning full content.`);
		return ceteiSerialized;
	}

	const targetPb = pageBreaks[targetIndex];
	const nextPb = targetIndex + 1 < pageBreaks.length ? pageBreaks[targetIndex + 1] : null;

	// Collect ancestors of the target <tei-pb> (these are the "open tags" we need to reopen)
	// We skip document-level elements (html, head, body)
	const skipTags = new Set(['html', 'head', 'body']);
	const ancestors: Element[] = [];
	let ancestor = targetPb.parentElement;
	while (ancestor && !skipTags.has(ancestor.tagName.toLowerCase())) {
		ancestors.push(ancestor);
		ancestor = ancestor.parentElement;
	}
	ancestors.reverse(); // Outermost first

	// Helper: serialize an element's attributes to a string
	function serializeAttrs(el: Element): string {
		return Array.from(el.attributes)
			.map(a => ` ${a.name}="${a.value.replace(/"/g, '&quot;')}"`)
			.join('');
	}

	// Build opening tags for ancestors
	const openTags = ancestors
		.map(el => `<${el.tagName.toLowerCase()}${serializeAttrs(el)}>`)
		.join('');

	// Build closing tags for ancestors (reversed order)
	const closeTags = ancestors
		.slice()
		.reverse()
		.map(el => `</${el.tagName.toLowerCase()}>`)
		.join('');

	// Collect all nodes between targetPb (exclusive) and nextPb (exclusive),
	// traversing the full subtree using a recursive tree walker.
	const collectedNodes: string[] = [];

	function collectFromNode(node: Node) {
		if (node === nextPb) return false; // Stop signal

		// Text node
		if (node.nodeType === 3) {
			collectedNodes.push(node.textContent || '');
			return true;
		}

		// Comment node
		if (node.nodeType === 8) {
			collectedNodes.push(`<!--${node.textContent}-->`);
			return true;
		}

		// Element node
		if (node.nodeType === 1) {
			const el = node as Element;
			const tag = el.tagName.toLowerCase();

			// Don't re-emit the <tei-pb> page breaks themselves
			if (tag === 'tei-pb') {
				return true; // Skip but continue
			}

			const attrs = serializeAttrs(el);
			const innerParts: string[] = [];

			// Recurse into children
			for (const child of Array.from(el.childNodes)) {
				if (!collectFromNode(child)) {
					// If a child returned false, we hit nextPb inside this subtree
					// Serialize what we have and emit a closing tag
					collectedNodes.push(`<${tag}${attrs}>${innerParts.join('')}</${tag}>`);
					return false; // Propagate stop signal
				}
			}

			// Normal completion: serialize the full element
			collectedNodes.push(`<${tag}${attrs}>${innerParts.join('')}</${tag}>`);
			return true;
		}

		return true;
	}

	// Start collecting from the first sibling after targetPb.
	// But first — handle the tricky case: if targetPb is inside a <p>,
	// the remaining siblings of targetPb are the "tail" of that <p>.
	// We need to collect those, then move up to the parent's next siblings, etc.

	function collectFromSiblings(startNode: Node | null): boolean {
		let current = startNode;

		// Inner: collect remaining siblings within the same parent
		while (current) {
			if (current === nextPb) return false;
			if (!collectFromNode(current)) return false;
			current = current.nextSibling;
		}

		// Move up: if the parent has a next sibling, continue there.
		// This handles the case where <pb> is nested deep inside elements.
		// We need to close the current ancestor and continue at the parent level.
		return true;
	}

	// Step 1: Collect the "tail" — remaining siblings after targetPb within its parent
	// These are the nodes that come after <pb> inside the same element (e.g., the rest of a <p>)
	const tailParts: string[] = [];
	function collectTail(node: Node | null): boolean {
		let current = node;
		while (current) {
			if (current === nextPb) return false;
			if (!collectNodeFlat(current, tailParts)) return false;
			current = current.nextSibling;
		}
		return true;
	}

	// Flat serialization of a node: emit its outerHTML but skip <tei-pb>
	function collectNodeFlat(node: Node, out: string[]): boolean {
		if (node === nextPb) return false;

		if (node.nodeType === 3) {
			out.push(node.textContent || '');
			return true;
		}
		if (node.nodeType === 8) {
			out.push(`<!--${node.textContent}-->`);
			return true;
		}
		if (node.nodeType === 1) {
			const el = node as Element;
			if (el.tagName.toLowerCase() === 'tei-pb') {
				return true; // Skip page breaks
			}
			// Serialize this element (including children) — but we must stop if nextPb is inside
			const tag = el.tagName.toLowerCase();
			const attrs = serializeAttrs(el);
			const innerParts: string[] = [];
			for (const child of Array.from(el.childNodes)) {
				if (!collectNodeFlat(child, innerParts)) {
					out.push(`<${tag}${attrs}>${innerParts.join('')}</${tag}>`);
					return false;
				}
			}
			out.push(`<${tag}${attrs}>${innerParts.join('')}</${tag}>`);
			return true;
		}
		return true;
	}

	// Collect from the sibling after targetPb to the end of its parent's children
	collectTail(targetPb.nextSibling);

	// Then collect from the ancestors' following siblings, outermost to innermost
	// Actually — we need to collect from each ancestor level going upward:
	// After collecting the tail at the deepest level, move to the parent's next sibling.
	const allParts: string[] = [...tailParts];

	let climbNode: Node | null = targetPb.parentElement;
	while (climbNode && climbNode !== doc.body) {
		let sibling = climbNode.nextSibling;
		while (sibling) {
			if (sibling === nextPb) break;
			if (!collectNodeFlat(sibling, allParts)) break;
			sibling = sibling.nextSibling;
		}
		if (sibling === nextPb) break;
		climbNode = climbNode.parentElement;
	}

	return openTags + allParts.join('') + closeTags;
}