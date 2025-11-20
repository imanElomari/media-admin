export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { AfterActivate } from '@gitroom/frontend/components/auth/after.activate';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
import { BRAND_TITLE } from '../../../../lib/branding';
export const metadata: Metadata = {
  title: `${
  BRAND_TITLE
  } - Activate your account`,
  description: '',
};
export default async function Auth() {
  return <AfterActivate />;
}
