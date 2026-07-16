export function formatDateToGerman(isoDate: string): string {
	const date = new Date(isoDate);

	// Check if the date is valid
	if (isNaN(date.getTime())) {
		return `Invalid date format: ${isoDate}`;
	}
	
	const year = date.getFullYear();

	// Determine output based on the input length
	const parts = isoDate.split('-');
	if (parts.length === 1) {
		// YYYY
		return year.toString();
	} else if (parts.length === 2) {
		// YYYY-MM
		const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
		return new Intl.DateTimeFormat('de-DE', options).format(date);
	} else {
		// YYYY-MM-DD
		const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
		return new Intl.DateTimeFormat('de-DE', options).format(date);
	}
}

export function printBirthRange(dateBirth: string, dateDeath: string): string {
	if (dateBirth && dateDeath) return `${dateBirth}–${dateDeath}`;
	else if (dateBirth) return `*${dateBirth}`;
	else if (dateDeath) return `?–${dateDeath}`;
	else return '';
}

export function printDateRange(
	from: string | undefined | null,
	to: string | undefined | null
): string {
	if (from && to && from === to) return `${formatDateToGerman(from)}`;
	else if (from && to) return `${formatDateToGerman(from)} – ${formatDateToGerman(to)}`;
	else if (from) return `${formatDateToGerman(from)} – ?`;
	else if (to) return `? – ${formatDateToGerman(to)}`;
	else return '';
}
