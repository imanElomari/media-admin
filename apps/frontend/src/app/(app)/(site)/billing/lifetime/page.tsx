import { LifetimeDeal } from '@gitroom/frontend/components/billing/lifetime.deal';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
import { BRAND_TITLE } from '../../../lib/branding';
export const metadata: Metadata = {
  title: `${BRAND_TITLE} Lifetime deal`,
  description: '',
};
export default async function Page() {
  return <LifetimeDeal />;
}
