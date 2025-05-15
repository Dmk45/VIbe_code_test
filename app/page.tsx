import { Providers } from "@/components/providers"
import { ModelSelector } from "@/components/model-selector"
import { ChatInterface } from "@/components/chat-interface"
import { ReasoningInfo } from "@/components/reasoning-info"
import { ClaudeReasoningInfo } from "@/components/claude-reasoning-info"
import { ChatSessionsManager } from "@/components/chat-sessions-manager"

export default function Home() {
  return (
    <Providers>
      <div className="flex min-h-screen bg-black">
        <ModelSelector />
        <main className="flex-1">
          <div className="h-full flex flex-col">
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
