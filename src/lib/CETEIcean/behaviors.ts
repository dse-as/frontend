const NOTE_ID_PREFIX = 'note_';

export const behaviors = (dom) => {
	return {
		tei: {
			// Handle Line Breaks and Hyphenation
			lb: function (el: HTMLElement) {
				if (el.getAttribute('break') === 'no') {
					// Remove the trailing whitespace of the previous text node
					let prev = el.previousSibling;

					if (prev && prev.nodeType === 3) // Node.TEXT_NODE is equivalent to 3
					{
						// Trim trailing whitespace
						prev.nodeValue = prev.nodeValue ? prev.nodeValue.replace(/\s+$/, '') : null;

						// Insert the hyphen for hyphenation
						const hyphenSpan = dom.createElement('span');
						hyphenSpan.setAttribute('data-type', 'hyphen');
						hyphenSpan.textContent = '-';
						prev.parentNode.insertBefore(hyphenSpan, el);
					}

					// Replace the current behavior with an empty text node
					return dom.createTextNode('');
				}
			},

			// Insert Footnotes and extract note content
			// --> wrapping of commented text happens in a client-side function (see below).
			note: function (el) {
				// Create running index
				if (!this.noteIndex) {
					this['noteIndex'] = 1;
				} else {
					this.noteIndex++;
				}
				// Create noteId
				let noteId = `${NOTE_ID_PREFIX}${this.noteIndex}`;

				// Create notes-list and append to dom
				let noteList = this.dom.querySelector('ol.notes');
				if (!noteList) {
					noteList = dom.createElement('ol');
					noteList.setAttribute('class', 'notes');
					this.dom.appendChild(noteList);
				}
				let note = dom.createElement('li');
				note.setAttribute('data-noteid', `${noteId}`);
				note.innerHTML = `<div class='data-noteidx'>${this.noteIndex}</div><div>${el.innerHTML}</div>`;
				noteList.appendChild(note);

				// Create footnote-span
				let footnote = dom.createElement('span');
				footnote.classList.add('footnote');
				footnote.setAttribute('data-noteid', `${noteId}`);
				footnote.dataset.noteId = this.noteIndex;
				footnote.innerHTML = this.noteIndex;

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
export function removeNotesFromMaintext(ceteiSerialized: String) {
	return ceteiSerialized.replace(/<ol class="notes">.*?<\/ol>/s, '');
}
