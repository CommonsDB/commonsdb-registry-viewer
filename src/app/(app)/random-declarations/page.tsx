'use client';

import { RandomDeclarationsTable } from '~/components/organisms';

/** A random sample of registry declarations. */
export default function RandomDeclarationsPage() {
  return (
    <div className="flex size-full min-w-minWidthEntryList flex-col">
      <div className="mt-4 flex grow flex-row">
        <RandomDeclarationsTable />
      </div>
    </div>
  );
}
