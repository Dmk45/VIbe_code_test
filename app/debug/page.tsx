import { ApiDebug } from "@/components/api-debug"
import { SimpleChatTest } from "@/components/simple-chat-test"

export default function DebugPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">API Debugging</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Use this page to diagnose issues with the AI model API connections.
      </p>

      <div className="max-w-3xl">
        <ApiDebug />
        <SimpleChatTest />
      </div>
    </div>
  )
}
