import { ThirdPartyComponent } from '@gitroom/frontend/components/third-parties/third-party.component';

export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
import { BRAND_TITLE } from '../../../lib/branding';
export const metadata: Metadata = {
  title: `${
  `${BRAND_TITLE} Integrations`
  }`,
  description: '',
};
export default async function Index() {
  return <ThirdPartyComponent />;
}
