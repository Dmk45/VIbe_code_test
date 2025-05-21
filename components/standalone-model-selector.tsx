"use client"

import { useModel } from "@/context/model-context"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"
import { ModelCategory } from "@/components/model-category"
import { useState, useMemo } from "react"

interface StandaloneModelSelectorProps {
  onSelect?: (provider: string, modelId: string) => void
}

export function StandaloneModelSelector({ onSelect }: StandaloneModelSelectorProps = {}) {
  const { availableModels, selectedModel, setSelectedModel } = useModel()
  const [isOpen, setIsOpen] = useState(false)

  // Group models by provider
  const groupedModels = useMemo(() => {
    return availableModels.reduce(
      (acc, model) => {
        if (!acc[model.provider]) {
          acc[model.provider] = []
        }
        acc[model.provider].push(model)
        return acc
      },
      {} as Record<string, typeof availableModels>,
    )
  }, [availableModels])

  const handleModelSelect = (model: (typeof availableModels)[0]) => {
    if (onSelect) {
      onSelect(model.provider, model.id)
    } else {
      setSelectedModel(model)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="w-full justify-between text-white border-white/20 bg-gray-800 hover:bg-gray-700 py-2 px-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          <span>{selectedModel.name}</span>
        </span>
        <ChevronDown className="h-4 w-4 ml-2" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-800 rounded-md shadow-lg z-50 max-h-[70vh] overflow-auto">
          {Object.entries(groupedModels).map(([provider, models]) => (
            <div key={provider}>
              <div className="sticky top-0 bg-gray-900 z-10 px-3 py-2 text-sm font-semibold text-gray-400">
                {provider === "openai" ? "OpenAI" : "Anthropic"}
              </div>
              <div className="border-t border-gray-800"></div>
              <div>
                {models.map((model) => (
                  <div
                    key={`${model.provider}-${model.id}`}
                    className={`px-3 py-3 cursor-pointer hover:bg-gray-800 ${
                      selectedModel.id === model.id && selectedModel.provider === model.provider ? "bg-gray-800" : ""
                    }`}
                    onClick={() => handleModelSelect(model)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{model.name}</span>
                        <div className="mt-1">
                          <ModelCategory modelId={model.id} />
                        </div>
                      </div>
                      {selectedModel.id === model.id && selectedModel.provider === model.provider && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-800"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
