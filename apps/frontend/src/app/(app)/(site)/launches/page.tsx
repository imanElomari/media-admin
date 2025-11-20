export const dynamic = 'force-dynamic';
import { LaunchesComponent } from '@gitroom/frontend/components/launches/launches.component';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
import { BRAND_TITLE } from '../../../lib/branding';
export const metadata: Metadata = {
  title: `${BRAND_TITLE} Launches`,
  description: '',
};
export default async function Index() {
  return <LaunchesComponent />;
}
