import { ThirdPartyComponent } from '@gitroom/frontend/components/third-parties/third-party.component';

export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { getAppName } from '@gitroom/helpers/utils/get.app.name';
export const metadata: Metadata = {
  title: `${getAppName()} Integrations`,
  description: '',
};
export default async function Index() {
  return <ThirdPartyComponent />;
}
