"use client"
import { Badge } from "@/components/ui/badge"

export function ModelCategory({ modelId }: { modelId: string }) {
  // Determine the model category based on the model ID
  const getModelCategory = (id: string) => {
    if (id.startsWith("o1")) {
      return {
        name: "Reasoning",
        variant: "reasoning" as const,
      }
    } else if (id.includes("claude-3-7")) {
      return {
        name: "Advanced Reasoning",
        variant: "reasoning" as const,
      }
    } else if (id.includes("claude-3-opus")) {
      return {
        name: "High Performance",
        variant: "anthropic" as const,
      }
    } else if (id.includes("claude")) {
      return {
        name: "Claude",
        variant: "anthropic" as const,
      }
    } else if (id.includes("gpt-4o")) {
      return {
        name: "GPT-4o",
        variant: "default" as const,
      }
    } else if (id.includes("gpt-3.5")) {
      return {
        name: "GPT-3.5",
        variant: "default" as const,
      }
    } else {
      return {
        name: "General",
        variant: "default" as const,
      }
    }
  }

  const category = getModelCategory(modelId)

  return (
    <Badge
      variant={category.variant}
      className={
        category.variant === "reasoning"
          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
          : category.variant === "anthropic"
            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            : undefined
      }
    >
      {category.name}
    </Badge>
  )
}
