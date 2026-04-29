export const behaviors = (dom) => {
	return {
		tei: {
			// pb: [`<span
			// 		data-type="pagebreak"
			// 		data-facs="https://iiif.ub.unibe.ch/image/v3/schwarzenbach/smallform_0231_001.tif"
			// 		data-page="1"
			// 		data-n="10"
			// />`,""],
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

			note: function (elt) {
				if (!this.noteIndex) {
					this['noteIndex'] = 1;
				} else {
					this.noteIndex++;
				}
				let id = 'note' + this.noteIndex;
				let link = dom.createElement('a');
				link.setAttribute('id', `src_${id}`);
				link.setAttribute('href', '#' + id);
				link.dataset.noteId = this.noteIndex;
				link.innerHTML = this.noteIndex;
				let content = dom.createElement('sup');
				content.appendChild(link);
				let notes = this.dom.querySelector('ol.notes');
				if (!notes) {
					notes = dom.createElement('ol');
					notes.setAttribute('class', 'notes');
					this.dom.appendChild(notes);
				}
				let note = dom.createElement('li');
				note.id = id;
				note.innerHTML =
					`<a href="#src_${id}" class="note_index">${this.noteIndex}</a>` + elt.innerHTML;
				notes.appendChild(note);
				return content;
			}
		}
	};
};

/** Run after processPage() to wrap nodes between anchors and their matching notes */
export function wrapAnnotations(container: HTMLElement) {
	const notes = container.querySelectorAll('tei-note[targetend]');
	notes.forEach((note) => {
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
		const wrapper = container.ownerDocument.createElement('span');
		wrapper.classList.add('tei-annotation');
		wrapper.dataset.noteTarget = targetId;

		nodes[0].parentNode!.insertBefore(wrapper, nodes[0]);
		nodes.forEach((n) => wrapper.appendChild(n));
	});
}

/** Run on client text components to remove the footnotes list from the main tetx */
export function removeNotesFromMaintext(ceteiSerialized: String) {
	return ceteiSerialized.replace(/<ol class="notes">.*?<\/ol>/s, '');
}
