/**
 * Guards for URLs that originate in registry data.
 *
 * Declaration fields like `location` and `rightsStatement` come from third
 * parties and are rendered as links. Restricting them to web URLs keeps a
 * hostile record from smuggling a `javascript:` or `data:` URI into a click
 * handler and executing in this origin.
 */
const SAFE_EXTERNAL_URL = /^https?:\/\//i;

/** True when `url` is a plain web URL, safe to use as a link target. */
export const isSafeExternalUrl = (url: string | undefined | null): url is string =>
  !!url && SAFE_EXTERNAL_URL.test(url);

/** Opens `url` in a new tab — only when it passes {@link isSafeExternalUrl}. */
export const openExternalUrl = (url: string | undefined | null): void => {
  if (isSafeExternalUrl(url)) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
