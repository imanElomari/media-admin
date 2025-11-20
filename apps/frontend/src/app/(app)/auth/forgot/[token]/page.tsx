export const dynamic = 'force-dynamic';
import { ForgotReturn } from '@gitroom/frontend/components/auth/forgot-return';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
import { BRAND_TITLE } from '../../../../lib/branding';
export const metadata: Metadata = {
  title: `${BRAND_TITLE} Forgot Password`,
  description: '',
};
export default async function Auth(params: {
  params: {
    token: string;
  };
}) {
  return <ForgotReturn token={params.params.token} />;
}
