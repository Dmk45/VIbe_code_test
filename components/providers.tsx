"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { ModelProvider } from "@/context/model-context"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ModelProvider>
        {children}
        <Toaster />
      </ModelProvider>
    </ThemeProvider>
  )
}
