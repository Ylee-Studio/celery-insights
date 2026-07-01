import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { Analytics } from "@vercel/analytics/react"
import { getRouter } from "./router"
import "./styles.css"

const router = getRouter()

function shouldEnableVercelAnalytics(): boolean {
  if (import.meta.env.DEV) {
    return false
  }

  if (typeof window === "undefined") {
    return false
  }

  return window.location.hostname.endsWith(".vercel.app")
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <>
      <RouterProvider router={router} />
      {shouldEnableVercelAnalytics() ? <Analytics /> : null}
    </>
  </StrictMode>,
)
