import { createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"
import { basePath } from "./lib/app-path"

export const getRouter = () =>
  createRouter({
    routeTree,
    scrollRestoration: true,
    basepath: basePath || undefined,
  })

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
