import { Metadata } from 'next';
import { Agent } from '@gitroom/frontend/components/agents/agent';
import { BRAND_TITLE } from '../../../lib/branding';
export const metadata: Metadata = {
  title: `${BRAND_TITLE} - Agent`,
  description: '',
};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Agent>{children}</Agent>;
}
