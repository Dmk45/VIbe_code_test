import { NextResponse } from "next/server"

export async function GET() {
  // Check if API keys are set
  const openaiKey = process.env.OPENAI_API_KEY
  const anthropicKey = process.env.ANTHROPIC_API_KEY

  return NextResponse.json({
    status: "API route is working",
    environment: {
      openaiKeySet: !!openaiKey,
      openaiKeyPreview: openaiKey
        ? `${openaiKey.substring(0, 3)}...${openaiKey.substring(openaiKey.length - 3)}`
        : null,
      anthropicKeySet: !!anthropicKey,
      anthropicKeyPreview: anthropicKey
        ? `${anthropicKey.substring(0, 3)}...${anthropicKey.substring(anthropicKey.length - 3)}`
        : null,
      nodeVersion: process.version,
      runtime: process.env.NEXT_RUNTIME || "unknown",
    },
  })
}
