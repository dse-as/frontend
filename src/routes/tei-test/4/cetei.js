import CETEI from '$lib/CETEIcean/CETEI';

export function createCETEIWithAnnotations(store, ctx) {
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

          // Wrap annotated range
          const wrapper = document.createElement("span");
          wrapper.classList.add("tei-annotation");

          nodes[0].parentNode.insertBefore(wrapper, nodes[0]);
          nodes.forEach((n) => wrapper.appendChild(n));

          // Create superscript marker
          const sup = document.createElement("sup");
          sup.classList.add("tei-marker");

          wrapper.after(sup);

          const annotation = {
            id: note.getAttribute("xml:id"),
            wrapper,
            noteEl: null,
            sup,
            index: 0
          };

          store.add(annotation);

          sup.textContent = annotation.index;

          // --- INTERACTIONS ---

          function activate() {
            store.activate(annotation.id);
          }

          function hoverOn() {
            store.hover(annotation.id, true);
          }

          function hoverOff() {
            store.hover(annotation.id, false);
          }

          // Text hover
          wrapper.addEventListener("mouseenter", hoverOn);
          wrapper.addEventListener("mouseleave", hoverOff);

          // Sup hover + click
          sup.addEventListener("mouseenter", hoverOn);
          sup.addEventListener("mouseleave", hoverOff);
          sup.addEventListener("click", (e) => {
            if (e.target.closest("a, tei-ref")) return;
            activate();
          });

          // Click text
          wrapper.addEventListener("click", (e) => {
            if (e.target.closest("a, tei-ref")) return;
            activate();
          });
        });

        return el;
      },

      note: function (el) {
        const id = el.getAttribute("xml:id");

        store.attachNoteElement(id, el);

        el.addEventListener("mouseenter", () => store.hover(id, true));
        el.addEventListener("mouseleave", () => store.hover(id, false));

        el.addEventListener("click", (e) => {
          if (e.target.closest("a, tei-ref")) return;
          store.activate(id, "sidebar");
        });

        return el;
      }
    }
  });

  return cetei;
}