import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { generateText } from "ai"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { messages, provider, modelId } = await req.json()

    console.log(`Simple chat API called - Provider: ${provider}, Model: ${modelId}`)
    console.log(`Messages count: ${messages.length}`)

    // Check if the required API key is set
    if (provider === "openai" && !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not set. Please add OPENAI_API_KEY to your environment variables." },
        { status: 401 },
      )
    }

    if (provider === "anthropic" && !process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Anthropic API key is not set. Please add ANTHROPIC_API_KEY to your environment variables." },
        { status: 401 },
      )
    }

    // Use a simple non-streaming approach for testing
    try {
      let model
      if (provider === "openai") {
        model = openai(modelId)
      } else if (provider === "anthropic") {
        model = anthropic(modelId)
      } else {
        throw new Error(`Unsupported provider: ${provider}`)
      }

      const formattedMessages = messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }))

      console.log("Calling generateText with model:", `${provider}:${modelId}`)

      const result = await generateText({
        model,
        messages: formattedMessages,
      })

      console.log("Response received, length:", result.text.length)

      return NextResponse.json({ text: result.text })
    } catch (error) {
      console.error("Error generating text:", error)
      return NextResponse.json(
        {
          error: "Failed to generate text",
          details: error instanceof Error ? error.message : String(error),
          provider,
          modelId,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in simple chat route:", error)
    return NextResponse.json(
      { error: "Failed to process request", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
