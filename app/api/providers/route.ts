import { NextResponse } from "next/server"

// This endpoint returns information about available providers and their status
export async function GET() {
  // In a real application, you would check for API keys and return the status
  const providers = [
    {
      id: "openai",
      name: "OpenAI",
      status: process.env.OPENAI_API_KEY ? "configured" : "not_configured",
      models: ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo", "o1", "o1-mini", "o1-preview"],
    },
    {
      id: "anthropic",
      name: "Anthropic",
      status: process.env.ANTHROPIC_API_KEY ? "configured" : "not_configured",
      models: [
        "claude-3-7-sonnet-20250219",
        "claude-3-5-sonnet-20240620",
        "claude-3-haiku-20240307",
        "claude-3-opus-20240229",
      ],
    },
  ]

  return NextResponse.json({ providers })
}
