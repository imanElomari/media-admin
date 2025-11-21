import { Metadata } from 'next';
import { Agent } from '@gitroom/frontend/components/agents/agent';
import { getAppName } from '@gitroom/helpers/utils/get.app.name';
export const metadata: Metadata = {
  title: `${getAppName()} - Agent`,
  description: '',
};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Agent>{children}</Agent>;
}
