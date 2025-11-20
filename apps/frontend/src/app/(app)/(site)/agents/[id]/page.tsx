import { Metadata } from 'next';
import { BRAND_TITLE } from '../../../lib/branding';
import { Agent } from '@gitroom/frontend/components/agents/agent';
import { AgentChat } from '@gitroom/frontend/components/agents/agent.chat';
export const metadata: Metadata = {
  title: `${BRAND_TITLE} - Agent`,
  description: '',
};
export default async function Page() {
  return (
    <AgentChat />
  );
}
