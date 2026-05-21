import { doc_sequences as seqAll } from '$lib/data/doc_sequences.json';
import type { TDocKeys } from './documents/TDocuments';
import type { TPeopleKeys } from './register/TPeopleKeys';

// Full Sequence and Attributes
export type TSeq = typeof seqAll;
export type TSeqAttrs = {
	url_slug: string;
	name: string;
	preamble: string;
	personId?: TPeopleKeys;
	docs: TDocKeys[];
};

// Types
export type TSeqTypes = keyof TSeq;

// Keys
export type TSeqTextstufenKeys = keyof TSeq['textstufen'];
export type TSeqTravelsKeys = keyof TSeq['travels'];
export type TSeqCorrespondenceKeys = keyof TSeq['correspondence'];
export type TSeqSeriesKeys = keyof TSeq['series'];

export type TSeqKeys =
	| TSeqTextstufenKeys
	| TSeqTravelsKeys
	| TSeqCorrespondenceKeys
	| TSeqSeriesKeys;

export type TDictSeq = Record<
	string,
	{
		key_singular: string;
		label_plural: string;
		url_overview: string | null;
		label_overview: string | null;
		label_next: string;
		label_prev: string;
	}
>;

export type TSeqAll = Record<
	string,
	Record<string, { url_slug?: string | null; name?: string; preamble?: string; docs: string[] }>
>;
