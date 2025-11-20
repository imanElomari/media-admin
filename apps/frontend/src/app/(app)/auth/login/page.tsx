export const dynamic = 'force-dynamic';
import { Login } from '@gitroom/frontend/components/auth/login';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
import { BRAND_TITLE } from '../../../lib/branding';
export const metadata: Metadata = {
  title: `${BRAND_TITLE} Login`,
  description: '',
};
export default async function Auth() {
  return <Login />;
}
