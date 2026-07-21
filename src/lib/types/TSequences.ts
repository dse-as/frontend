import { doc_sequences as seqAll } from '$lib/data/doc_sequences.json';
import type { TDocKeys } from './documents/TDocuments';
import type { TPeopleKeys } from './register/TPeopleKeys';

// Full Sequence and Attributes
export type TSeq = typeof seqAll;
export type TSeqAttrs = {
	type?: string | null;
	url_seq_overview: string | null;
	name: string | null;
	intro?: string | null;
	preamble: string | null;
	personId?: TPeopleKeys | null;
	docs: TDocKeys[] | null;
};

// Types
export type TSeqTypes = keyof TSeq;

// Keys
export type TSeqTextstufenKeys = keyof TSeq['textstufen'];
export type TSeqTravelsKeys = keyof TSeq['travels'];
export type TSeqCorrespondenceKeys = keyof TSeq['correspondence'];
export type TSeqSeriesKeys = keyof TSeq['series'];
export type TSeqPhotoseriesKeys = keyof TSeq['photoseries'];

export type TSeqKeys =
	| TSeqTextstufenKeys
	| TSeqTravelsKeys
	| TSeqCorrespondenceKeys
	| TSeqSeriesKeys
	| TSeqPhotoseriesKeys;

export type TDictSeq = Record<
	string,
	{
		key_singular: string;
		label_plural: string;
		label_singular: string;
		label_seq_overview: string | null;
		label_next: string;
		label_prev: string;
	}
>;

export type TSeqAll = Record<string, Record<string, Partial<TSeqAttrs>>>;
