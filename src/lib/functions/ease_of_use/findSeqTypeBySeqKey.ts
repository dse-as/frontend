import { doc_sequences } from '$lib/data/doc_sequences.json';

export function findSeqTypeBySeqKey(key: string | null): string | null {
	for (const type in doc_sequences) {
		if ((doc_sequences as Record<string, Record<string, unknown>>)[type][key!]) {
			return type;
		}
	}
	return null;
}
