import CETEI from 'CETEIcean';

export function addBehaviorRemoveNote(cetei, annotationStore) {
	const cetei = new CETEI();

	// Split Notes
	cetei.addBehaviors({
		tei: {
			note: function (el) {
				const id = el.getAttribute('xml:id');

				// Register sidebar element later
				const a = annotations.find((x) => x.id === id);
				if (a) a.noteEl = el;

				// Add event listener
				el.addEventListener('click', (e) => {
					if (e.target.closest('tei-ref, a')) return;
					annotationStore.activate(id);
				});

				return el;
			}
		}
	});

	return cetei;
}
