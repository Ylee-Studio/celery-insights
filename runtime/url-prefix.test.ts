import { describe, expect, it } from "vitest"

import { normalizeBasePath, stripBasePath, withBasePath } from "./url-prefix"

describe("normalizeBasePath", () => {
  it("returns empty string for root values", () => {
    expect(normalizeBasePath(undefined)).toBe("")
    expect(normalizeBasePath("")).toBe("")
    expect(normalizeBasePath("/")).toBe("")
  })

  it("normalizes subpath values", () => {
    expect(normalizeBasePath("/celery-insights")).toBe("/celery-insights")
    expect(normalizeBasePath("/celery-insights/")).toBe("/celery-insights")
    expect(normalizeBasePath("celery-insights")).toBe("/celery-insights")
  })
})

describe("stripBasePath", () => {
  it("returns pathname unchanged when base path is empty", () => {
    expect(stripBasePath("/api/config", "")).toBe("/api/config")
  })

  it("strips configured base path", () => {
    expect(stripBasePath("/celery-insights", "/celery-insights")).toBe("/")
    expect(stripBasePath("/celery-insights/", "/celery-insights")).toBe("/")
    expect(stripBasePath("/celery-insights/api/config", "/celery-insights")).toBe("/api/config")
  })

  it("leaves unrelated paths unchanged", () => {
    expect(stripBasePath("/api/config", "/celery-insights")).toBe("/api/config")
  })
})

describe("withBasePath", () => {
  it("prefixes route paths", () => {
    expect(withBasePath("/celery-insights", "/api/config")).toBe("/celery-insights/api/config")
    expect(withBasePath("", "/surreal/rpc")).toBe("/surreal/rpc")
  })
})
