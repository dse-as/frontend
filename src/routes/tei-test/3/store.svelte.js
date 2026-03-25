export function createAnnotationStore() {
  let annotations = $state([]);
  let activeIds = $state([]);

  function add(a) {
    annotations.push(a);
    a.index = annotations.length;
  }

  function attachNoteElement(id, el) {
    const a = annotations.find((x) => x.id === id);
    if (a) a.noteEl = el;
  }

  function activate(id) {
    const related = annotations.filter((a) => a.id === id);

    activeIds = related.map((a) => a.id);

    // Highlight all matches
    annotations.forEach((a) => {
      const active = activeIds.includes(a.id);
      a.wrapper.classList.toggle("active", active);
      a.noteEl?.classList.toggle("active", active);
    });

    // Scroll behavior
    if (related.length) {
      related[0].noteEl?.scrollIntoView({ behavior: "smooth", block: "center" });
      related[0].wrapper?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return {
    get annotations() {
      return annotations;
    },
    add,
    attachNoteElement,
    activate
  };
}