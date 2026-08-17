'use client';

import { DeclarationsTable } from '~/components/organisms';

/** Search results for a single identifier. */
export default function ExplorerResultsPage({ params: { iscc } }: { params: { iscc: string } }) {
  return <DeclarationsTable query={decodeURIComponent(iscc)} />;
}
