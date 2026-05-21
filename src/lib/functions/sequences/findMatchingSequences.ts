export type TDocSequences = {
	[groupId: string]: {
		[sequenceId: string]: {
			name?: string;
			preamble?: string;
			url_slug?: string | null;
			docs: string[];
		};
	};
};

export type TMatchResult = {
	[groupId: string]: {
		[sequenceId: string]: {
			name?: string;
			docsBefore: string[];
			docsAfter: string[];
		};
	};
};

//  Finds all sequences across groups where the given docId appears.
export function findMatchingSequences(
	TDocSequences: TDocSequences,
	docId: string,
	filterSeqKeys: string[]
): TMatchResult {
	const result: TMatchResult = {};

	for (const groupId of Object.keys(TDocSequences)) {
		const group = TDocSequences[groupId];
		for (const sequenceId of Object.keys(group)) {
			const sequence = group[sequenceId];
			const idx = sequence.docs.indexOf(docId);
			const isFiltered = filterSeqKeys.some((id) => id === sequenceId);
			if (idx !== -1 && !isFiltered) {
				if (!result[groupId]) result[groupId] = {};
				result[groupId][sequenceId] = {
					name: sequence.name,
					docsBefore: sequence.docs.slice(0, idx),
					docsAfter: sequence.docs.slice(idx + 1)
				};
			}
		}
	}
	return result;
}
