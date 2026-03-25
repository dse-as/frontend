export function createAnnotationStore(ctx) {
  let annotations = $state([]);
  let active = $state([]);
  let hovered = $state([]);

  function add(a) {
    annotations.push(a);
    a.index = annotations.length;
    a.sup.textContent = a.index;
  }

  function attachNoteElement(id, el) {
    const a = annotations.find((x) => x.id === id);
    if (a) a.noteEl = el;
  }

  function updateClasses() {
    annotations.forEach((a) => {
      const isActive = active.includes(a.id);
      const isHover = hovered.includes(a.id);

      a.wrapper.classList.toggle("active", isActive);
      a.wrapper.classList.toggle("hover", isHover);

      a.sup.classList.toggle("active", isActive);
      a.sup.classList.toggle("hover", isHover);

      a.noteEl?.classList.toggle("active", isActive);
      a.noteEl?.classList.toggle("hover", isHover);
    });
  }

  function hover(id, state) {
    hovered = state
      ? [...new Set([...hovered, id])]
      : hovered.filter((x) => x !== id);

    updateClasses();
  }

  function activate(id, source = "text") {
    const related = annotations.filter((a) => a.id === id);
    active = related.map((a) => a.id);

    updateClasses();

    if (!related.length) return;

    const first = related[0];

    if (source === "text") {
      first.noteEl?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest"
      });
    } else {
      first.wrapper?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }

  return {
    annotations,
    add,
    attachNoteElement,
    activate,
    hover
  };
}