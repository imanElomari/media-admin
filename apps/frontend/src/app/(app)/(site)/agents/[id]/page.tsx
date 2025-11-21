import { Metadata } from 'next';
import { Agent } from '@gitroom/frontend/components/agents/agent';
import { AgentChat } from '@gitroom/frontend/components/agents/agent.chat';
import { getAppName } from '@gitroom/helpers/utils/get.app.name';
export const metadata: Metadata = {
  title: `${getAppName()} - Agent`,
  description: '',
};
export default async function Page() {
  return (
    <AgentChat />
  );
}
