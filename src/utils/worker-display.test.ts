import { describe, expect, it } from "vitest"

import type { SurrealWorker } from "@/types/surreal-records"

import { compareWorkersForDisplay, getWorkerDisplayName, getWorkerNodeId } from "./worker-display"

const worker = (overrides: Partial<SurrealWorker> = {}): SurrealWorker => ({
  id: "worker:celery@abc123def456",
  hostname: "celery@abc123def456",
  last_updated: "2026-01-01T00:00:00Z",
  status: "online",
  ...overrides,
})

describe("getWorkerDisplayName", () => {
  it("uses active queue names when inspect data is present", () => {
    const record = worker({
      inspect: JSON.stringify({
        active_queues: [{ name: "main-analytic-events" }, { name: "default" }],
      }),
    })

    expect(getWorkerDisplayName(record)).toBe("main-analytic-events, default")
  })

  it("falls back to hostname when it is not a docker container id", () => {
    const record = worker({ hostname: "celery@worker-host-1", inspect: undefined })

    expect(getWorkerDisplayName(record)).toBe("worker-host-1")
  })

  it("falls back to celery prefix for docker container hostnames without inspect", () => {
    const record = worker({ hostname: "celery@544156f07d8b", inspect: undefined })

    expect(getWorkerDisplayName(record)).toBe("celery")
  })
})

describe("compareWorkersForDisplay", () => {
  it("sorts by display name instead of last_updated", () => {
    const defaultWorker = worker({
      id: "worker:celery@111111111111",
      hostname: "celery@111111111111",
      last_updated: "2026-01-02T00:00:00Z",
      inspect: JSON.stringify({ active_queues: [{ name: "default" }] }),
    })
    const periodicWorker = worker({
      id: "worker:celery@222222222222",
      hostname: "celery@222222222222",
      last_updated: "2026-01-01T00:00:00Z",
      inspect: JSON.stringify({ active_queues: [{ name: "periodic_jobs" }] }),
    })

    expect(compareWorkersForDisplay(defaultWorker, periodicWorker)).toBeLessThan(0)
    expect(getWorkerNodeId(defaultWorker)).toBe("celery@111111111111")
  })
})
