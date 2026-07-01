/** Normalizes BASE_PATH / URL_PREFIX to "" (root) or "/celery-insights" (no trailing slash). */
export function normalizeBasePath(value: string | undefined): string {
  if (value === undefined || value === "" || value === "/") {
    return ""
  }

  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`
  return withLeadingSlash.replace(/\/$/, "")
}

/** Strips configured base path before Bun routing (no-op when nginx already strips the prefix). */
export function stripBasePath(pathname: string, basePath: string): string {
  if (!basePath) {
    return pathname
  }

  if (pathname === basePath) {
    return "/"
  }

  if (pathname.startsWith(`${basePath}/`)) {
    const stripped = pathname.slice(basePath.length)
    return stripped || "/"
  }

  return pathname
}

/** Prefixes an app route path with the configured base path. */
export function withBasePath(basePath: string, routePath: string): string {
  const normalizedRoute = routePath.startsWith("/") ? routePath : `/${routePath}`

  if (!basePath) {
    return normalizedRoute
  }

  return `${basePath}${normalizedRoute}`
}
