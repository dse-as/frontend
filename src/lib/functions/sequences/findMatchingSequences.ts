export type DocSequences = {
	[groupId: string]: {
		[sequenceId: string]: {
			name: string;
			docs: string[];
		};
	};
};

export type MatchResult = {
	[groupId: string]: {
		[sequenceId: string]: {
			name: string;
			docsBefore: string[];
			docsAfter: string[];
		};
	};
};

//  Finds all sequences across groups where the given docId appears.
export function findMatchingSequences(
	docSequences: DocSequences,
	docId: string,
	filterSeqIds: string[]
): MatchResult {
	const result: MatchResult = {};

	for (const groupId of Object.keys(docSequences)) {
		const group = docSequences[groupId];
		for (const sequenceId of Object.keys(group)) {
			const sequence = group[sequenceId];
			const idx = sequence.docs.indexOf(docId);
			const isFiltered = filterSeqIds.some((id) => id === sequenceId);
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
