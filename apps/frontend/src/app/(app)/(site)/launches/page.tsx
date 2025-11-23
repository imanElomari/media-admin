export const dynamic = 'force-dynamic';
import { LaunchesComponent } from '@gitroom/frontend/components/launches/launches.component';
import { Metadata } from 'next';
import { getAppName } from '@gitroom/helpers/utils/get.app.name';
export const metadata: Metadata = {
  title: `${getAppName()} Calendar`,
  description: '',
};
export default async function Index() {
  return <LaunchesComponent />;
}
