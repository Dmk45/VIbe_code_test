"use client"

import { useModel } from "@/context/model-context"
import { Info } from "lucide-react"

export function ReasoningInfo() {
  const { selectedModel } = useModel()
  const isReasoningModel = selectedModel.id.startsWith("o1")

  if (!isReasoningModel) {
    return null
  }

  return (
    <div className="bg-black border-b border-gray-800 p-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Info className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">Using OpenAI Reasoning Model</h3>
            <p className="text-sm text-gray-400 mt-1">
              You're using {selectedModel.name}, which is optimized for complex reasoning tasks. This model excels at
              step-by-step problem solving, logical deduction, and mathematical reasoning.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
