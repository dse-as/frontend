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
