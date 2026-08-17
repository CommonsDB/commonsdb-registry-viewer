/**
 * Tests whether `pathname` is matched by `path`.
 *
 * A `*` segment in `path` matches any single segment, which is how the sidebar
 * keeps a nav item highlighted on the detail pages beneath it.
 */
export const matchPath = (pathname: string, path: string): boolean => {
  const pathParts = path.split('/');
  const pathnameParts = pathname.split('/');

  return pathParts.every((part, index) => part === '*' || part === pathnameParts[index]);
};
