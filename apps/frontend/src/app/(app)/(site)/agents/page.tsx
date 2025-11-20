import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { BRAND_TITLE } from '../../../lib/branding';

export const metadata: Metadata = {
  title: `${BRAND_TITLE} - Agent`,
  description: '',
};

export default async function Page() {
  return redirect('/agents/new');
}
