export function invertScroll(ev: WheelEvent) {
	const container = ev.currentTarget as HTMLElement;
	if (container) {
		const atStart = container.scrollLeft <= 0;
		const atEnd = container.scrollLeft >= container?.scrollWidth - container?.clientWidth - 4;
		if (
			!(atStart && atEnd) &&
			((atStart && (ev.deltaY > 0 || ev.deltaX > 0)) ||
				(atEnd && (ev.deltaY < 0 || ev.deltaX < 0)) ||
				(!atStart && !atEnd))
		) {
			ev.preventDefault(); // Prevent default vertical scroll behavior
			container.scrollLeft += ev.deltaY;
			container.scrollLeft += ev.deltaX;
		}
	}
}
