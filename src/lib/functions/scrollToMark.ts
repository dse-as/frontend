export function scrollToMark (id){
    const elContainer = document.querySelector('[data-dom=containerMaintext]');
    const elNoteRef = document.querySelector(`[data-type=markstart][data-noteid=${id}]`);

    // Scroll to note
    elContainer?.scrollTo({left: elContainer.scrollLeft, top:elNoteRef?.offsetTop, behavior: 'smooth'})
}