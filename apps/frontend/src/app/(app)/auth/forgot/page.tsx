export const dynamic = 'force-dynamic';
import { Forgot } from '@gitroom/frontend/components/auth/forgot';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
import { BRAND_TITLE } from '../../../lib/branding';
export const metadata: Metadata = {
  title: `${BRAND_TITLE} Forgot Password`,
  description: '',
};
export default async function Auth() {
  return <Forgot />;
}
