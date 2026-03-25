export default {
	namespaces: {
		tei: 'http://www.tei-c.org/ns/1.0',
		teieg: 'http://www.tei-c.org/ns/Examples',
		rng: 'http://relaxng.org/ns/structure/1.0'
	},
	tei: {
		persName: [['[ref]', ['<a href="$rw@ref" target="_blank">', '</a>']]],
		// inserts a link inside <ptr> using the @target; the link in the
		// @href is piped through the rw (rewrite) function before insertion
		ptr: ['<a href="$rw@target">$@target</a>'],
		// wraps the content of the <ref> in an HTML link with the @target in
		// the @href. If there are multiple @targets, only the first is used.
		ref: [['[target]', ['<a href="$rw@target">', '</a>']]],
		// creates an img tag with the @url as the src attribute
		graphic: function (elt) {
			let content = elt.ownerDocument.createElement('img');
			content.src = this.rw(elt.getAttribute('url'));
			if (elt.hasAttribute('width')) {
				content.setAttribute('width', elt.getAttribute('width'));
			}
			if (elt.hasAttribute('height')) {
				content.setAttribute('height', elt.getAttribute('height'));
			}
			return content;
		},

		anchor: function (el) {
		const id = el.getAttribute("xml:id");
		if (!id) return;

		// Find matching note
		const note = document.querySelector(
			`tei-note[targetEnd="${id}"]`
		);

		if (!note) return;

		// Collect nodes between anchor and note
		let current = el.nextSibling;
		const nodes = [];

		while (current && current !== note) {
			nodes.push(current);
			current = current.nextSibling;
		}

		if (!nodes.length) return;

		// Wrap nodes
		const wrapper = document.createElement("span");
		wrapper.classList.add("tei-annotation");

		nodes[0].parentNode.insertBefore(wrapper, nodes[0]);
		nodes.forEach((n) => wrapper.appendChild(n));

		// Store note content
		const noteContent = note.textContent;

		// Interaction
		wrapper.addEventListener("click", () => {
			wrapper.classList.toggle("active");
			alert(noteContent);
		});

		return el; // keep anchor
		},

		// // Make endnotes (form cookbook)
		// note: function (elt) {
		// 	if (!this.noteIndex) {
		// 		this['noteIndex'] = 1;
		// 	} else {
		// 		this.noteIndex++;
		// 	}
		// 	const prefixNote = 'note';
		// 	const prefixSrc = 'srcnote';
		// 	let id = this.noteIndex;
		// 	let link = document.createElement('a');
		// 	link.setAttribute('id', `${prefixSrc}${id}`);
		// 	link.setAttribute('href', `#${prefixNote}${id}`);
		// 	link.innerHTML = this.noteIndex;
		// 	let content = document.createElement('sup');
		// 	content.appendChild(link);
		// 	let notes = this.dom.querySelector('ol.notes');
		// 	if (!notes) {
		// 		notes = document.createElement('ol');
		// 		notes.setAttribute('class', 'notes');
		// 		this.dom.appendChild(notes);
		// 	}
		// 	let note = document.createElement('li');
		// 	note.id = `${prefixNote}${id}`;
		// 	note.innerHTML = `<a href='#${prefixSrc}${id}'><sup>${id}</sup> </a>${elt.innerHTML}`;
		// 	notes.appendChild(note);
		// 	return content;
		// },

		// Hide the teiHeader by default
		teiHeader: function (e) {
			this.hideContent(e, false);
		},

		// Make the title element the HTML title
		title: [
			[
				'tei-titlestmt>tei-title',
				function (elt) {
					const doc = elt.ownerDocument;
					let title = doc.createElement('title');
					title.innerHTML = elt.innerText;
					doc.querySelector('head').appendChild(title);
				}
			]
		]
	}
};
