"use client"
import { StandaloneModelSelector } from "@/components/standalone-model-selector"

export function ModelSelectorHeader() {
  return (
    <div className="bg-black border-b border-gray-800 p-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-white">Select AI Model</h2>
          <div className="w-80">
            <StandaloneModelSelector />
          </div>
        </div>
      </div>
    </div>
  )
}
