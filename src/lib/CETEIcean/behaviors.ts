export const behaviors = (dom) => {
	return {
		tei: {
			note: function (elt) {
				if (!this.noteIndex) {
					this['noteIndex'] = 1;
				} else {
					this.noteIndex++;
				}
				let id = 'note' + this.noteIndex;
				let link = dom.createElement('a');
				link.setAttribute('id', 'src' + id);
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
				note.innerHTML = '<a href="#src' + id + '">^</a> ' + elt.innerHTML;
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
