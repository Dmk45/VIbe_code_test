import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"
import { NextResponse } from "next/server"
import type { AnthropicProviderOptions } from "@ai-sdk/anthropic"

// Create a provider registry to manage all providers
import { createProviderRegistry } from "ai"

// Set up the provider registry with only OpenAI and Anthropic
const registry = createProviderRegistry({
  openai,
  anthropic,
})

export const runtime = "nodejs" // Use Node.js runtime for better performance

export async function POST(req: Request) {
  console.log("API route called")

  try {
    const { messages, provider, modelId } = await req.json()

    console.log(`Provider: ${provider}, Model: ${modelId}`)
    console.log(`Messages count: ${messages.length}`)

    // Get the model from the registry using the provider:modelId format
    const modelString = `${provider}:${modelId}`
    console.log(`Using model: ${modelString}`)

    const model = registry.languageModel(modelString)

    // Format messages for the AI SDK
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Set up provider-specific options
    const providerOptions: { anthropic?: AnthropicProviderOptions } = {}

    // Enable extended thinking for Claude 3.7
    if (provider === "anthropic" && modelId.includes("claude-3-7")) {
      providerOptions.anthropic = {
        thinking: { type: "enabled", budgetTokens: 12000 },
      }
    }

    // Create a new Response with a readable stream
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // Send an initial message to indicate the stream has started
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "status",
              text: "Connecting to AI model...",
            })}\n\n`,
          ),
        )

        let fullText = ""

        try {
          console.log("Starting streamText")

          await streamText({
            model,
            messages: formattedMessages,
            providerOptions,
            onChunk: (chunk) => {
              if (chunk.type === "text-delta") {
                // Send the text chunk to the client
                const text = chunk.text
                fullText += text

                const data = JSON.stringify({
                  type: "chunk",
                  text: text,
                })

                controller.enqueue(encoder.encode(`data: ${data}\n\n`))
                console.log(`Sent chunk: ${text.substring(0, 20)}${text.length > 20 ? "..." : ""}`)
              }
            },
            onFinish: () => {
              // Send the final message and close the stream
              const data = JSON.stringify({
                type: "done",
                text: fullText,
              })

              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
              controller.close()
              console.log("Stream finished")
            },
          })
        } catch (error) {
          console.error("Error in streamText:", error)

          // Send error message if something goes wrong during streaming
          const errorData = JSON.stringify({
            type: "error",
            text: `An error occurred while generating the response: ${error instanceof Error ? error.message : String(error)}`,
          })

          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      },
    })

    // Return a streaming response
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Error in chat route:", error)
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
