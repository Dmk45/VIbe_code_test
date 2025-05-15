"use client"

import { useModel } from "@/context/model-context"
import { Lightbulb } from "lucide-react"

export function ClaudeReasoningInfo() {
  const { selectedModel } = useModel()
  const isClaudeReasoning = selectedModel.id.includes("claude-3-7")

  if (!isClaudeReasoning) {
    return null
  }

  return (
    <div className="bg-black border-b border-gray-800 p-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Lightbulb className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">Using Claude 3.7 with Extended Thinking</h3>
            <p className="text-sm text-gray-400 mt-1">
              Claude 3.7 Sonnet is Anthropic's most intelligent model with enhanced reasoning capabilities. It features
              extended thinking—the ability to solve complex problems with careful, step-by-step reasoning.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
