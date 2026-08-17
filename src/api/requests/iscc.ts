import type { AxiosRequestConfig } from 'axios';

import { ISCC_GENERATE_ENDPOINT } from '~/shared/constants';

import { isccApi } from '../http';
import type { IGetFileIsccResponse } from './types';

/**
 * Derives an ISCC content code from a local file.
 *
 * Used by the explorer's drag-and-drop search so a user can find declarations
 * for a file they hold without knowing its identifier. The file is sent to the
 * ISCC service for fingerprinting only; it is not stored.
 */
export const getFileIscc = (file: File, filename: string, config?: AxiosRequestConfig) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('filename', filename);

  return isccApi.post<IGetFileIsccResponse>(ISCC_GENERATE_ENDPOINT, formData, config);
};
