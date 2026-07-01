import { normalizeBasePath } from "../../runtime/url-prefix"

const viteBase = import.meta.env.BASE_URL ?? "/"

/** App base path without trailing slash, e.g. "" or "/celery-insights". */
export const basePath = normalizeBasePath(viteBase)

/** Prefixes a public/ asset filename with the Vite base URL. */
export function publicAssetPath(assetName: string): string {
  const viteBaseUrl = import.meta.env.BASE_URL ?? "/"
  const normalizedName = assetName.startsWith("/") ? assetName.slice(1) : assetName
  return `${viteBaseUrl}${normalizedName}`
}

/** Prefixes an absolute app route with the configured base path. */
export function appPath(routePath: string): string {
  const normalizedRoute = routePath.startsWith("/") ? routePath : `/${routePath}`

  if (!basePath) {
    return normalizedRoute
  }

  return `${basePath}${normalizedRoute}`
}
