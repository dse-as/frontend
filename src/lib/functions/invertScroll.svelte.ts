let timeout: ReturnType<typeof setTimeout> | null = $state(null);
let preventVerticalScrollAtEnds = $state(false);

export function invertScroll(ev: WheelEvent) {
	const container = ev.currentTarget as HTMLElement;
	if (!container) return;

	const atStart = container.scrollLeft <= 0;
	const atEnd = container.scrollLeft >= container.scrollWidth - container.clientWidth - 4;

	// Prevent scrolling vertically past edges when preventVerticalScrollAtEnds is enabled
	if (preventVerticalScrollAtEnds && ((atStart && ev.deltaY < 0) || (atEnd && ev.deltaY > 0))) {
		ev.preventDefault();
	}
	// Allow horizontal scrolling inversion in normal scenarios
	// (If we're at one edge but trying to scroll in the allowed direction, or in the middle)
	else if (
		!(atStart && atEnd) &&
		((atStart && (ev.deltaY > 0 || ev.deltaX > 0)) ||
			(atEnd && (ev.deltaY < 0 || ev.deltaX < 0)) ||
			(!atStart && !atEnd))
	) {
		ev.preventDefault();
		container.scrollLeft += ev.deltaY;
		container.scrollLeft += ev.deltaX;
		// Enable preventVerticalScrollAtEnds for better UX
		preventVerticalScrollAtEnds = true;
	} else if (preventVerticalScrollAtEnds) {
		ev.preventDefault();
	}

	// After timeout disable preventVerticalScrollAtEnds
	if (timeout) clearTimeout(timeout);
	timeout = setTimeout(() => {
		preventVerticalScrollAtEnds = false;
	}, 300);
}
