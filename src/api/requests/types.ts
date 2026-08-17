import type { ISearchResult } from '~/api/types/declaration';

/** Response shape of every declaration-search route. */
export interface IGetDeclarationsSearchResponse {
  /** Echoed back by the ISCC search route only. */
  iscc?: string;
  results: ISearchResult[];
}

/** Response of the external ISCC generation service. */
export interface IGetFileIsccResponse {
  iscc: string;
  thumbnail: string;
  mediatype: string;
}
