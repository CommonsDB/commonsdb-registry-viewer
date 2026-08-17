import { redirect } from 'next/navigation';

import { HOME_ROUTE } from '~/shared/constants';

export default function RootPage() {
  redirect(HOME_ROUTE);
}
