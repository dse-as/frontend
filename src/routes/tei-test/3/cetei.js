import CETEI from '$lib/CETEIcean/CETEI';

export function createCETEIWithAnnotations(annotationStore) {
  const cetei = new CETEI();

  cetei.addBehaviors({
    tei: {
      anchor: function (el) {
        const id = el.getAttribute("xml:id");
        if (!id) return el;

        const notes = Array.from(
          document.querySelectorAll(`tei-note[targetEnd="${id}"]`)
        );

        notes.forEach((note) => {
          let current = el.nextSibling;
          const nodes = [];

          while (current && current !== note) {
            nodes.push(current);
            current = current.nextSibling;
          }

          if (!nodes.length) return;

          const wrapper = document.createElement("span");
          wrapper.classList.add("tei-annotation");

          nodes[0].parentNode.insertBefore(wrapper, nodes[0]);
          nodes.forEach((n) => wrapper.appendChild(n));

          const annotation = {
            id: note.getAttribute("xml:id"),
            anchor: id,
            wrapper,
            noteEl: null,
            content: note.innerHTML,
            index: 0
          };

          annotationStore.add(annotation);

          // CLICK TEXT
          wrapper.addEventListener("click", (e) => {
            // Prevent anchor clicks inside
            if (e.target.closest("tei-ref, a")) return;

            annotationStore.activate(annotation.id);
          });
        });

        return el;
      },

      note: function (el) {
        const id = el.getAttribute("xml:id");

        // Register sidebar element later
        annotationStore.attachNoteElement(id, el);

        el.addEventListener("click", (e) => {
          if (e.target.closest("tei-ref, a")) return;

          annotationStore.activate(id);
        });

        return el;
      }
    }
  });

  return cetei;
}