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
