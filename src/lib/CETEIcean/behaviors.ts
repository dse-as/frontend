const NOTE_ID_PREFIX = 'note_';


export const behaviors = (dom) => {
	return {
		tei: {
			lb: function (el: HTMLElement) {
				if (el.getAttribute('break') === 'no') {
					// Remove the trailing whitespace of the previous text node
					let prev = el.previousSibling;

					if (prev && prev.nodeType === 3) {
						// Node.TEXT_NODE is equivalent to 3
						const whitespace = prev.nodeValue.replace(/\s+$/, '');
						prev.nodeValue = whitespace; // Set the previous text node to the trimmed value

						// Create the span element
						const hyphenSpan = dom.createElement('span');
						hyphenSpan.setAttribute('data-type', 'hyphen');
						hyphenSpan.textContent = '-'; // Set the hyphen content

						// Insert the span after the previous node
						prev.parentNode.insertBefore(hyphenSpan, el);
					}
					return dom.createTextNode(''); // Replace the current behavior with an empty text node
				}
			},

			note: function (el) {
				// Create running index
				if (!this.noteIndex) {
					this['noteIndex'] = 1;
				} else {
					this.noteIndex++;
				}
				let id = `${NOTE_ID_PREFIX}${this.noteIndex}`;

				// Create footnote
				let footnote = dom.createElement('span');
				footnote.classList.add('footnote');
				footnote.setAttribute('data-noteid', `${id}`);
				footnote.dataset.noteId = this.noteIndex;
				footnote.innerHTML = this.noteIndex;

				// Create notes-list
				let noteList = this.dom.querySelector('ol.notes');
				if (!noteList) {
					noteList = dom.createElement('ol');
					noteList.setAttribute('class', 'notes');
					this.dom.appendChild(noteList);
				}
				let note = dom.createElement('li');
				note.setAttribute('data-noteid', `${id}`);
				note.innerHTML = `<div class='data-noteidx'>${this.noteIndex}</div><div>${el.innerHTML}</div>`;
				noteList.appendChild(note);
				return footnote;
			}
		}
	};
};

/** Run after processPage() to wrap nodes between anchors and their matching notes */
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
		wrapper.setAttribute('data-noteid', `${NOTE_ID_PREFIX}${runningId+1}`);
		wrapper.dataset.noteTarget = targetId;

		nodes[0].parentNode!.insertBefore(wrapper, nodes[0]);
		nodes.forEach((n) => wrapper.appendChild(n));
	});
}

/** Run on client text components to remove the footnotes list from the main tetx */
export function removeNotesFromMaintext(ceteiSerialized: String) {
	return ceteiSerialized.replace(/<ol class="notes">.*?<\/ol>/s, '');
}
