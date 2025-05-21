"use client"

import { useModel } from "@/context/model-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { ModelCategory } from "@/components/model-category"
import { useMemo, useState } from "react"

interface ModelSelectorDropdownProps {
  onSelect: (provider: string, modelId: string) => void
  buttonClassName?: string
}

export function ModelSelectorDropdown({ onSelect, buttonClassName }: ModelSelectorDropdownProps) {
  const { availableModels, selectedModel } = useModel()
  const [open, setOpen] = useState(false)

  // Group models by provider - memoized to prevent unnecessary recalculations
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

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-white border-white/20 bg-gray-800 hover:bg-gray-700",
            buttonClassName,
          )}
        >
          <span className="flex items-center">
            <span>{selectedModel.name}</span>
          </span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 max-h-[70vh] overflow-auto bg-gray-900 border-gray-800 text-gray-300 z-50"
        align="end"
        sideOffset={5}
        forceMount
      >
        {Object.entries(groupedModels).map(([provider, models]) => (
          <div key={provider}>
            <DropdownMenuLabel className="text-gray-400 sticky top-0 bg-gray-900 z-10">
              {provider === "openai" ? "OpenAI" : "Anthropic"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuGroup>
              {models.map((model) => (
                <DropdownMenuItem
                  key={`${model.provider}-${model.id}`}
                  className={cn(
                    "cursor-pointer hover:bg-gray-800 focus:bg-gray-800 py-3",
                    selectedModel.id === model.id && selectedModel.provider === model.provider && "bg-gray-800",
                  )}
                  onClick={() => {
                    onSelect(model.provider, model.id)
                    setOpen(false)
                  }}
                >
                  <div className="flex flex-col w-full">
                    <span className="font-medium">{model.name}</span>
                    <div className="mt-1">
                      <ModelCategory modelId={model.id} />
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-gray-800" />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
