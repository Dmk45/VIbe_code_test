import { Providers } from "@/components/providers"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatInterface } from "@/components/chat-interface"
import { ReasoningInfo } from "@/components/reasoning-info"
import { ClaudeReasoningInfo } from "@/components/claude-reasoning-info"
import { ChatSessionsManager } from "@/components/chat-sessions-manager"
import { ModelSelectorHeader } from "@/components/model-selector-header"

export default function Home() {
  return (
    <Providers>
      <div className="flex min-h-screen bg-black">
        <ChatSidebar />
        <main className="flex-1">
          <div className="h-full flex flex-col">
            <ModelSelectorHeader />
            <ChatSessionsManager />
            <ReasoningInfo />
            <ClaudeReasoningInfo />
            <ChatInterface />
          </div>
        </main>
      </div>
    </Providers>
  )
}
