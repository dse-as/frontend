export function scrollToNote (id){
    const elContainer = document.querySelector('[data-dom=containerAnnotations]');
    const elNoteRef = document.querySelector(`[data-dom=annotationBox][data-noteid=${id}]`);

    // Scroll to note
    elContainer?.scrollTo({left: elContainer.scrollLeft, top:elNoteRef?.offsetTop, behavior: 'smooth'})
}