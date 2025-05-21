"use client"

import { useModel } from "@/context/model-context"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, ChevronRight, MessageCircle, Zap, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModelCategory } from "@/components/model-category"
import { ApiStatusChecker } from "@/components/api-status-checker"

export function ModelSelector() {
  const { selectedModel, setSelectedModel, availableModels, chatSessions, createNewChat } = useModel()

  // Group models by provider
  const groupedModels = availableModels.reduce(
    (acc, model) => {
      if (!acc[model.provider]) {
        acc[model.provider] = []
      }
      acc[model.provider].push(model)
      return acc
    },
    {} as Record<string, typeof availableModels>,
  )

  return (
    <div className="w-64 bg-gray-950 border-r border-gray-800 h-screen flex flex-col">
      <div className="p-3 border-b border-gray-800">
        <Button
          variant="outline"
          className="w-full justify-start text-white border-white/20 bg-gray-800 hover:bg-gray-700"
          onClick={createNewChat}
        >
          <Plus className="h-4 w-4 mr-2" />
          New chat
        </Button>
      </div>
      <div className="p-3 border-b border-gray-800">
        <h2 className="font-semibold text-lg text-white">Multi-Provider AI Chat</h2>
        <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
          <Zap className="h-3 w-3" /> API Status: <ApiStatusChecker />
        </p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {Object.entries(groupedModels).map(([provider, models]) => (
            <div key={provider} className="mb-4">
              <h3 className="text-sm font-medium text-gray-400 px-3 py-2 uppercase">
                {provider === "openai" ? "OpenAI" : "Anthropic"}
              </h3>
              {models.map((model) => {
                // Count chats for this model
                const modelChats = Object.values(chatSessions).filter(
                  (session) => session.modelId === model.id && session.messages.length > 0,
                )

                const hasChats = modelChats.length > 0

                return (
                  <Button
                    key={`${model.provider}-${model.id}`}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start mb-1 text-left text-gray-300 hover:bg-gray-800",
                      selectedModel.id === model.id && "bg-gray-800",
                    )}
                    onClick={() => setSelectedModel(model)}
                  >
                    <div className="flex items-center w-full">
                      <div className="mr-2 h-5 w-5 flex items-center justify-center">
                        {selectedModel.id === model.id ? (
                          <Check className="h-4 w-4" />
                        ) : hasChats ? (
                          <MessageCircle className="h-4 w-4 text-blue-400" />
                        ) : null}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{model.name}</div>
                        <div className="flex items-center mt-1">
                          <ModelCategory modelId={model.id} />
                          {hasChats && (
                            <span className="ml-2 text-xs text-gray-400">
                              {modelChats.length} {modelChats.length === 1 ? "chat" : "chats"}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </div>
                  </Button>
                )
              })}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
